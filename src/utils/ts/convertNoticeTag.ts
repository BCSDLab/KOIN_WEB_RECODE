function convertNoticeTag(type: number) {
  switch (type) {
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
    default:
      return '[공지사항]';
  }
}

export default convertNoticeTag;
