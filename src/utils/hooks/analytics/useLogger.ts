import { useRef } from 'react';
import * as gtag from 'lib/gtag';

type ActionLoggerProps = {
  team: string;
  event_label: string;
  value: string;
  event_category?: string;
  previous_page?: string;
  current_page?: string;
  duration_time?: number;
  custom_session_id?: string;
};

type LoggerEventProps = {
  team: string;
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

  const logEvent = ({
    team,
    event_category,
    event_label,
    value,
    duration_time,
    previous_page,
    current_page,
    custom_session_id,
  }: LoggerEventProps) => {
    const event = {
      team,
      event_category,
      event_label,
      value,
      duration_time,
      previous_page,
      current_page,
      custom_session_id,
    };
    gtag.event(event);
    prevEvent.current = event;
  };

  const actionEventClick = ({
    team,
    event_label,
    value,
    duration_time,
    previous_page,
    current_page,
    event_category,
    custom_session_id,
  }: ActionLoggerProps) => {
    logEvent({
      team,
      event_category: event_category || 'click',
      event_label,
      value,
      duration_time,
      previous_page,
      current_page,
      custom_session_id,
    });
  };

  const actionEventSwipe = ({
    team,
    event_label,
    value,
    duration_time,
    previous_page,
    current_page,
  }: ActionLoggerProps) => {
    logEvent({
      team,
      event_category: 'swipe',
      event_label,
      value,
      duration_time,
      previous_page,
      current_page,
    });
  };

  const actionEventLoad = ({
    team,
    event_label,
    value,
    duration_time,
    previous_page,
    current_page,
    event_category,
    custom_session_id,
  }: ActionLoggerProps) => {
    logEvent({
      team,
      event_category: event_category || 'entry',
      event_label,
      value,
      duration_time,
      previous_page,
      current_page,
      custom_session_id,
    });
  };

  return {
    actionEventClick,
    actionEventSwipe,
    actionEventLoad,
  };
};

export default useLogger;
