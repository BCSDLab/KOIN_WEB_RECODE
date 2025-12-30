import ROUTES from 'static/routes';

const REDIRECT_KEY = 'REDIRECT_AFTER_LOGIN';

export function setRedirectPath(path: string) {
  sessionStorage.setItem(REDIRECT_KEY, path);
}

export function getRedirectPath(): string {
  return sessionStorage.getItem(REDIRECT_KEY) || ROUTES.Main();
}

export function clearRedirectPath() {
  sessionStorage.removeItem(REDIRECT_KEY);
}

export function redirectToLogin(currentPath?: string) {
  const pathToSave = currentPath || window.location.pathname;
  setRedirectPath(pathToSave);
  window.location.href = ROUTES.Auth();
}

export function redirectToMain(currentPath?: string) {
  const pathToSave = currentPath || window.location.pathname;
  setRedirectPath(pathToSave);
  window.location.href = ROUTES.Main();
}

export function redirectToClub(currentPath?: string) {
  const pathToSave = currentPath || window.location.pathname;
  setRedirectPath(pathToSave);
  window.location.href = ROUTES.Club();
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function getValidToken(token: string | null | undefined): string | null {
  if (!token) return null;
  return isTokenExpired(token) ? null : token;
}
