import type { GetServerSidePropsContext } from 'next';
import type { ParsedUrlQuery } from 'querystring';

interface ParsedParams {
  token: string;
  query: ParsedUrlQuery;
}

export const parseServerSideParams = (context: GetServerSidePropsContext): ParsedParams => {
  const { req } = context;
  const token = req.cookies['AUTH_TOKEN_KEY'] || '';

  return {
    token,
    query: context.query,
  };
};

export const parseQueryString = (value: string | string[] | undefined, defaultValue: string = ''): string => {
  return value ? String(value) : defaultValue;
};

export const parseQueryNumber = (
  value: string | string[] | undefined,
  defaultValue: number | null = null,
): number | null => {
  if (!value) return defaultValue;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? defaultValue : parsed;
};

export const parseQueryBoolean = (value: string | string[] | undefined, defaultValue: boolean = false): boolean => {
  if (!value) return defaultValue;
  return String(value) === 'true';
};

type QueryParserConfig<T> = {
  [K in keyof T]: {
    parser: (value: string | string[] | undefined) => T[K];
    defaultValue?: T[K];
  };
};

export const createQueryParser = <T extends Record<string, unknown>>(config: QueryParserConfig<T>) => {
  return (query: ParsedUrlQuery): T => {
    const result = {} as T;

    for (const [key, { parser, defaultValue }] of Object.entries(config) as [
      keyof T,
      QueryParserConfig<T>[keyof T],
    ][]) {
      result[key] = query[key as string] ? parser(query[key as string]) : (defaultValue ?? parser(undefined));
    }

    return result;
  };
};
