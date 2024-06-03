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
};

type LoggerEventProps = {
  action: string,
  category: string,
  label: string,
  value: string,
};

const useLogger = () => {
  const prevEvent = React.useRef<LoggerEventProps | null>(null);

  const logEvent = ({
    action,
    category,
    label,
    value,
  }: LoggerEventProps) => {
    const event = {
      action, category, label, value,
    };
    if (
      !prevEvent.current
      || prevEvent.current.action !== action
      || prevEvent.current.category !== category
      || prevEvent.current.label !== label
      || prevEvent.current.value !== value
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
  }: ActionClickLoggerProps) => {
    logEvent({
      action: actionTitle, category: 'button', label: title, value,
    });
  };

  return {
    click,
    scroll,
    actionEventClick,
  };
};

export default useLogger;
