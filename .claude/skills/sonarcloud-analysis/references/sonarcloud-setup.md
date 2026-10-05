# SonarCloud 초기 설정 가이드

SonarCloud는 자체 호스팅이 아닌 클라우드 서비스(sonarcloud.io)이므로 별도 서버 설치가 필요 없다.

## 1. SonarCloud 계정 및 프로젝트 설정

1. [sonarcloud.io](https://sonarcloud.io)에서 GitHub 계정으로 로그인
2. 조직(Organization) 생성 또는 기존 GitHub 조직 연결
3. 새 프로젝트 추가 → KOIN_WEB_RECODE 저장소 선택
4. 프로젝트 키 확인 (기본값: `BCSDLab_KOIN_WEB_RECODE` 형태)

## 2. sonar-project.properties 생성

프로젝트 루트에 다음 파일을 생성한다:

```properties
# sonar-project.properties
sonar.projectKey=BCSDLab_KOIN_WEB_RECODE
sonar.organization=bcsdlab

sonar.sources=src
sonar.exclusions=src/generated/**,**/*.test.ts,**/*.test.tsx,**/__tests__/**

sonar.typescript.tsconfigPath=tsconfig.json
sonar.javascript.lcov.reportPaths=coverage/lcov.info
```

`sonar.projectKey`와 `sonar.organization`은 SonarCloud 프로젝트 설정 페이지에서 확인한다.

## 3. GitHub Actions에 SonarCloud 추가

별도 워크플로우 파일을 생성한다:

```yaml
# .github/workflows/sonarcloud.yml
name: SonarCloud Analysis

on:
  pull_request:
    branches: [develop, main]
  push:
    branches: [develop]

jobs:
  sonarcloud:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.11.1'

      - name: Enable Corepack
        run: corepack enable

      - name: Install dependencies
        run: yarn install

      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

`SONAR_HOST_URL`은 SonarCloud 사용 시 불필요하다.

## 4. GitHub Secrets 설정

GitHub 저장소 Settings > Secrets and variables > Actions에 추가:
- `SONAR_TOKEN`: SonarCloud Personal Access Token
  - 발급 위치: sonarcloud.io > My Account > Security > Generate Tokens

## 5. 로컬 환경변수 설정

```bash
# ~/.zshrc 또는 .env.local
export SONAR_ORGANIZATION=bcsdlab
export SONAR_PROJECT_KEY=BCSDLab_KOIN_WEB_RECODE
export SONAR_TOKEN=your-personal-access-token
```
