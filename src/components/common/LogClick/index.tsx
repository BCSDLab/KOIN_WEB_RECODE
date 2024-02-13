import React, { cloneElement, ReactElement } from 'react';
import useLogger from 'utils/hooks/useLogger';

interface LogClickProps {
  children: ReactElement;
  params: {
    title: string;
  };
}

const LogClick: React.FC<LogClickProps> = ({ children, params }) => {
  const child: ReactElement = React.Children.only(children);
  const logger = useLogger();

  return cloneElement(child, {
    onClick: (event: React.MouseEvent) => {
      logger.click(params);

      if (child.props.onClick && typeof child.props.onClick === 'function') {
        child.props.onClick(event);
      }
    },
  });
};

export default LogClick;
