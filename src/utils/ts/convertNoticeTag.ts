export const convertNoticeTag = (type: number) => {
  switch (type) {
    case 1:
      return '[자유게시판]';
    case 2:
      return '[취업게시판]';
    case 3:
      return '[익명게시판]';
    case 4:
      return '[공지사항]';
    case 5:
      return '[일반공지]';
    case 6:
      return '[장학공지]';
    case 7:
      return '[학사공지]';
    case 8:
      return '[취업공지]';
    case 9:
      return '[코인공지]';
    case 12:
      return '[현장실습]';
    case 13:
      return '[학생생활]';
    case 14:
      return '[분실물]';
    default:
      return '[공지사항]';
  }
}

export const BOARD_IDS = {
  자유게시판: 1,
  취업게시판: 2,
  익명게시판: 3,
  공지사항: 4, // 전체 공지 조회 시 사용
  일반공지: 5,
  장학공지: 6,
  학사공지: 7,
  취업공지: 8,
  코인공지: 9,
  질문게시판: 10,
  홍보게시판: 11,
  현장실습: 12,
  학생생활: 13,
} as const;
