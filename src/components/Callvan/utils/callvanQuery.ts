import { CallvanAuthor, CallvanLocation, CallvanSort, CallvanStatus, CALLVAN_LOCATIONS } from 'api/callvan/entity';
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

const VALID_SORTS: readonly string[] = ['DEPARTURE_ASC', 'DEPARTURE_DESC', 'LATEST_ASC', 'LATEST_DESC'];
const VALID_AUTHORS: readonly string[] = ['ALL', 'MY'];
const VALID_STATUSES: readonly string[] = ['RECRUITING', 'CLOSED', 'COMPLETED'];
const VALID_LOCATIONS: readonly string[] = [...CALLVAN_LOCATIONS, 'CUSTOM'];

function isCallvanSort(value: string): value is CallvanSort {
  return VALID_SORTS.includes(value);
}

function isCallvanAuthor(value: string): value is CallvanAuthor {
  return VALID_AUTHORS.includes(value);
}

function isCallvanStatus(value: string): value is CallvanStatus {
  return VALID_STATUSES.includes(value);
}

function isCallvanLocation(value: string): value is CallvanLocation {
  return VALID_LOCATIONS.includes(value);
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
  const rawPage = Number(parseStringParam(query, 'page'));
  const page = Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : fallback.page;
  const title = parseStringParam(query, 'title') || fallback.title;

  const rawSort = parseStringParam(query, 'sort');
  const sort = isCallvanSort(rawSort) ? rawSort : fallback.sort;

  const rawAuthor = parseStringParam(query, 'author');
  const author = isCallvanAuthor(rawAuthor) ? rawAuthor : fallback.author;

  const rawStatuses = parseArrayParam(query, 'statuses');
  const validStatuses = rawStatuses.filter(isCallvanStatus);
  const statuses = validStatuses.length > 0 ? validStatuses : fallback.statuses;

  const rawDepartures = parseArrayParam(query, 'departures');
  const validDepartures = rawDepartures.filter(isCallvanLocation);
  const departures = validDepartures.length > 0 ? validDepartures : fallback.departures;

  const rawArrivals = parseArrayParam(query, 'arrivals');
  const validArrivals = rawArrivals.filter(isCallvanLocation);
  const arrivals = validArrivals.length > 0 ? validArrivals : fallback.arrivals;

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
