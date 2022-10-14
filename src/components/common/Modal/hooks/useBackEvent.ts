import React from 'react';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

function useBackEvent(onClose: () => void) {
  React.useEffect(() => {
    const listenHistoryEvent = history.listen(({ action }) => {
      if (action === 'POP') {
        onClose();
      }
    });
    return listenHistoryEvent;
  }, [onClose]);
}

export default useBackEvent;
