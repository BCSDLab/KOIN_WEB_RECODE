const REDIRECT_KEY = 'REDIRECT_AFTER_LOGIN';

export function setRedirectPath(path: string) {
  sessionStorage.setItem(REDIRECT_KEY, path);
}

export function getRedirectPath(): string {
  return sessionStorage.getItem(REDIRECT_KEY) || '/';
}

export function clearRedirectPath() {
  sessionStorage.removeItem(REDIRECT_KEY);
}

export function redirectToLogin(currentPath?: string) {
  const pathToSave = currentPath || window.location.pathname;
  setRedirectPath(pathToSave);
  window.location.href = '/auth';
}
