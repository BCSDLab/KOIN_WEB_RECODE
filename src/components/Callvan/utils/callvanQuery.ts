import { CallvanAuthor, CallvanLocation, CallvanSort, CallvanStatus } from 'api/callvan/entity';
import type { ParsedUrlQuery } from 'querystring';

export interface CallvanParams {
  page: number;
  sort: CallvanSort;
  statuses: CallvanStatus[];
  departures: CallvanLocation[];
  arrivals: CallvanLocation[];
  title: string;
  author: CallvanAuthor;
}

function parseStringParam(query: ParsedUrlQuery, key: string): string {
  const value = query[key];
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

function parseArrayParam(query: ParsedUrlQuery, key: string): string[] {
  const value = query[key];
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return value.split(',').filter(Boolean);
}

export function parseCallvanQuery(query: ParsedUrlQuery, fallback: CallvanParams): CallvanParams {
  const page = Number(parseStringParam(query, 'page')) || fallback.page;
  const sort = (parseStringParam(query, 'sort') || fallback.sort) as CallvanSort;
  const author = (parseStringParam(query, 'author') || fallback.author) as CallvanAuthor;
  const title = parseStringParam(query, 'title') || fallback.title;

  const rawStatuses = parseArrayParam(query, 'statuses');
  const statuses = rawStatuses.length > 0 ? (rawStatuses as CallvanStatus[]) : fallback.statuses;

  const rawDepartures = parseArrayParam(query, 'departures');
  const departures = rawDepartures.length > 0 ? (rawDepartures as CallvanLocation[]) : fallback.departures;

  const rawArrivals = parseArrayParam(query, 'arrivals');
  const arrivals = rawArrivals.length > 0 ? (rawArrivals as CallvanLocation[]) : fallback.arrivals;

  return {
    page,
    sort,
    statuses,
    departures,
    arrivals,
    title,
    author,
  };
}
