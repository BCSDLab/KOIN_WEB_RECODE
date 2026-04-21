---
name: sonarcloud-analysis
description: SonarCloud에서 KOIN 프로젝트 코드 이슈를 조회하고 분류하는 스킬. SonarCloud API 호출, 이슈 파싱, 수정 배치 생성을 수행한다. SonarCloud 분석, 이슈 조회, 코드 품질 확인, 정적 분석 결과 파싱 등을 요청할 때 반드시 이 스킬을 사용할 것. 단순 lint 실행이나 ESLint 관련 작업에는 사용하지 않는다.
---

# SonarCloud Analysis Skill

## 환경 설정 확인

SonarCloud를 처음 사용하는 경우 `references/sonarcloud-setup.md`를 읽어 설정 방법을 안내한다.

필수 환경변수:
```bash
SONAR_ORGANIZATION=your-organization-key   # sonarcloud.io 조직 키
SONAR_PROJECT_KEY=koin_web_recode
SONAR_TOKEN=your-personal-access-token     # sonarcloud.io > My Account > Security
```

`SONAR_HOST_URL`은 SonarCloud 사용 시 불필요하다 (항상 `https://sonarcloud.io`).

## 이슈 조회 API

SonarCloud는 Bearer 토큰 인증을 사용한다.

```bash
# 전체 이슈 조회 (페이지네이션 포함)
curl -H "Authorization: Bearer $SONAR_TOKEN" \
  "https://sonarcloud.io/api/issues/search?componentKeys=$SONAR_PROJECT_KEY&organization=$SONAR_ORGANIZATION&resolved=false&ps=500" \
  | jq '.'

# 심각도별 필터링
curl -H "Authorization: Bearer $SONAR_TOKEN" \
  "https://sonarcloud.io/api/issues/search?componentKeys=$SONAR_PROJECT_KEY&organization=$SONAR_ORGANIZATION&severities=BLOCKER,CRITICAL&resolved=false"

# 특정 규칙 필터링
curl -H "Authorization: Bearer $SONAR_TOKEN" \
  "https://sonarcloud.io/api/issues/search?componentKeys=$SONAR_PROJECT_KEY&organization=$SONAR_ORGANIZATION&rules=typescript:S1128"
```

## 이슈 분류 기준

| 심각도 | 자동 수정 가능 | 우선순위 |
|--------|--------------|--------|
| BLOCKER | 케이스별 판단 | 1순위 |
| CRITICAL | 대부분 가능 | 2순위 |
| MAJOR | 가능 | 3순위 |
| MINOR | 가능 | 4순위 |

## 자동 수정 불가 이슈 패턴

다음 이슈는 `skipped_issues`로 분류한다:
- 보안 핫스팟 (Security Hotspot) — 수동 검토 필요
- 아키텍처 냄새 (Architecture smell) — 리팩토링 범위
- 중복 코드 (Duplication) — 구조적 변경 필요
- 복잡도 초과 (Complexity) — 비즈니스 로직 수정 필요

## 배치 생성 규칙

파일당 이슈가 몰린 경우를 방지하기 위해:
- 배치당 최대 파일 10개
- 배치당 최대 이슈 50개
- 같은 파일의 이슈는 동일 배치에 묶음

## 프로젝트 설정 (sonar-project.properties)

프로젝트 루트에 아직 `sonar-project.properties`가 없다면 `references/sonarcloud-setup.md`를 참조하여 생성한다.
