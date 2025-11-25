import { COOKIE_DOMAIN } from 'static/url';

type SameSite = 'lax' | 'strict' | 'none';

export interface CookieOptions {
  days?: number;
  maxAge?: number;
  expires?: Date;
  path?: string;
  domain?: string;
  sameSite?: SameSite;
  secure?: boolean;
}

const isBrowser = () => typeof document !== 'undefined';

function resolveSecureFlag(explicit?: boolean): boolean {
  if (typeof explicit === 'boolean') return explicit;
  if (typeof window !== 'undefined') return window.location.protocol === 'https:';
  return false;
}

function buildCookieString(name: string, value: string, options: CookieOptions = {}): string {
  const encName = encodeURIComponent(name);
  const encVal = encodeURIComponent(value);
  const parts: string[] = [`${encName}=${encVal}`];

  // 만료/수명
  if (options.expires instanceof Date) {
    parts.push(`Expires=${options.expires.toUTCString()}`);
  } else if (typeof options.maxAge === 'number') {
    parts.push(`Max-Age=${Math.floor(options.maxAge)}`);
  } else if (typeof options.days === 'number') {
    const date = new Date();
    date.setTime(date.getTime() + options.days * 24 * 60 * 60 * 1000);
    parts.push(`Expires=${date.toUTCString()}`);
  }

  // 경로/도메인
  parts.push(`Path=${options.path ?? '/'}`);
  if (options.domain) parts.push(`Domain=${options.domain}`);

  // SameSite & Secure
  const sameSite = (options.sameSite ?? 'lax').toLowerCase() as SameSite;
  parts.push(`SameSite=${sameSite.charAt(0).toUpperCase()}${sameSite.slice(1)}`);
  if (resolveSecureFlag(options.secure)) parts.push('Secure');

  return parts.join('; ');
}

export function setCookie(name: string, val: any, dayOrOptions?: number | CookieOptions) {
  if (!isBrowser()) return;

  const value = String(val);
  const options: CookieOptions = typeof dayOrOptions === 'number' ? { days: dayOrOptions } : (dayOrOptions ?? {});

  document.cookie = buildCookieString(name, value, options);
}

export function getCookie(name: string): string | undefined {
  if (!isBrowser()) return undefined;
  const target = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie ? document.cookie.split(';') : [];
  for (let i = 0; i < cookies.length; i += 1) {
    const raw = cookies[i].trim();
    if (raw.startsWith(target)) {
      const val = raw.substring(target.length);
      try {
        return decodeURIComponent(val);
      } catch {
        return val;
      }
    }
  }
  return undefined;
}

export function deleteCookie(name: string, opts?: Pick<CookieOptions, 'path' | 'domain' | 'sameSite' | 'secure'>) {
  if (!isBrowser()) return;
  const options: CookieOptions = {
    ...opts,
    maxAge: 0,
  };
  document.cookie = buildCookieString(name, '', options);
}

export const getCookieDomain = () => {
  if (typeof window === 'undefined') return undefined;

  const { hostname } = window.location;
  if (hostname === 'localhost') return undefined;

  return COOKIE_DOMAIN;
};
