---
name: doc-comments
description: KOIN 코드의 주석을 쓰거나 고칠 때 사용하는 스킬. TS/TSX의 `//`·`/** */`, JSX의 `{/* */}`, SCSS의 `//`, `eslint-disable`·`stylelint-disable` 사유 주석이 대상이다. 주석 작성·정리, 주석 리뷰, "주석 다듬어줘" 요청 시 사용할 것. 코드를 바꾸면서 주석도 추가·수정하는 경우 함께 로드한다. 자동 생성 파일(`src/generated/**`)과 마크다운 문서에는 사용하지 않는다.
---

# Doc Comments

원본: [biomejs/biome `.agents/skills/doc-comments`](https://github.com/biomejs/biome/blob/01188638b1ae123f4897c975dfd4a09128645b87/.agents/skills/doc-comments/SKILL.md). Rust/CLI/스키마 독자 구분은 KOIN에 해당하지 않아 빼고, KOIN의 실제 주석으로 다시 썼다.

## 독자를 먼저 정한다

KOIN 주석의 독자는 **이 저장소만 가진 미래의 BCSD 팀원**이다. 이 대화, PR, 이슈, Slack, private 저장소(`koin-parity` 등)는 볼 수 없다. 팀원 교체가 잦으므로 "지금 아는 사람끼리 통하는 말"이 가장 빨리 낡는다.

| 위치                                        | 독자가 보는 곳                    | 쓸 내용                                                                               |
| ------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------- |
| export된 훅·유틸·타입 필드의 `/** */`       | 호출부 IDE hover (소스를 안 연다) | 이름만으로 알 수 없는 계약: 반환 의미, `null`/기본값 조건, 호출 전제, 부작용          |
| 모듈 상단 `/** */`                          | 파일을 처음 연 사람               | 이 파일이 왜 따로 있는지, 지속되는 설계 이유. 항목 목록은 쓰지 않는다(금방 낡는다)    |
| 코드 사이 `//`, JSX `{/* */}`, SCSS `//`    | 해당 줄을 고치려는 사람           | 제약, 우회, 보이지 않는 결합, "왜 뻔한 구현이 틀렸는가"                               |
| `eslint-disable` / `stylelint-disable` 사유 | 규칙을 다시 켜려는 사람           | 이 위치에서 규칙이 틀린 이유. `-- 사유` 형식(ESLint `require-description`가 강제한다) |

좋은 예:

```ts
// src/utils/hooks/auth/useSession.ts
/** 서버 확인이 끝났는가. false인 동안 anonymous는 확정이 아니다. */
resolved: boolean;

// src/utils/timetable/semesterCookie.ts
/** 쿠키 원문은 신뢰할 수 없으므로 형식이 어긋나면 null로 취급한다. */
export function parseSemesterCookie(value: string | undefined): Semester | null {
```

이름과 타입이 말하지 않는 것(확정 여부, `null` 조건)만 적었다.

```ts
// src/utils/hooks/abTest/useABTestView.ts — 모듈 상단
/**
 * AB 배정은 클라이언트 전용이다.
 *
 * 배정 결과는 호출마다 달라질 수 있는데 응답 HTML이 공유 캐시되므로, 서버에서 배정하면
 * 그 변형이 다른 사용자에게 그대로 전달된다. (...)
 * useSuspenseQuery 는 enabled 를 무시하므로 useQuery 를 쓴다.
 */
```

프로젝트 원칙(서버 주입)의 예외인 이유와, 뻔해 보이는 "개선"(`useSuspenseQuery`)이 왜 틀린지를 먼저 막는다.

```tsx
// src/components/ui/Banner/index.tsx
// eslint-disable-next-line react-hooks/exhaustive-deps -- 모달이 열릴 때만 로깅해야 하므로 logger/currentBanner 변경은 무시
```

무엇을 무시하는지와 왜 안전한지를 함께 적어, 규칙을 다시 켜려는 사람이 조건이 아직 유효한지 바로 판단할 수 있다.

## 문체

- 한국어, 평서문 `~한다`/`~이다` 체. (`src` 기준 `~한다` 231건 : `~합니다` 18건)
- 현재 시제로 HEAD의 코드를 설명한다.
- 한 문장에 한 가지 생각. 필요한 용어는 같은 문단에서 풀어 쓴다.
- 코드 식별자·경로·값은 백틱으로 감싼다(JSDoc 안에서도 hover에 그대로 보인다).
- 이모지 금지.

## 금지 패턴

**다음 줄 낭독.** 코드에서 바로 읽히면 지운다.

```tsx
// BAD
{/* 카테고리 버튼 */}
<CategoryButton ... />
```

**이름 반복 JSDoc.** hover에 아무것도 더하지 않는다. 계약을 쓰거나 지운다.

```ts
// BAD — src/utils/ts/env.ts
/** isomorphic-localStorage */
export const isomorphicLocalStorage = createIsomorphicStorage('local');

// GOOD
/**
 * 서버나 저장소 접근이 막힌 브라우저에서도 던지지 않는 localStorage.
 * 이때 읽기는 `null`(JSON은 기본값)을 돌려주고 쓰기는 조용히 무시된다.
 */
```

**변경 이력 서술.** 무엇이 바뀌었는지는 커밋·PR에 남기고, 주석은 지금 왜 이런지를 쓴다.

```ts
// BAD — src/utils/ts/maskSensitive.ts
// consoleLoggingIntegration이 그 메시지를 그대로 Sentry Logs로 보내고 있었다.

// GOOD
// consoleLoggingIntegration이 이 메시지를 그대로 Sentry Logs로 보내므로 여기서 가린다.
```

`기존에는`, `이제는`, `~로 바꿨다`, `~하고 있었다`, `이번 수정으로` 같은 말이 보이면 다시 쓴다.

**리뷰어·작업자에게 말 걸기.** "버그 리포트의 케이스를 처리한다", "요청대로 수정" 같은 정당화는 PR 본문으로 옮긴다.

**사유 주석 중복.** disable 사유가 있으면 바로 위에 같은 말을 또 쓰지 않는다.

```tsx
// BAD — src/components/TimetablePage/components/Timetable/index.tsx
// index값이 변경되지 않음
// eslint-disable-next-line react/no-array-index-key -- 고정된 시간 눈금 배열이라 index가 변경되지 않음
```

**독자가 열 수 없는 맥락.** private 저장소·하네스의 ID나 내부 별칭은 이 저장소만 가진 사람에게 의미가 없다.

```ts
// BAD
// 경로·파라미터는 order와 같게 유지한다(parity G2)
// KOIN_ORDER_WEBVIEW src/api/shop/entity.ts (오라클 패치 적용본)에서 옮긴 ...
// Track B 이전이 끝나면 이 헤더도 바꾼다 (parity foundation D1)

// GOOD
// KOIN_ORDER_WEBVIEW와 같은 엔드포인트를 쓰므로 경로·파라미터를 바꿀 때 양쪽을 함께 맞춘다.
```

- 판단 기준: **이 저장소만 가진 사람이 그 말을 찾아볼 수 있는가.** `KOIN_ORDER_WEBVIEW`(BCSD 공개 저장소)와 그 제약은 써도 된다. `parity G2`·`Track A/B`·`D1`·`오라클`·`후보` 같은 하네스 용어는 쓰지 않는다.
- 같은 이유로 Slack 스레드, Notion 비공개 페이지, 개인 메모를 근거로 들지 않는다. 필요한 내용을 주석에 직접 쓴다.
- 공개 GitHub 이슈 링크는 우회·추적 중인 제약의 보조 근거로만 단다.

**모호한 얼버무림.** "일부 경우", "여러 이유로", "엣지 케이스 처리", "등"은 구체적인 경우와 이유로 바꾸거나 지운다.

**추적 없는 TODO.** `// TODO`·`// FIXME`는 무엇이 끝나면 지울 수 있는지(조건)를 함께 쓴다. 조건이 private 계획이라면 그 조건을 풀어 쓴다.

```ts
// BAD
// 이후 기존 로깅 변경이 완료되면 team은 제거한다.

// GOOD
// TODO: 모든 useLogger 호출이 event_name을 쓰게 되면 team 필드를 제거한다.
```

**구역 배너.** `// ----- helpers -----`, `// ==== TYPES ====` 를 새로 만들지 않는다. 파일이 길어 구역이 필요하면 파일을 나눈다.

## 기존 코드를 고칠 때

- **자동 생성 파일은 손대지 않는다.** `src/generated/**`(`yarn log` 출력), `analytics.events.json`은 생성 원본을 고친다.
- 동작이 바뀌어 주석이 틀려졌다면 그 문장을 정확히 고친다. 일반론으로 뭉개지 않는다.
- 맞는 세부 정보는 남긴다.
- **변경 범위 밖의 주석은 고치지 않는다.** 문체를 맞추려고 주변 주석을 일괄 수정하지 않는다. 별도 정리 작업으로 요청받았을 때만 한다.
- 주석을 지워서 호출부가 알아야 할 계약(`null` 조건, 호출 순서 등)이 사라지면 안 된다.

## 마무리 전 셀프 체크

변경된 주석만 뽑아, 구현을 보지 않고 읽는다.

```bash
# develop에서 갈라진 뒤 추가·수정된 주석 줄 (커밋 여부와 무관)
comments() {
  git diff -U0 "$(git merge-base develop HEAD)" -- src \
    | grep -E '^\+.*(//|/\*|\{/\*)|^\+\s*\*' | grep -v '^+++'
  # 아직 add하지 않은 새 파일
  git ls-files --others --exclude-standard src \
    | xargs -r grep -nE '(//|/\*|\{/\*)|^\s*\*'
}
comments
```

1. 각 주석의 독자(hover / 줄 수정자 / 규칙 재활성화자)를 정했는가.
2. 이 대화·PR·private 저장소 없이 이해되는가. 하네스 용어(`parity`, `Track`, `오라클` 등)가 없는가.
   ```bash
   comments | grep -E '(parity|Track [AB]|오라클|후보 화면|[^A-Za-z#][BDG][0-9]+\b)'
   ```
3. 코드에서 바로 읽히는 주석, 이름 반복 JSDoc을 지웠는가.
4. 변경 이력·리뷰어 대상 서술이 없는가(`기존에는`, `이제`, `바꿨다`, `있었다`).
5. disable 주석에 `-- 사유`가 있고, 위아래에 같은 말이 중복되지 않는가.
6. 변경 범위 밖 주석을 건드리지 않았는가.

## 참고

- [Biome philosophy](https://biomejs.dev/internals/philosophy/) — 사용자 소통 원칙
- [Diátaxis](https://diataxis.fr/) — 설명·레퍼런스·근거의 구분
- `eslint.config.mjs` — `@eslint-community/eslint-comments/require-description`, `reportUnusedDisableDirectives`
