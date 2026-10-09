// order formatDate는 new Date로 기기 시간대를 타서 서버·클라이언트 렌더가 갈릴 수 있다.
// created_at은 'YYYY-MM-DD' 날짜 문자열이라 문자열 그대로 'YYYY.MM.DD'로 바꾼다
export const formatReviewDate = (createdAt: string) => createdAt.slice(0, 10).replaceAll('-', '.');
