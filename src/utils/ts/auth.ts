import ROUTES from 'static/routes';

import { isomorphicSessionStorage } from './env';

const REDIRECT_KEY = 'REDIRECT_AFTER_LOGIN';

export function setRedirectPath(path: string) {
  isomorphicSessionStorage.setItem(REDIRECT_KEY, path);
}

export function getRedirectPath(): string {
  return isomorphicSessionStorage.getItem(REDIRECT_KEY) || ROUTES.Main();
}

export function clearRedirectPath() {
  isomorphicSessionStorage.removeItem(REDIRECT_KEY);
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
