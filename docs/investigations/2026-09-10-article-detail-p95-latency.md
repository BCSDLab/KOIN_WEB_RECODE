# article_detail p95 지연 조사 (2026-09-10)

## 인시던트 개요

- **알림**: Sentry Metric Monitor — `prod-articles-p95-latency`
- **조건**: `p95(span.duration)` (지난 1시간, rolling window) > 1500ms
- **쿼리**: `koin.transaction_key:article_detail span.op:http.server`, environment `production`
- **평가값**: 1,511.406ms (임계값 대비 +0.76%)
- **Open period**: Opened 9/10 12:06 PM KST → Resolved 9/10 1:07 PM KST (약 1시간, 자동 회복)
- **참고**: 이 알림은 16일 전(8/25, 직전 production 배포 시점)부터 반복적으로 열렸다 닫혔다 하고 있음. 매번 1시간 내 자동 회복.
- `koin.transaction_key: article_detail`는 `/articles/[id]` 라우트에 붙는 커스텀 태그 (`sentry.server.config.ts` / `sentry.edge.config.ts`의 `getTransactionKey()`).

## 조사 중 정정된 오판 (중요 — 재조사 시 반복하지 말 것)

조사 과정에서 두 번 크게 틀렸다. 둘 다 처음 판단을 뒤집었으니 기록해둔다.

### 1. "로그인 사용자 트래픽 급증" 가설 → 기각

알림의 Attribute Comparison 패널이 open period 이벤트의 100%가 `auth_token_key`, `dnt`, `sec_gpc` 등 9개 속성을 갖고 있다고 보여줬다. 이걸 "로그인 사용자가 급증했다"로 처음 해석했으나:

- DNT/GPC는 평소 트래픽의 4~6%에서만 켜져 있는 프라이버시 설정이라, 점심시간이라고 급증할 이유가 없다.
- 구조적으로 nginx `location /` 캐시(60초, `$device_class` 키)는 인증 쿠키가 있으면 **무조건 캐시 우회**한다(`proxy_cache_bypass`/`proxy_no_cache`, 라우트 인지 없이 쿠키 유무만 봄). 그래서 익명 요청은 대부분 엣지 캐시에서 끝나 `http.server` span 자체가 안 남고, 로그인 요청만 항상 origin까지 도달해 span으로 잡힌다. → 표본 구성 자체가 "관측된 요청 = 로그인 요청" 쪽으로 편향되기 쉬운 구조이므로, 이 패널만으로 "로그인 사용자가 늘었다"고 결론 내릴 수 없다.

### 2. 시간창을 잘못 잡아서 "표본 부족, 알림 자체가 노이즈"로 오판

- 알림 조건은 **rolling 1시간 lookback**이다. "Opened: 12:06 PM"은 *12:06 PM 그 순간에 되돌아본 지난 1시간(11:06~12:06)*의 p95가 1500을 넘었다는 뜻이지, 12:06 이후가 문제 구간이라는 뜻이 아니다.
- 처음엔 이걸 못 챙기고 **12:00~13:00**(대부분 회복 이후 구간)을 조회했고, 거기서 `count(spans)` 툴팁이 20, disclaimer가 "Estimated from 14 matches of 2.4k spans"였다. `14 ÷ tracesSampleRate(0.7) ≈ 20`이 실제 count(spans)와 정확히 일치해서 "시간당 20건대, 표본 부족, 알림이 통계적으로 신뢰 불가"로 결론 내렸다.
- **정정된 시간창 11:06~12:06**으로 다시 보니: `count(spans)` 막대가 ~110·~150, disclaimer "180 matches of 5.5K spans" (180÷0.7≈257, 막대 합과 일치). **시간당 실제 요청량 200건대 — 표본 부족 아니었다.** 그리고 p95가 이 구간 내내 300ms→1.8s로 거의 선형 상승 — 진짜 부하 램프였다.

**교훈**: Sentry Explore에서 "이 시간대 확인해달라"고 할 땐 알림의 open/resolve 타임스탬프를 그대로 쓰지 말고, 알림 조건의 evaluation window(rolling/trailing 여부)를 먼저 확인할 것.

