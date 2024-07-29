import { CityBusParams } from 'api/bus/entity';

export const BUS_TYPES = [{
  key: 'shuttle',
  tabName: '학교셔틀',
  tableHeaders: ['승차장소', '시간'],
}, {
  key: 'express',
  tabName: '대성고속',
  tableHeaders: ['출발시간', '도착시간'],
}, {
  key: 'city',
  tabName: '시내버스',
  tableHeaders: ['오전', '오후'],
}];

export const BUS_DIRECTIONS = ['한기대', '야우리', '천안역'];

export const SHUTTLE_COURSES = [
  {
    bus_type: 'commuting',
    direction: 'from',
    region: '천안',
  },
  {
    bus_type: 'commuting',
    direction: 'to',
    region: '천안',
  },
  {
    bus_type: 'shuttle',
    direction: 'to',
    region: '천안',
  },
  {
    bus_type: 'shuttle',
    direction: 'from',
    region: '천안',
  },
  {
    bus_type: 'commuting',
    direction: 'to',
    region: '청주',
  },
  {
    bus_type: 'commuting',
    direction: 'from',
    region: '청주',
  },
  {
    bus_type: 'shuttle',
    direction: 'to',
    region: '청주',
  },
  {
    bus_type: 'shuttle',
    direction: 'from',
    region: '청주',
  },
  {
    bus_type: 'commuting',
    direction: 'to',
    region: '서울',
  },
  {
    bus_type: 'commuting',
    direction: 'from',
    region: '서울',
  },
  {
    bus_type: 'commuting',
    direction: 'to',
    region: '대전',
  },
  {
    bus_type: 'commuting',
    direction: 'from',
    region: '대전',
  },
  {
    bus_type: 'commuting',
    direction: 'to',
    region: '세종',
  },
  {
    bus_type: 'commuting',
    direction: 'from',
    region: '세종',
  },
] as const;

export const EXPRESS_COURSES = [
  {
    name: '한기대 → 야우리',
    bus_type: 'express',
    direction: 'from',
    region: '천안',
  },
  {
    name: '야우리 → 한기대',
    bus_type: 'express',
    direction: 'to',
    region: '천안',
  },
] as const;

export interface BusLink {
  label: string;
  link: string;
  key: string;
  type: typeof BUS_TYPES[number];
}

export const busLink: BusLink[] = [
  {
    label: '유니버스 바로가기',
    link: 'https://koreatech.unibus.kr/',
    key: 'shuttle',
    type: BUS_TYPES[0],
  },
  {
    label: '시간표 보러가기',
    link: '/bus',
    key: 'express',
    type: BUS_TYPES[1],
  },
  {
    label: '시간표 보러가기',
    link: '/bus',
    key: 'city',
    type: BUS_TYPES[2],
  },
];

export const cityBusDirections = [
  { label: '병천 → 터미널', value: 'from' },
  { label: '터미널 → 병천', value: 'to' },
];

export const CITY_COURSES: CityBusParams[] = [
  { bus_number: 400, direction: '병천3리' },
  { bus_number: 402, direction: '황사동' },
  { bus_number: 405, direction: '유관순열사사적지' },
  { bus_number: 400, direction: '종합터미널' },
  { bus_number: 402, direction: '종합터미널' },
  { bus_number: 405, direction: '종합터미널' },
];
