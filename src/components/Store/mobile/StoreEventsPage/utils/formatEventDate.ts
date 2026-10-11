// API가 내려주는 날짜(YYYY-MM-DD…)를 YYYY.MM.DD로 바꾼다.
// Date로 파싱하면 서버·브라우저 타임존에 따라 날짜가 달라져 SSR 렌더가 갈리므로 문자열에서 바로 뽑는다
const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})/;

export default function formatEventDate(value: string) {
  const match = DATE_PATTERN.exec(value);
  if (!match) return value;

  const [, year, month, day] = match;

  return `${year}.${month}.${day}`;
}
