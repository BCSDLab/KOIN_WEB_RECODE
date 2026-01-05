import type { GetServerSidePropsContext } from 'next';
import { getValidToken } from './auth';
import type { ParsedUrlQuery } from 'querystring';

interface ParsedParams {
  token: string | undefined;
  query: ParsedUrlQuery;
}

export const parseServerSideParams = (context: GetServerSidePropsContext): ParsedParams => {
  const { req } = context;
  const token = req.cookies['AUTH_TOKEN_KEY'] || undefined;
  const validToken = getValidToken(token);

  return {
    token: validToken,
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

export const createQueryParser = <T extends object>(config: QueryParserConfig<T>) => {
  return (query: ParsedUrlQuery): T => {
    const result = {} as T;

    for (const [key, configValue] of Object.entries(config)) {
      const { parser, defaultValue } = configValue as QueryParserConfig<T>[keyof T];
      const queryValue = query[key];
      result[key as keyof T] = queryValue ? parser(queryValue) : (defaultValue ?? parser(undefined));
    }

    return result;
  };
};
