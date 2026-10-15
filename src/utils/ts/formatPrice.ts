// 서버(Node)와 사용자 브라우저의 locale이 달라도 같은 문자열이 나오도록 ko-KR로 고정한다.
// locale을 비우면 de-DE 브라우저는 15.000처럼 그려 서버 렌더와 하이드레이션 텍스트가 갈린다
export const formatNumber = (value: number) => value.toLocaleString('ko-KR');

export const formatPrice = (value: number) => `${formatNumber(value)}원`;
