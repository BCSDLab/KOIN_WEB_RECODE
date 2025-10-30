import { useEffect, useState } from 'react';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import InformationIcon from 'assets/svg/Bus/info.svg';
import CloseIcon from 'assets/svg/common/close/close-icon-32x32.svg';
import useBusNotice from 'components/Bus/hooks/useBusNotice';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import { useRouter } from 'next/router';
import { useLocalStorage } from 'utils/hooks/state/useLocalStorage';
import styles from './BusNotice.module.scss';

export interface BusNoticeProps {
  loggingLocation?: string;
}

const LOCATION = [
  {
    location: 'bus_search',
    value: '교통편 조회하기',
  },
  {
    location: 'shuttle',
    value: '셔틀버스 시간표',
  },
  {
    location: 'express',
    value: '대성버스 시간표',
  },
  {
    location: 'city',
    value: '시내버스 시간표',
  },
];

export default function BusNotice({ loggingLocation }: BusNoticeProps) {
  const isMobile = useMediaQuery();
  const router = useRouter();
  const navigate = (path: string) => router.push(path);
  const res = useBusNotice();
  const { id, title } = res.data;
  const [lastBusNotice, setLastBusNotice] = useLocalStorage('lastBusNotice', '');
  const [busNoticeDismissed, setBusNoticeDismissed] = useLocalStorage('busNoticeDismissed', 'false');
  const isUpdated = lastBusNotice !== title;
  const logger = useLogger();
  const matched = LOCATION.find((item) => item.location === loggingLocation);
  const logValue = matched?.value || '';

  const [showNotice, setShowNotice] = useState(() => !busNoticeDismissed || isUpdated);

  const handleClickNavigateNotice = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'bus_announcement',
      value: logValue,
    });
    navigate(ROUTES.ArticlesDetail({ id: String(id), isLink: true }));
  };

  const handleClickDismissNotice = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'bus_announcement_close',
      value: logValue,
    });
    setBusNoticeDismissed('true');
    setShowNotice(false);
  };

  useEffect(() => {
    if (isUpdated) {
      setLastBusNotice(title);
      setBusNoticeDismissed('false');
    }
  }, [isUpdated, title, setLastBusNotice, setBusNoticeDismissed]);

  return (
    <div className={styles.container}>
      {showNotice && (
        <div className={styles.notice}>
          {!isMobile && <InformationIcon />}
          <button className={styles.notice__description} type="button" onClick={handleClickNavigateNotice}>
            {title}
          </button>
          <button type="button" onClick={handleClickDismissNotice} aria-label="공지 닫기">
            <CloseIcon aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
