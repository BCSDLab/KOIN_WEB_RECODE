export const IS_STAGE = process.env.NEXT_PUBLIC_API_PATH?.includes('stage');

const BASE_DOMAIN = 'koreatech.in';
const STAGE_DOMAIN = `stage.${BASE_DOMAIN}`;

export const COOKIE_DOMAIN = IS_STAGE ? `.${STAGE_DOMAIN}` : `.${BASE_DOMAIN}`;

// 백엔드가 발급하는 쿠키 이름.
export const WEB_AUTH_CSRF_COOKIE_KEY = IS_STAGE ? '__Secure-koin-stage-web-csrf' : '__Secure-koin-web-csrf';
export const WEB_AUTH_ACCESS_COOKIE_KEY = IS_STAGE ? '__Secure-koin-stage-web-access' : '__Secure-koin-web-access';

// 프론트가 쓰는 쿠키 이름.
// 시간표에서 선택한 학기. localStorage(zustand)에만 두면 서버가 몰라 SSR과 클라이언트 렌더가 갈린다.
export const TIMETABLE_SEMESTER_COOKIE_KEY = IS_STAGE ? 'koin-stage-timetable-semester' : 'koin-timetable-semester';

const ORDER_URL = `https://order.${BASE_DOMAIN}`;
const ORDER_STAGE_URL = `https://order.${STAGE_DOMAIN}`;

const KOIN_URL = `https://${BASE_DOMAIN}`;
const KOIN_STAGE_URL = `https://${STAGE_DOMAIN}`;

export const KOIN_BASE_URL = IS_STAGE ? KOIN_STAGE_URL : KOIN_URL;
export const ORDER_BASE_URL = IS_STAGE ? ORDER_STAGE_URL : ORDER_URL;
