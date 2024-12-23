import { CityBusParams } from 'api/bus/entity';
import BusTimetable from 'assets/svg/IndexPage/Bus/bus-timetable.svg';
import BusRoute from 'assets/svg/IndexPage/Bus/bus-route.svg';
import BusUnibus from 'assets/svg/IndexPage/Bus/bus-unibus.svg';
import ROUTES from './routes';

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

export const CITY_COURSES: CityBusParams[] = [
  { bus_number: 400, direction: '병천3리' },
  { bus_number: 402, direction: '황사동' },
  { bus_number: 405, direction: '유관순열사사적지' },
  { bus_number: 400, direction: '종합터미널' },
  { bus_number: 402, direction: '종합터미널' },
  { bus_number: 405, direction: '종합터미널' },
];

export const DEFAULT_CITY_BUS_NUMBER = 400;
export const TERMINAL_CITY_BUS = '종합터미널'; // 공통 시내버스 종점

export const BUS_LINKS = [
  {
    key: 'timetable',
    title: '버스 시간표',
    subtitle: '바로가기',
    link: '/bus/course',
    SvgIcon: BusTimetable,
  }, {
    key: 'route',
    title: '가장 빠른 버스',
    subtitle: '조회하기',
    link: ROUTES.BusRoute(),
    SvgIcon: BusRoute,
  }, {
    key: 'unibus',
    title: '유니버스',
    subtitle: '바로가기',
    link: 'https://koreatech.unibus.kr/',
    SvgIcon: BusUnibus,
  },
] as const;
