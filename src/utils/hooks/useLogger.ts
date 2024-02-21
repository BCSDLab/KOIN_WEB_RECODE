import * as gtag from 'lib/gtag';

export type ClickLoggerProps = {
  title: string,
  value: string,
};

type ScrollLoggerProps = {
  title: string,
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

  return {
    click,
    scroll,
  };
};

export default useLogger;
