import useLogger from 'utils/hooks/analytics/useLogger';

const CLICK_EVENTS = [
  {
    title: 'departure_box',
    value: '출발지 선택',
  },
  {
    title: 'arrival_box',
    value: '목적지 선택',
  },
  {
    title: 'swap_destination',
    value: '스왑 버튼',
  },
  {
    title: 'search_bus',
    value: '조회하기',
  },
  {
    title: 'search_result_departure_time',
    value: '출발 시각 설정',
  },
  {
    title: 'departure_now',
    value: '지금 출발',
  },
];

const VARIABLE_EVENTS = [
  {
    title: 'departure_location_confirm',
    value: '', // 코리아텍, 천안역, 천안터미널
  },
  {
    title: 'arrival_location_confirm',
    value: '', // 코리아텍, 천안역, 천안터미널
  },
  {
    title: 'search_result_bus_type',
    value: '', // 전체 차종, 셔틀, 대성, 시내
  },
];

export type LoggingLocation = '코리아텍' | '천안역' | '천안터미널';
export type LoggingBusType = '전체 차종' | '셔틀' | '대성' | '시내';

export const loggingBusTypeMap = {
  ALL: '전체 차종',
  SHUTTLE: '셔틀',
  EXPRESS: '대성',
  CITY: '시내',
} as const;

export const useBusLogger = () => {
  const logger = useLogger();

  const logEvent = (eventTitle: string, eventValue?: string) => {
    const event = CLICK_EVENTS.find(({ title }) => title === eventTitle)
      || VARIABLE_EVENTS.find(({ title }) => title === eventTitle);
    if (event) {
      logger.actionEventClick({
        actionTitle: 'CAMPUS',
        title: event.title,
        value: eventValue || event.value,
        event_category: 'click',
      });
    }
  };

  const logDepartureBoxClick = () => logEvent('departure_box');
  const logArrivalBoxClick = () => logEvent('arrival_box');
  const logSwapDestinationClick = () => logEvent('swap_destination');
  const logSearchBusClick = () => logEvent('search_bus');
  const logSearchResultDepartureTimeClick = () => logEvent('search_result_departure_time');
  const logDepartureNowClick = () => logEvent('departure_now');
  const logDepartureLocationConfirm = (location: LoggingLocation) => logEvent('departure_location_confirm', location);
  const logArrivalLocationConfirm = (location: LoggingLocation) => logEvent('arrival_location_confirm', location);
  const logSearchResultBusType = (busType: LoggingBusType) => logEvent('search_result_bus_type', busType);

  return {
    logDepartureBoxClick,
    logArrivalBoxClick,
    logSwapDestinationClick,
    logSearchBusClick,
    logSearchResultDepartureTimeClick,
    logDepartureNowClick,
    logDepartureLocationConfirm,
    logArrivalLocationConfirm,
    logSearchResultBusType,
  };
};
