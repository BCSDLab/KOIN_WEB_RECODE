export const IS_STAGE = process.env.NEXT_PUBLIC_API_PATH?.includes('stage');

const BASE_DOMAIN = 'koreatech.in';
const STAGE_DOMAIN = `stage.${BASE_DOMAIN}`;

export const COOKIE_DOMAIN = IS_STAGE ? `.${STAGE_DOMAIN}` : `.${BASE_DOMAIN}`;

// 환경별 쿠키 키 (stage와 production 쿠키 분리)
export const COOKIE_KEY = {
  AUTH_TOKEN: IS_STAGE ? 'STAGE_AUTH_TOKEN_KEY' : 'AUTH_TOKEN_KEY',
  AUTH_USER_TYPE: IS_STAGE ? 'STAGE_AUTH_USER_TYPE' : 'AUTH_USER_TYPE',
} as const;

const ORDER_URL = `https://order.${BASE_DOMAIN}`;
const ORDER_STAGE_URL = `https://order.${STAGE_DOMAIN}`;

const KOIN_URL = `https://${BASE_DOMAIN}`;
const KOIN_STAGE_URL = `https://${STAGE_DOMAIN}`;

export const KOIN_BASE_URL = IS_STAGE ? KOIN_STAGE_URL : KOIN_URL;
export const ORDER_BASE_URL = IS_STAGE ? ORDER_STAGE_URL : ORDER_URL;
