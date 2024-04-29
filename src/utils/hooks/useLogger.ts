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
      action: 'BUSINESS', category: 'scroll', label: title, value: title,
    });
  };

  const actionEventClick = ({
    actionTitle,
    title,
    value,
  }: ActionClickLoggerProps) => {
    gtag.event({
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
