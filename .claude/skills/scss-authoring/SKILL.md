---
name: scss-authoring
description: KOIN의 `*.module.scss`를 새로 쓰거나 고칠 때, 특히 Figma(Dev Mode·get_design_context) 값을 SCSS로 옮길 때 사용하는 스킬. 전역 reset-css·`src/pages/index.scss`가 이미 처리하는 선언과 CSS 초기값을 다시 쓰지 않도록 하고, 기본값처럼 보이지만 지우면 화면이 바뀌는 함정을 구분한다. 기존 SCSS 일괄 정리에는 시각 회귀 확인 없이 사용하지 않는다.
---

# SCSS Authoring

Figma Dev Mode는 요소 하나를 맥락 없이 완전하게 기술한다. KOIN은 전역 reset과 상속 위에서 그리므로, 그대로 옮기면 이미 적용된 값이 반복된다. **원칙: 화면을 바꾸는 선언만 쓴다.** 지워도 렌더 결과가 같다면 쓰지 않는다.

## 전역 기준

`src/pages/_app.tsx`가 `src/pages/index.scss`를 불러오고, 그 안에서 reset-css(Eric Meyer v5)를 적용한다.

| 대상                                                                                                            | 이미 적용된 값                                                              | 출처            |
| --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------- |
| 거의 모든 일반 요소(`div` `span` `p` `h1~h6` `a` `img` `ul` `ol` `li` `label` `form` `table` 계열 `section` 등) | `margin: 0; padding: 0; border: 0; font: inherit; vertical-align: baseline` | reset-css       |
| `ul` `ol` `menu`                                                                                                | `list-style: none`                                                          | reset-css       |
| `table`                                                                                                         | `border-collapse: collapse; border-spacing: 0`                              | reset-css       |
| `body`                                                                                                          | `line-height: 1`, Pretendard 글꼴 스택                                      | reset-css, 전역 |
| `a` `button` `input` `textarea` `select`                                                                        | `color: #000`, Pretendard 글꼴                                              | index.scss      |
| `a`                                                                                                             | `text-decoration: none`                                                     | index.scss      |
| `button`                                                                                                        | `border: none; background-color: transparent; padding: 0; cursor: pointer`  | index.scss      |

`font: inherit` 때문에 `strong` `b` `em` `h1` 등도 굵기·기울기·크기를 부모에서 물려받는다. 태그 자체에는 시각적 의미가 없다.

## 쓰지 않는다

아래는 같은 요소에 대한 **다른 규칙을 덮어쓰는 경우가 아니라면** 렌더 결과를 바꾸지 않는다.

| 선언                                                                                                            | 이유                                                                                                                                                |
| --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `font-family: Pretendard, sans-serif`                                                                           | `body`와 폼 요소에 이미 있다. next/font가 만든 글꼴 이름은 `pretendard`이고 글꼴 이름은 대소문자를 가리지 않아 같은 글꼴이다. 다른 글꼴일 때만 쓴다 |
| `font-style: normal`, `font-weight: 400`                                                                        | 부모 값을 상속한다. 부모가 굵거나 기울어 있을 때만 쓴다                                                                                             |
| 일반 요소의 `margin: 0`, `padding: 0`, `border: none/0`                                                         | reset이 처리한다                                                                                                                                    |
| `ul`/`ol`의 `list-style: none`, `a`의 `text-decoration: none`                                                   | reset·전역이 처리한다                                                                                                                               |
| `button`의 `border: none`, `background: none/transparent`, `padding: 0`, `cursor: pointer`                      | 전역 `button` 규칙이 처리한다                                                                                                                       |
| `order: 0`, `flex-grow: 0`, `flex-shrink: 1`                                                                    | CSS 초기값. Figma가 자식마다 붙인다                                                                                                                 |
| `flex-direction: row`, `flex-wrap: nowrap`, `justify-content: flex-start`                                       | CSS 초기값                                                                                                                                          |
| `position: static`, `opacity: 1`, `visibility: visible`, `z-index: auto`, `box-shadow: none`, `transform: none` | CSS 초기값                                                                                                                                          |
| `letter-spacing: 0`/`0px`/`0%`                                                                                  | 부모가 자간을 주지 않았다면 초기값(`normal`)과 같다                                                                                                 |

```scss
// BAD — src/components/ui/PageHeader/HeaderIconButton/HeaderIconButton.module.scss (<button>에 붙는 클래스)
.button {
  display: flex;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}

// GOOD
.button {
  display: flex;
}
```

```scss
// BAD — src/components/GraduationCalculatorPage/CalculatorHelpModal/CalculatorHelpModal.module.scss (Figma 그대로)
font-family: Pretendard, sans-serif;
font-size: 15px;
font-style: normal;
font-weight: 400;
line-height: 160%;

// GOOD
font-size: 15px;
line-height: 1.6;
```

## 기본값처럼 보이지만 지우면 바뀐다

