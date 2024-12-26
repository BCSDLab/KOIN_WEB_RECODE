import { LocationDisplay } from 'pages/Bus/BusRoutePage/ts/types';

export const LOCATION_TYPE_KEY = {
  depart: 'depart',
  arrival: 'arrival',
} as const;

export const locations: LocationDisplay[] = ['코리아텍', '천안역', '천안터미널'];

export const LOCATION_MAP = {
  KOREATECH: '코리아텍',
  STATION: '천안역',
  TERMINAL: '천안터미널',
} as const;

export const REVERSE_LOCATION_MAP = {
  코리아텍: 'KOREATECH',
  천안역: 'STATION',
  천안터미널: 'TERMINAL',
} as const;

export const locationLabels = {
  depart: {
    title: '출발',
    placeholder: '출발지 선택',
  },
  arrival: {
    title: '도착',
    placeholder: '목적지 선택',
  },
};
