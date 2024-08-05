type Primitive = string | number | boolean | null;
type QueryParam = Primitive | Primitive[] | QueryParams;
interface QueryParams {
  [key: string]: QueryParam;
}

export default function qsStringify<T extends QueryParams>(params: T, prefix?: string): string {
  const queryString = Object.keys(params)
    .map((key) => {
      const value = params[key];
      const encodedKey = prefix ? `${prefix}[${encodeURIComponent(key)}]` : encodeURIComponent(key);

      if (Array.isArray(value)) {
        return value.map((item) => `${encodedKey}=${encodeURIComponent(String(item))}`).join('&');
      } if (typeof value === 'object' && value !== null) {
        return qsStringify(value as QueryParams, encodedKey);
      }
      return `${encodedKey}=${encodeURIComponent(String(value))}`;
    })
    .filter((part) => part.length > 0)
    .join('&');

  return queryString;
}
