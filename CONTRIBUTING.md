# Install and Start Development Server

## 요구 환경

| 항목           | 버전                | 비고                                                   |
| -------------- | ------------------- | ------------------------------------------------------ |
| Node.js        | `.nvmrc` 참조       | 현재 24.14.1. `nvm use` 로 맞춰 주세요                 |
| Yarn           | 4.17.0              | 저장소에 포함돼 있습니다. 전역 설치는 하지 않습니다    |
| 패키지 매니저  | Yarn 4 (Berry) PnP  | **`npm install` 은 쓰면 안 됩니다**                    |

Yarn 은 `.yarn/releases/` 에 이미 커밋돼 있고, `packageManager` 필드로 버전이 고정돼 있습니다.
Corepack 을 켜두면(`corepack enable`) `yarn` 명령이 알아서 이 버전을 씁니다.
**Yarn Classic(yarn 1)을 따로 전역 설치할 필요는 없습니다.**

## 설치와 실행

```sh
git clone https://github.com/BCSDLab/KOIN_WEB_RECODE.git
cd KOIN_WEB_RECODE
nvm use              # .nvmrc 의 Node 버전으로 맞춘다
yarn install         # Zero-Install 이라 대부분 즉시 끝난다
yarn start           # 개발 서버 (next dev)
```

### 환경 변수

`.env.local` 을 만들고 아래 값을 채워 주세요. (`.env*` 은 gitignore 대상입니다)

```sh
NEXT_PUBLIC_API_PATH=
NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID=
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=
NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_SENTRY_DSN=
NEXT_PUBLIC_SENTRY_ENVIRONMENT=development
```

각 값은 팀 내부 문서나 GitHub Environment secret 을 보고 채우면 됩니다.
`NEXT_PUBLIC_API_PATH` 만 있으면 나머지는 비어 있어도 개발 서버는 잘 뜹니다.
다만 `NEXT_PUBLIC_API_PATH` 가 비어 있으면 프리렌더가 `localhost:80` 으로 붙으려다 빌드가 실패합니다.

## 주요 명령어

```sh
yarn start          # 개발 서버
yarn start:serve    # 프로덕션 서버 (yarn build 이후)
yarn build          # 프로덕션 빌드 (+ sitemap 생성)
yarn typecheck      # tsc --noEmit
yarn lint           # ESLint + Stylelint
```

커밋 전에 `yarn lint` 와 `yarn typecheck` 가 통과하는지 꼭 확인해 주세요. CI 에서도 둘 다 검사합니다.

## Zero-Install 주의사항

이 저장소는 의존성 아카이브(`.yarn/cache`)와 PnP 맵(`.pnp.cjs`)을 **git 에 그대로 커밋해둡니다.**
덕분에 클론만 하면 설치 없이 바로 돌아가지만, 대신 의존성을 바꿀 때는 생성된 파일까지 같이 커밋해야 합니다.

의존성을 추가·변경·삭제했다면 `yarn install` 을 돌린 뒤 아래 파일을 **전부** 커밋해 주세요.

- `package.json`
- `yarn.lock`
- `.yarn/cache/` (추가·삭제된 zip)
- `.pnp.cjs`
- `.pnp.loader.mjs`

CI 는 `yarn install --immutable` 로 검증하기 때문에 `yarn.lock` 이 어긋나면 그대로 실패합니다.

> 커밋된 캐시에는 설치할 때 쓴 플랫폼의 바이너리만 들어 있습니다. 그래서 CI(Linux)는
> `@next/swc-linux-x64-gnu` 같은 zip 을 매번 새로 받아오고, `--immutable-cache` 옵션은 못 씁니다.

Dependabot 은 GitHub Actions 만 갱신하도록 설정해뒀습니다. npm 의존성까지 넣으면 위 파일들을
같이 못 갱신해서 제외했고, 대신 `yarn up` 으로 수동으로 관리합니다. (`.github/dependabot.yml`)

## 에디터 설정 (VS Code)

PnP 는 `node_modules` 를 만들지 않기 때문에, 에디터가 TypeScript/ESLint 를 찾을 수 있도록 SDK 를 씁니다.
`.yarn/sdks` 와 `.vscode/settings.json` 은 이미 커밋돼 있어서 따로 할 일은 없습니다.
TypeScript 버전 선택 팝업이 뜨면 **Use Workspace Version** 을 골라 주세요.

SDK 를 다시 만들어야 하면:

```sh
yarn dlx @yarnpkg/sdks vscode
```

## 개발 플로우

- 개발 환경부터 세팅합니다
- 작업할 페이지나 기능은 이슈로 먼저 남깁니다
- 알맞은 브랜치에서 작업 브랜치를 땁니다
- `.claude/CLAUDE.md` 에 정리된 프로젝트 컨벤션(절대 경로 임포트, `ROUTES` 헬퍼, `isKoinError` 에러 핸들링, SSR 안전성 등)을 지켜서 개발합니다
- 커밋하기 전에 `yarn lint` 와 `yarn typecheck` 가 통과하는지 꼭 확인합니다
- 커밋 메시지는 [커밋 메시지 가이드](./commit-message-convention.md) 를 따라 씁니다

PR 을 열면 리뷰어 2명이 자동으로 지정됩니다. (`.github/workflows/PICK_REVIEWER.yml`)

## 브랜치 전략

[git-flow 변형 전략](https://techblog.woowahan.com/2553/) 을 쓰고 있습니다.

- main
  - 프로덕션 서버용 브랜치입니다
  - production 브랜치를 따로 두지 않고 main 을 그대로 씁니다
  - 버전 태그는 안 붙입니다
- feature
  - 브랜치 이름은 `feat/#1` 처럼 짓습니다. 숫자는 GitHub 이슈 번호입니다
  - develop 브랜치로 Pull Request 를 보냅니다
- develop
  - 개발 서버용 브랜치입니다
  - develop 에 머지되면 stage 서버로 자동 배포됩니다
  - 이번 작업을 배포하고 싶으면 main 브랜치로 Pull Request 를 보냅니다
