import * as gtag from 'lib/gtag';

type ClickLoggerProps = {
  title: string,
};

type ScrollLoggerProps = {
  title: string,
};

const useLogger = () => {
  const click = ({
    title,
  } : ClickLoggerProps) => {
    gtag.event({
      action: 'action', category: 'button', label: title, value: title,
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
