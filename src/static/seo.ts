import { KOIN_BASE_URL } from 'static/url';

export const SITE_NAME = '코인';
export const DEFAULT_TITLE = '코인 - 한기대 커뮤니티';
export const DEFAULT_DESCRIPTION =
  '보다 편하게, 한국기술교육대학교 생활에 필요한 서비스를 만날 수 있습니다.';
export const DEFAULT_OG_IMAGE = 'https://static.koreatech.in/assets/img/facebook_showcase_image.png';
export const TWITTER_CARD_TYPE = 'summary_large_image';

export const buildAbsoluteUrl = (path?: string) => {
  if (!path) return KOIN_BASE_URL;
  if (/^https?:\/\//.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${KOIN_BASE_URL}${normalized}`;
};
