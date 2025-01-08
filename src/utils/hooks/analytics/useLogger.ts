import React from 'react';
import * as gtag from 'lib/gtag';

export type ClickLoggerProps = {
  title: string;
  value: string;
};

type ScrollLoggerProps = {
  title: string;
};

type ActionLoggerProps = {
  actionTitle: string;
  title: string;
  value: string;
  event_category?: string;
  previous_page?: string;
  current_page?: string;
  duration_time?: number;
};

type LoggerEventProps = {
  action: string;
  category: string;
  label: string;
  value: string;
  duration_time?: number;
  previous_page?: string;
  current_page?: string;
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
    current_page,
  }: LoggerEventProps) => {
    const event = {
      action,
      category,
      label,
      value,
      duration_time,
      previous_page,
      current_page,
    };
    gtag.event(event);
    prevEvent.current = event;
  };

  const click = ({ title, value }: ClickLoggerProps) => {
    logEvent({
      action: 'click',
      category: 'click',
      label: title,
      value,
    });
  };

  const scroll = ({ title }: ScrollLoggerProps) => {
    logEvent({
      action: 'scroll',
      category: 'BUSINESS',
      label: title,
      value: title,
    });
  };

  const actionEventClick = ({
    actionTitle,
    title,
    value,
    duration_time,
    previous_page,
    current_page,
    event_category,
  }: ActionLoggerProps) => {
    logEvent({
      action: actionTitle,
      category: event_category || 'click',
      label: title,
      value,
      duration_time,
      previous_page,
      current_page,
    });
  };

  const actionEventSwipe = ({
    actionTitle,
    title,
    value,
    duration_time,
    previous_page,
    current_page,
  }: ActionLoggerProps) => {
    logEvent({
      action: actionTitle,
      category: 'swipe',
      label: title,
      value,
      duration_time,
      previous_page,
      current_page,
    });
  };

  return {
    click,
    scroll,
    actionEventClick,
    actionEventSwipe,
  };
};

export default useLogger;
