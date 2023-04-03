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
    default:
      return '[코인공지]';
  }
}

export default convertNoticeTag;
