export default function getContent(key: string, etcDescription: string = ''): string {
  switch (key) {
    case 'notRelevant':
      return '해당 음식점과 관련 없는 리뷰입니다.';
    case 'containsAd':
      return '리뷰에 광고성 내용이 포함되어 있습니다.';
    case 'abusiveLanguage':
      return '리뷰에 욕설이 포함되어 있습니다.';
    case 'personalInfo':
      return '리뷰에 개인정보가 포함되어 있습니다.';
    case 'etc':
      return etcDescription;
    default:
      return '';
  }
}
