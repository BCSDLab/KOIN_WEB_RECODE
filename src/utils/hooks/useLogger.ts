import React from 'react';
import * as gtag from 'lib/gtag';

export type ClickLoggerProps = {
  title: string,
  value: string,
};

type ScrollLoggerProps = {
  title: string,
};

type ActionClickLoggerProps = {
  actionTitle: string,
  title: string,
  value: string,
  event_category?: string,
  previous_page?: string,
  current_page?: string,
  duration_time?: number,
};

type LoggerEventProps = {
  action: string,
  category: string,
  label: string,
  value: string,
  duration_time?: number,
  previous_page?: string,
};

const useLogger = () => {
  const prevEvent = React.useRef<LoggerEventProps | null>(null);

  const logEvent = ({
    action,
    category,
    label,
    value,
    duration_time,
    previous_page,
  }: LoggerEventProps) => {
    const event = {
      action, category, label, value, duration_time, previous_page,
    };
    if (
      !prevEvent.current
      || prevEvent.current.action !== action
      || prevEvent.current.category !== category
      || prevEvent.current.label !== label
      || prevEvent.current.value !== value
      || prevEvent.current.duration_time !== duration_time
      || prevEvent.current.previous_page !== previous_page
    ) {
      gtag.event(event);
      prevEvent.current = event;
    }
  };

  const click = ({
    title,
    value,
  } : ClickLoggerProps) => {
    logEvent({
      action: 'click', category: 'button', label: title, value,
    });
  };

  const scroll = ({
    title,
  }: ScrollLoggerProps) => {
    logEvent({
      action: 'scroll', category: 'BUSINESS', label: title, value: title,
    });
  };

  const actionEventClick = ({
    actionTitle,
    title,
    value,
    duration_time,
    previous_page,
  }: ActionClickLoggerProps) => {
    logEvent({
      action: actionTitle, category: 'button', label: title, value, duration_time, previous_page,
    });
  };

  return {
    click,
    scroll,
    actionEventClick,
  };
};

export default useLogger;
