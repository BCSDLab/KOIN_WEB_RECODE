import * as gtag from 'lib/gtag';

export type ClickLoggerProps = {
  title: string,
  value: string,
};

type ScrollLoggerProps = {
  title: string,
};

type ActionClickLoggerProps = {
  title: string,
  actionTitle: string,
};

const useLogger = () => {
  const click = ({
    title,
    value,
  } : ClickLoggerProps) => {
    gtag.event({
      action: 'click', category: 'button', label: title, value,
    });
  };

  const scroll = ({
    title,
  }: ScrollLoggerProps) => {
    gtag.event({
      action: 'action', category: 'scroll', label: title, value: title,
    });
  };

  const actionEventClick = ({
    actionTitle,
    title,
  }: ActionClickLoggerProps) => {
    gtag.event({
      action: actionTitle, category: 'button', label: title, value: title,
    });
  };

  return {
    click,
    scroll,
    actionEventClick,
  };
};

export default useLogger;
