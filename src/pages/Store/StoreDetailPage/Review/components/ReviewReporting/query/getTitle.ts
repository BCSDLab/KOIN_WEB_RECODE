export default function getTitle(key: string) {
  switch (key) {
    case 'notRelevant':
      return '주제에 맞지않음';
    case 'containsAd':
      return '광고가 포함된 리뷰';
    case 'abusiveLanguage':
      return '욕설 포함';
    case 'personalInfo':
      return '개인정보 포함';
    case 'etc':
      return '기타';
    default:
      return '';
  }
}