| 선언                                                                                   | 이유                                                                                                                                               |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `box-sizing: border-box`                                                               | **전역 설정이 없다.** 지우면 `padding`·`border`만큼 요소가 커진다                                                                                  |
| `line-height: normal`                                                                  | `body`가 `line-height: 1`이라 `normal`(Pretendard 약 1.2)은 값을 바꾼다. Figma의 `normal`을 그대로 둘지 디자인과 비교해 정하고, 쓴다면 숫자로 쓴다 |
| `input` `textarea` `select`의 `border`, `padding`, `margin`, `background`, `font-size` | reset 대상이 아니다. 브라우저 기본 테두리·여백·13.33px 글자가 남는다. (`color`와 글꼴만 전역 처리)                                                 |
| `button`의 `font-size`, `font-weight`, `line-height`                                   | 전역 `button` 규칙은 테두리·배경·여백·커서만 지운다. 글자 크기·굵기·줄 간격은 브라우저 기본값(13.33px 등)이라 부모를 상속하지 않는다               |
| `flex: none`                                                                           | `0 0 auto`. 초기값은 `0 1 auto`라 "줄어들지 않음"이라는 의미가 있다                                                                                |
| `align-self: stretch`                                                                  | 초기값은 `auto`(부모 `align-items`를 따름). 부모가 `center`면 늘리는 효과가 있다. 부모가 `stretch`/기본값일 때만 지운다                            |
| `text-align: left`                                                                     | 상속된다. 부모가 `center`면 의미가 있다                                                                                                            |
| `outline: none`                                                                        | 초기값과 같아 보여도 브라우저의 `:focus-visible` 표시를 없앤다. 지우기 전에 포커스 표시를 의도했는지 확인한다                                      |
| 상태·미디어 블록 안의 값                                                               | `:hover`, `:disabled`, `&--active`, `media.media-breakpoint(mobile)` 안의 `opacity: 1`, `padding: 0` 등은 바깥 값을 되돌리는 선언이다              |
| 여러 클래스가 붙는 요소                                                                | `cn()`으로 다른 모듈·`className` prop의 클래스가 함께 붙으면, 그 값을 덮는 선언일 수 있다. TSX에서 붙는 클래스를 확인한다                          |

## Figma 값을 옮길 때

1. Figma 출력에서 위 "쓰지 않는다" 항목을 먼저 지운다.
2. `line-height`는 단위 없는 숫자로 쓴다(`160%` → `1.6`). `%`·`px`는 계산된 값이 자식에게 그대로 상속되어 글자 크기가 다른 자식에서 줄 간격이 어긋난다.
3. 미디어 쿼리는 `@use "src/utils/scss/media" as media;` 후 `@include media.media-breakpoint(mobile)`를 쓴다.
4. 모바일 상점·주문 화면(`components/Store/mobile`, `components/Order`)의 색은 `src/utils/scss/order-palette`의 변수를 쓴다. 그 밖의 화면은 공용 색 토큰이 없으므로 hex를 그대로 쓴다.
5. 요소 종류(`div`/`button`/`input`)를 TSX에서 확인한 뒤 전역 기준표와 맞춰 본다. 같은 선언도 요소에 따라 중복 여부가 다르다.

## 기존 코드를 고칠 때

- 변경 범위 밖의 중복 선언은 고치지 않는다. 기존 SCSS 일괄 정리는 선언을 빼고 화면을 비교하는 시각 회귀 확인과 함께 별도 작업으로 한다.
- 고치는 블록 안에서만 위 기준을 적용한다.

## 마무리 전 셀프 체크

추가·수정한 SCSS 줄에서 후보를 뽑고, 각 후보를 맥락(요소 종류, 부모, 상태 블록, 함께 붙는 클래스)으로 판단한다. 후보가 곧 오류는 아니다.

```bash
scss_added() {
  git diff -U0 "$(git merge-base develop HEAD)" -- 'src/**/*.scss' | grep -E '^\+[^+]'
  git ls-files --others --exclude-standard -- 'src/**/*.scss' | xargs -r grep -nE '.'
}
scss_added | grep -niE '(font-family:\s*pretendard|font-style:\s*normal|font-weight:\s*400|order:\s*0|flex-grow:\s*0|flex-shrink:\s*1|flex-direction:\s*row\b|flex-wrap:\s*nowrap|justify-content:\s*(flex-)?start|position:\s*static|opacity:\s*1;|visibility:\s*visible|z-index:\s*auto|box-shadow:\s*none|transform:\s*none|letter-spacing:\s*-?0(px|em|%)?;|list-style(-type)?:\s*none|text-decoration:\s*none|margin:\s*0;|padding:\s*0;|border:\s*(none|0);|background(-color)?:\s*(none|transparent);|cursor:\s*pointer|line-height:\s*[0-9.]+%)'
```

1. 후보마다: 이 요소에 같은 속성을 다르게 주는 규칙(전역, 부모 상속, 다른 클래스, 바깥 블록)이 있는가. 없으면 지운다.
2. "지우면 바뀐다" 표의 선언을 지우지 않았는가.
3. `yarn lint:stylelint`가 통과하는가.
