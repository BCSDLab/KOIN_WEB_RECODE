export function setCookie(name: string, val: any) {
  const value = val;
  document.cookie = `${name}=${value}; path=/`;
}

export function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(';').shift();
  }
  return undefined;
}

export function deleteCookie(name: string) {
  const date = new Date();
  date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));

  document.cookie = `${name}=; expires=${date.toUTCString()}; path=/ `;
}
