import { useRef } from 'react';

import * as gtag from 'lib/gtag';
import type { LoggingTeam } from 'lib/gtag';

/**
 * 로깅 네이밍룰 개편으로 GA 이벤트명이 team(CAMPUS 등)에서 event_name(DA1 등)으로 바뀐다.
 * 기존 로깅은 team을 그대로 쓰고, 신규 로깅만 event_name을 사용한다.
 * 이후 기존 로깅 변경이 완료되면 team은 제거하고 event_name만 사용하도록
 * 리팩토링한다.
 */
type LoggerEventName = { team: LoggingTeam; event_name?: never } | { team?: never; event_name: string };

type ActionLoggerProps = LoggerEventName & {
  event_label: string;
  value: string;
  event_category?: string;
  previous_page?: string;
  current_page?: string;
  duration_time?: number;
  custom_session_id?: string;
};

type LoggerEventProps = LoggerEventName & {
  event_category: string;
  event_label: string;
  value: string;
  duration_time?: number;
  previous_page?: string;
  current_page?: string;
  custom_session_id?: string;
};

const useLogger = () => {
  const prevEvent = useRef<LoggerEventProps | null>(null);

  const logEvent = (props: LoggerEventProps) => {
    gtag.event(props);
    prevEvent.current = props;
  };

  const actionEventClick = (props: ActionLoggerProps) => {
    logEvent({ ...props, event_category: props.event_category || 'click' });
  };

  const actionEventSwipe = (props: ActionLoggerProps) => {
    logEvent({ ...props, event_category: 'swipe' });
  };

  const actionEventLoad = (props: ActionLoggerProps) => {
    logEvent({ ...props, event_category: props.event_category || 'entry' });
  };

  return {
    actionEventClick,
    actionEventSwipe,
    actionEventLoad,
  };
};

export default useLogger;
