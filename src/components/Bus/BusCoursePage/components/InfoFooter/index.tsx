import InformationIcon from 'assets/svg/Bus/info-gray.svg';
import { BUS_FEEDBACK_FORM } from 'static/bus';
import useLogger from 'utils/hooks/analytics/useLogger';
import styles from './InfoFooter.module.scss';

type BUSTYPE = 'EXPRESS' | 'CITY';

interface InfoFooterProps {
  type: BUSTYPE;
  updated: string;
  destinationCategory?: string;
  selectedDirection?: string;
  selectedBusNumber?: number;
}

export default function InfoFooter({
  type,
  updated,
  destinationCategory,
  selectedDirection,
  selectedBusNumber,
}: InfoFooterProps) {
  const logger = useLogger();

  const handleLogging = (t: BUSTYPE) => {
    if (t === 'EXPRESS') {
      window.open(BUS_FEEDBACK_FORM);
      logger.actionEventClick({
        team: 'CAMPUS',
        event_label: 'error_feedback_button',
        value: `대성_${destinationCategory}`,
      });
    } else {
      window.open(BUS_FEEDBACK_FORM);
      logger.actionEventClick({
        team: 'CAMPUS',
        event_label: 'error_feedback_button',
        value: `시내_${selectedDirection}_${selectedBusNumber}`,
      });
    }
  };

  return (
    <div className={styles['express-footer']}>
      <div className={styles['express-footer__date']}>업데이트 날짜 :{updated}</div>
      <button type="button" className={styles['info-footer__icon']} onClick={() => handleLogging(type)}>
        <InformationIcon />
        <div className={styles['info-footer__text']}>정보가 정확하지 않나요?</div>
      </button>
    </div>
  );
}
