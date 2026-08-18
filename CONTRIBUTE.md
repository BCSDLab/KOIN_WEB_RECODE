# Install and Start Development Server

## 요구 환경

| 항목           | 버전                | 비고                                                   |
| -------------- | ------------------- | ------------------------------------------------------ |
| Node.js        | `.nvmrc` 참조       | 현재 24.14.1. `nvm use` 로 맞춘다                      |
| Yarn           | 4.17.0              | 저장소에 포함돼 있다. 전역 설치하지 않는다             |
| 패키지 매니저  | Yarn 4 (Berry) PnP  | **`npm install` 을 쓰면 안 된다**                      |

Yarn 은 `.yarn/releases/` 에 커밋돼 있고 `packageManager` 필드로 고정돼 있다.
Corepack 이 켜져 있으면(`corepack enable`) `yarn` 명령이 자동으로 그 버전을 쓴다.
**Yarn Classic(yarn 1)을 전역 설치할 필요가 없다.**

## 설치와 실행

```sh
git clone https://github.com/BCSDLab/KOIN_WEB_RECODE.git
cd KOIN_WEB_RECODE
nvm use              # .nvmrc 의 Node 버전으로 맞춘다
yarn install         # Zero-Install 이라 대부분 즉시 끝난다
yarn start           # 개발 서버 (next dev)
```

### 환경 변수

`.env.local` 을 만들고 아래 값을 채운다. (`.env*` 은 gitignore 대상이다)

```sh
NEXT_PUBLIC_API_PATH=
NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID=
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=
NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_SENTRY_DSN=
NEXT_PUBLIC_SENTRY_ENVIRONMENT=development
```

각 값은 팀 내부 문서나 GitHub Environment secret 을 참고해 채운다.
`NEXT_PUBLIC_API_PATH` 외에는 없어도 개발 서버가 뜬다.
비어 있으면 프리렌더가 `localhost:80` 으로 붙으려다 빌드가 실패한다.

## 주요 명령어

```sh
yarn start          # 개발 서버
yarn start:serve    # 프로덕션 서버 (yarn build 이후)
yarn build          # 프로덕션 빌드 (+ sitemap 생성)
yarn typecheck      # tsc --noEmit
yarn lint           # ESLint + Stylelint
```

커밋 전에 `yarn lint` 와 `yarn typecheck` 가 통과하는지 확인한다. CI 에서 둘 다 검사한다.

## Zero-Install 주의사항

이 저장소는 의존성 아카이브(`.yarn/cache`)와 PnP 맵(`.pnp.cjs`)을 **git 에 커밋한다.**
그래서 클론만 하면 설치 없이 바로 실행되지만, 의존성을 바꿀 때는 생성된 파일까지 함께 커밋해야 한다.

의존성을 추가·변경·삭제했다면 `yarn install` 후 아래 파일을 **모두** 커밋한다.

- `package.json`
- `yarn.lock`
- `.yarn/cache/` (추가·삭제된 zip)
- `.pnp.cjs`
- `.pnp.loader.mjs`

CI 는 `yarn install --immutable` 로 검증하므로 `yarn.lock` 이 어긋나면 실패한다.

> 커밋된 캐시에는 설치를 실행한 플랫폼의 바이너리만 들어 있다. 그래서 CI(Linux)는
> `@next/swc-linux-x64-gnu` 같은 zip 을 매번 새로 받고, `--immutable-cache` 는 쓸 수 없다.

Dependabot 은 GitHub Actions 만 갱신하도록 설정돼 있다. npm 의존성은 위 파일들을 함께
갱신하지 못해서 제외했고, `yarn up` 으로 수동 관리한다. (`.github/dependabot.yml`)

## 에디터 설정 (VS Code)

PnP 는 `node_modules` 를 만들지 않으므로 에디터가 TypeScript/ESLint 를 찾도록 SDK 를 쓴다.
`.yarn/sdks` 와 `.vscode/settings.json` 이 이미 커밋돼 있어서 별도 작업은 없다.
TypeScript 버전 선택 팝업이 뜨면 **Use Workspace Version** 을 고른다.

SDK 를 다시 만들어야 하면:

```sh
yarn dlx @yarnpkg/sdks vscode
```

## Development flow

- Set up your development environment
- Make an issue for responsible development page
- Make change from a right branch
- Develop your page with [code convention](https://github.com/airbnb/javascript)
- Be sure the code passes `yarn lint` and `yarn typecheck` before you commit
- If you want to write commit message, Follow our [commit message guide](./commit-message-convention.md)

PR 을 열면 리뷰어 2명이 자동으로 지정된다. (`.github/workflows/PICK_REVIEWER.yml`)

## Branch strategy

We are following [git-flow transformation strategy](https://techblog.woowahan.com/2553/).

- main
  - Branch for production server
  - We are using main branch instead of production branch
  - We don't use version tag
- feature
  - Make branch name like `feature/#1`. Number means github issue number
  - Make a Pull Request to develop branch
- develop
  - Branch for development server
  - develop 에 머지되면 stage 서버로 자동 배포된다
  - If you want to publish this version, Make a Pull Request to main branch
