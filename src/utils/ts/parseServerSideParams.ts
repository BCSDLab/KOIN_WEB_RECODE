import type { GetServerSidePropsContext } from 'next';

interface ParsedParams {
  token: string;
  query: Record<string, any>;
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
  return isNaN(parsed) ? defaultValue : parsed;
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

export const createQueryParser = <T extends Record<string, any>>(config: QueryParserConfig<T>) => {
  return (query: GetServerSidePropsContext['query']): T => {
    const result = {} as T;

    for (const [key, { parser, defaultValue }] of Object.entries(config)) {
      result[key as keyof T] = query[key] ? parser(query[key]) : (defaultValue ?? parser(undefined));
    }

    return result;
  };
};
