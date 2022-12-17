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

export const SHUTTLE_COURESE = [
  {
    name: '천안 하교',
    bus_type: 'commuting',
    direction: 'from',
    region: '천안',
  },
  {
    name: '천안 등교',
    bus_type: 'commuting',
    direction: 'to',
    region: '천안',
  },
  {
    name: '천안 셔틀 등교',
    bus_type: 'shuttle',
    direction: 'to',
    region: '천안',
  },
  {
    name: '천안 셔틀 하교',
    bus_type: 'shuttle',
    direction: 'from',
    region: '천안',
  },
  {
    name: '청주 등교',
    bus_type: 'commuting',
    direction: 'to',
    region: '청주',
  },
  {
    name: '청주 하교',
    bus_type: 'commuting',
    direction: 'from',
    region: '청주',
  },
  {
    name: '청주 셔틀 등교',
    bus_type: 'shuttle',
    direction: 'to',
    region: '청주',
  },
  {
    name: '청주 셔틀 하교',
    bus_type: 'shuttle',
    direction: 'from',
    region: '청주',
  },
  {
    name: '서울 등교',
    bus_type: 'commuting',
    direction: 'to',
    region: '서울',
  },
  {
    name: '서울 하교',
    bus_type: 'commuting',
    direction: 'from',
    region: '서울',
  },
  {
    name: '대전 등교',
    bus_type: 'commuting',
    direction: 'to',
    region: '대전',
  },
  {
    name: '대전 하교',
    bus_type: 'commuting',
    direction: 'from',
    region: '대전',
  },
  {
    name: '세종 등교',
    bus_type: 'commuting',
    direction: 'to',
    region: '세종',
  },
  {
    name: '세종 하교',
    bus_type: 'commuting',
    direction: 'from',
    region: '세종',
  },
];

export const EXPRESS_COURSES = [
  {
    name: '한기대->야우리',
    bus_type: 'express',
    direction: 'from',
    region: '천안',
  },
  {
    name: '야우리->한기대',
    bus_type: 'express',
    direction: 'to',
    region: '천안',
  },
];
