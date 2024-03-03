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
  tableHeaders: ['기점', '종합터미널 - 병천'],
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

export const CITY_BUS_TIMETABLE = [
  ['시간표(터미널)', '6:00(첫) - 22:30(막) (10분간격)'],
  ['시간표(병천)', '6:10(첫) - 22:45(막) (10분간격)'],
  ['소요시간', '약 40분'],
];
