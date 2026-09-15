# 커밋 메시지 컨벤션

> 참고: [AngularJS](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#-git-commit-guidelineses), [ESLint](https://eslint.org/docs/developer-guide/contributing/pull-requests#step-2-make-your-changes)

## 커밋 메시지 형식

```
<Type>: 한 줄 요약 (#이슈번호)

필요하다면 본문 설명

BREAKING CHANGE: 있는 경우에만 작성
```

- 한 줄이 100자를 넘지 않게 씁니다.
- 요약과 본문은 한국어로 씁니다.

기능 단위(도메인/화면)로 묶어서 작업할 때는 아래처럼 대괄호로 영역을 표시하는 방식도 같이 씁니다.

```
[캠퍼스] 팀원 모집 프로필 진입점 페이지 구현 (#1334)
[공통] Sentry KoinError 중복 이슈 수정 및 에러 참조 코드 노출 (#1320)
```

### Revert

```
revert: <되돌리는 커밋에 대한 설명>

This reverts commit <full-hash>
필요하면 추가 설명
```

### Type

다음 중 하나를 사용합니다.

- **feat**: 새 기능 추가
- **fix**: 버그 수정
- **docs**: 문서만 변경
- **style**: 코드 동작에 영향 없는 변경 (공백, 포매팅, 세미콜론 등)
- **refactor**: 기능 추가나 버그 수정이 아닌 코드 변경
- **perf**: 성능을 개선하는 변경
- **chore**: 빌드 프로세스나 보조 도구/라이브러리 변경 (문서 생성 등 포함)

이 저장소엔 테스트 스크립트가 없으니 `test` 타입은 쓰지 않습니다.

### 요약(Subject)

- "~한다" 체로 씁니다. ("변경한다" O, "변경했다"/"변경함" X)
- 마침표(.)는 붙이지 않습니다.
- 관련 GitHub 이슈 번호를 끝에 붙입니다. 완전히 해결하는 게 아니면 `(fixes #1234)` 대신 `(refs #1234)` 를 씁니다.

### 본문(Body)

- 마찬가지로 "~한다" 체로 씁니다.
- 왜 바꿨는지, 이전 동작과 뭐가 달라졌는지를 적습니다.

### BREAKING CHANGE

- 호환성이 깨지는 변경이 있을 때만 적습니다.
- `BREAKING CHANGE:` 로 시작하고, 뒤에 공백 하나 또는 줄바꿈 두 번을 둔 다음 내용을 이어 씁니다.

## License

The MIT License

Copyright (c) 2018 NHN Entertainment Corp.
