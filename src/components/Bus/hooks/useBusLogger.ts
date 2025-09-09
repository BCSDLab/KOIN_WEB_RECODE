import useLogger from 'utils/hooks/analytics/useLogger';

const CLICK_EVENTS = [
  {
    label: 'departure_box',
    value: '출발지 선택',
  },
  {
    label: 'arrival_box',
    value: '목적지 선택',
  },
  {
    label: 'swap_destination',
    value: '스왑 버튼',
  },
  {
    label: 'search_bus',
    value: '조회하기',
  },
  {
    label: 'search_result_departure_time',
    value: '출발 시각 설정',
  },
  {
    label: 'departure_now',
    value: '지금 출발',
  },
  {
    label: 'departure_location_confirm',
    value: '', // 코리아텍, 천안역, 천안터미널
  },
  {
    label: 'arrival_location_confirm',
    value: '', // 코리아텍, 천안역, 천안터미널
  },
  {
    label: 'search_result_bus_type',
    value: '', // 전체 차종, 셔틀, 대성, 시내
  },
] as const;

export type ClickEventLabel = typeof CLICK_EVENTS[number]['label'];

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

  const logEvent = (eventLabel: ClickEventLabel, eventValue?: string) => {
    const event = CLICK_EVENTS.find(({ label }) => label === eventLabel);
    if (event) {
      logger.actionEventClick({
        team: 'CAMPUS',
        event_label: event.label,
        value: eventValue || event.value,
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