## 확인된 사실

### A. 확인된 증폭 메커니즘 — Next.js Link 자동 prefetch (코드로 재현·확정)

- `src/pages/articles/[id]/index.tsx`는 `getStaticProps` + `getStaticPaths`(ISR, `fallback: 'blocking'`, `revalidate: 600초`)만 쓴다. `getServerSideProps`나 `withCacheControl`은 안 씀 — 완전 공개 콘텐츠, 개인화 없음.
- `getStaticPaths`가 미리 빌드하는 건 `getArticles('', '1').slice(0, ARTICLE_HOT_PATH_LIMIT)` — **일반 목록 1페이지 상위 10개뿐** (이름과 달리 `getHotArticles()` 기준이 아니라 최신순 1페이지 기준).
- 목록류 컴포넌트(`ArticleList`, `MobileArticleList`, `HotArticle`, `ArticlesSearchResultList`)의 `<Link>`가 `prefetch` prop 없이 기본값(`true`)으로 쓰이고 있었음 → 뷰포트에 들어오는 링크마다 `/_next/data/.../articles/[id].json`을 백그라운드로 자동 요청.
- 목록 페이지당 10개 항목(`limit=10`, `APIDetail.ts:40`) → 목록 페이지 하나 열람 시 최대 10개 prefetch가 동시에 나갈 수 있음.
- **실제로 잡은 trace로 재현 확인**: `referer: koreatech.in/articles?page=15` (프리빌드 대상이 아닌 깊은 페이지)에서 같은 유저가 거의 같은 순간(1.4초 간격, 서로 실행 구간이 겹침)에 쏜 두 prefetch 중:
  - article 20968 (캐시 warm): **3.7ms**
  - article 20965 (캐시 cold, `getStaticProps` 재실행 + `koin.isr.fetch` 백엔드 호출 917ms 포함): **1.9초**
  - 둘 다 `http.request.header.purpose: prefetch`, `x-middleware-prefetch: 1` — **실사용자가 기다리는 클릭이 아니라 백그라운드 자동 요청**이었다.
- 결론: 아무도 안 읽는 목록 항목들 때문에 서버가 매번 콜드 `getStaticProps`(백엔드 호출 포함)를 도는 구조였고, 이게 `article_detail` p95를 실사용자 체감과 무관하게 끌어올리고 있었다.

### B. 원인이 특정되지 않은 두 번째 슬로우 trace 유형 (미해결)

같은 조사에서 잡은 또 다른 느린 trace(위의 "20965", 1.90s)의 waterfall을 열어보니:

- 자식 span이 `resolve page components`(exclusive_time 3.57ms) **하나뿐**. `getStaticProps`도 `koin.isr.fetch`도 없음.
- 즉 **이 요청은 콜드 렌더링을 하지도 않았는데** `http.server` span 전체는 1.90초 — 그 중 **1.896초가 어떤 span에도 안 잡힘.**
- 같은 순간의 "빠른" sibling(3.71ms)도 동일하게 span이 `resolve page components` 하나뿐이라, 두 trace의 구조 자체는 같은데 소요 시간만 500배 차이.
- 두 요청의 실행 구간이 겹친다(빠른 요청이 느린 요청 도중에 시작해서 먼저 끝남) → 이벤트 루프가 막혀 있었다면 불가능한 그림이므로, **CPU 포화/이벤트 루프 블로킹 가설은 이 데이터로 기각.** 1.9초는 뭔가를 비동기로 기다린 것인데, 그게 뭔지 Sentry span으로는 안 보인다.
- 유력하지만 미확인 후보: 클라이언트로의 **응답 전송(소켓 flush) 지연** — `next.config.mjs`에 `compress: false`가 설정돼 있어 이 라우트 응답이 무압축으로 나갈 가능성. Node HTTP 계측은 보통 소켓에 응답을 다 flush할 때까지를 `http.server` span으로 잰다.
- **확인 방법 (서버 접근 필요)**: 이 요청의 nginx access log에서 `$request_time`(클라이언트 기준 총 시간) vs `$upstream_response_time`(Next.js origin이 실제 걸린 시간)을 비교. upstream은 작고 request_time만 크면 네트워크 전송 문제로 확정, 둘 다 크면 origin 쪽 문제.
- 참고용 trace ID: 느린 쪽 `0db42855b8eb12e9` (article id 20965, 2026-09-10T03:01:48Z UTC 시작), 빠른 쪽 `59f15389fc019cf1` (article id 20968, 같은 유저/같은 순간).

