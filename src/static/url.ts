export const IS_STAGE = process.env.NEXT_PUBLIC_API_PATH?.includes('stage');

const BASE_DOMAIN = 'koreatech.in';
const STAGE_DOMAIN = `stage.${BASE_DOMAIN}`;

export const COOKIE_DOMAIN = IS_STAGE ? `.${STAGE_DOMAIN}` : `.${BASE_DOMAIN}`;

// 환경별 쿠키 키 (stage와 production 쿠키 분리)
export const COOKIE_KEY = {
  AUTH_TOKEN: IS_STAGE ? 'STAGE_AUTH_TOKEN_KEY' : 'AUTH_TOKEN_KEY',
  AUTH_USER_TYPE: IS_STAGE ? 'STAGE_AUTH_USER_TYPE' : 'AUTH_USER_TYPE',
} as const;

// 백엔드(KOIN_API_V2 #2425)가 발급하는 웹 인증 쿠키 이름. access·refresh는 HttpOnly라 JS가
// 읽을 수 없고 이름을 알 필요도 없다(SSR은 Cookie 헤더 전체를 그대로 전달). CSRF만 프론트가 직접 읽어
// X-CSRF-Token 헤더로 되돌려 보내야 하므로 이름을 알아야 한다.
export const WEB_AUTH_CSRF_COOKIE_KEY = IS_STAGE ? '__Secure-koin-stage-web-csrf' : '__Secure-koin-web-csrf';

const ORDER_URL = `https://order.${BASE_DOMAIN}`;
const ORDER_STAGE_URL = `https://order.${STAGE_DOMAIN}`;

const KOIN_URL = `https://${BASE_DOMAIN}`;
const KOIN_STAGE_URL = `https://${STAGE_DOMAIN}`;

export const KOIN_BASE_URL = IS_STAGE ? KOIN_STAGE_URL : KOIN_URL;
export const ORDER_BASE_URL = IS_STAGE ? ORDER_STAGE_URL : ORDER_URL;
