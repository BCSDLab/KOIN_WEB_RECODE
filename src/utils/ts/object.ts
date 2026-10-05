export function pick<T extends object, K extends keyof T>(object: T, keys: K[]): Pick<T, K> {
  return keys.reduce<Pick<T, K>>((result, key) => {
    if (key in object) {
      return Object.assign(result, { [key]: object[key] });
    }
    return result;
  }, Object.create(null));
}