### C. 인프라 컨텍스트 (검증됐지만 결론에 직접 쓰진 않은 것들)

- Production은 2 vCPU / ~1GB RAM AWS 인스턴스(`ip-172-31-29-186`, Node v24.14.1)에서 단일 프로세스로 15일+ 무재시작 가동 중 (`app_start_time: 2026-08-25T14:47:11Z`, 마지막 production 배포와 일치 — `gh run list --branch main`으로 확인, 이후 재배포 없음).
- 이 인스턴스 스펙 자체가 원인이라고 단정할 근거는 아직 없음(위 B의 자연실험이 CPU 포화 가설을 오히려 반박함). 다만 여유가 크지 않은 스펙이라는 점은 참고.
- 최근 production 배포(8/25 23:42 KST)는 이번 open period(9/10 12:06)와 16일 차이 — **배포로 인한 ISR 캐시 콜드스타트는 이번 발화의 직접 원인이 아님.**

## 적용한 코드 수정

브랜치의 diff 참고. 둘 다 `yarn typecheck`, `yarn lint:eslint` 통과 확인.

1. **`src/pages/articles/[id]/index.tsx`** — `getStaticProps`에서 `getArticle`/`getHotArticles`를 직렬 await 하던 것을 `Promise.all`로 병렬화 (개별 `.catch`는 유지해 hot articles 실패가 article 렌더를 막지 않도록). 콜드 패스에서 두 호출 시간이 비슷할 때 지연을 줄여줌 — 단, 실측 trace 기준으로는 article.detail(917ms)이 article.hot(42ms)보다 훨씬 커서 이번 인시던트의 직접 원인은 아니었음. 정확성/위생 차원의 개선.

2. **`prefetch={false}` 추가** (위 "A" 항목의 직접 수정):
   - `src/components/Articles/components/ArticleList/index.tsx`
   - `src/components/Articles/components/MobileArticleList/index.tsx`
   - `src/components/Articles/components/HotArticle/index.tsx`
   - `src/components/Articles/components/ArticlesSearchResultList/index.tsx`

   트레이드오프: prefetch를 끄면 실제로 글을 클릭했을 때 프리페치된 캐시 없이 그 자리에서 요청이 나가므로 클릭 시 체감 로딩이 다소 늘어난다. 대신 안 읽는 목록 항목들 때문에 서버가 매번 콜드 렌더를 도는 낭비는 없앤다. `ARTICLE_HOT_PATH_LIMIT` 상향은 검토했으나, 깊은 페이지(예: 15페이지)는 그걸로 못 덮어서 채택 안 함.

## 남은 액션

- [ ] **서버 nginx access log 확인** — 위 "B" 항목의 `0db42855b8eb12e9` 요청(article id 20965, 2026-09-10 03:01:48 UTC / 12:01:48 KST경) 전후로 `$request_time` vs `$upstream_response_time` 비교. 네트워크 전송 문제인지 origin 문제인지 확정.
- [ ] 위 결과에 따라 origin 쪽 문제로 판명되면 서버 리소스(CPU/메모리/이벤트루프 lag) 모니터링 추가 검토.
- [ ] prefetch 수정 배포 후 Sentry에서 `article_detail` p95 재관찰 — 콜드 prefetch로 인한 스파이크가 줄었는지 확인.
- [ ] 알림 자체 재검토: 이 알림은 "아무도 안 기다리는 백그라운드 prefetch"까지 user-facing p95로 재는 구조였다. prefetch 수정 이후에도 알림이 반복되면, 이 알림이 실제로 무엇을 측정해야 하는지(예: `purpose:prefetch` 제외, 또는 임계값/평가 윈도우 재조정) 재검토할 것.
