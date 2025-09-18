import useLogger from 'utils/hooks/analytics/useLogger';

const CLICK_EVENTS = [
  {
    label: 'message_list_select',
    value: '쪽지',
  },
] as const;

export type ClickEventLabel = typeof CLICK_EVENTS[number]['label'];

export const useChatLogger = () => {
  const logger = useLogger();

  const logEvent = (eventLabel: ClickEventLabel, eventValue?: string) => {
    const event = CLICK_EVENTS.find(({ label }) => label === eventLabel);
    if (event) {
      logger.actionEventClick({
        team: 'CAMPUS',
        event_label: event.label,
        value: eventValue || event.value,
      });
    }
  };

  const logMessageListSelcetClick = () => logEvent('message_list_select');

  return {
    logMessageListSelcetClick,
  };
};
