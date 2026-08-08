const convertDate = (time: string) => {
  if (typeof time !== 'string') {
    return '';
  }
  return time.split(' ')[0].replaceAll('-', '.');
};

const DAY_MS = 24 * 60 * 60 * 1000;
const NEW_ARTICLE_DAYS = 4;

/**
 * 등록일이 기준일로부터 4일 이내인지.
 *
 * 이전 구현은 연·월·일을 각각 비교해 세 가지가 어긋났다.
 * 월을 넘기면(7/31 글을 8/2에) 월 조건이 깨져 NEW가 사라지고, 연을 넘겨도 마찬가지였다.
 * 반대로 미래 날짜 글은 일 차이가 음수라 조건을 통과해 NEW가 붙었다.
 *
 * 기준일은 반드시 인자로 받는다. 내부에서 `new Date()`를 잡으면 서버와 클라이언트가
 * 다른 값을 써서 하이드레이션이 갈린다.
 */
export const isNewArticle = (registeredAt: string, currentDate: Date) => {
  const [year, month, day] = convertDate(registeredAt).split('.').map((item: string) => parseInt(item, 10));

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return false;
  }

  const registered = Date.UTC(year, month - 1, day);
  const today = Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  const elapsedDays = (today - registered) / DAY_MS;

  return elapsedDays >= 0 && elapsedDays <= NEW_ARTICLE_DAYS;
};

/**
 * 기준일은 호출부가 넘긴다. 서버가 확정한 값을 써야 하이드레이션이 갈리지 않는다.
 * 기준일을 알 수 없으면(서버 요청 컨텍스트가 없는 정적 페이지) NEW 판정을 하지 않는다 —
 * 렌더 중 `new Date()`를 잡으면 서버와 클라이언트가 다른 값을 쓰게 된다.
 */
const setArticleRegisteredDate = (registeredAt: string, currentDate: Date | null): [string, boolean] => {
  const formattedDate = convertDate(registeredAt);
  const isNew = currentDate ? isNewArticle(registeredAt, currentDate) : false;
  return [formattedDate, isNew];
};

export default setArticleRegisteredDate;
