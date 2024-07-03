import React from 'react';
import Timetable from 'components/TimetablePage/Timetable';
import useImageDownload from 'utils/hooks/useImageDownload';
import useMyLectures from 'pages/Timetable/hooks/useMyLectures';
import useTimetableDayList from 'utils/hooks/useTimetableDayList';
import { ReactComponent as CloseIcon } from 'assets/svg/close-icon-black.svg';
import { useTimeString } from 'utils/zustand/myLectures';
import styles from './DownloadTimetableModal.module.scss';

interface DownloadTimetableModalProps {
  onClose: () => void
}

interface TimetableDownloadProps {
  rowNumber: number
}

function TimetableForPCDownload({ rowNumber }: TimetableDownloadProps) {
  const { myLectures } = useMyLectures();
  const myLectureDayValue = useTimetableDayList(myLectures);
  return (
    <Timetable
      lectures={myLectureDayValue}
      columnWidth={140}
      firstColumnWidth={70}
      rowHeight={33}
      totalHeight={rowNumber * 33 + 38}
      forDownload
    />
  );
}

function TimetableForMobileDownload({ rowNumber }: TimetableDownloadProps) {
  const { myLectures } = useMyLectures();
  const myLectureDayValue = useTimetableDayList(myLectures);
  return (
    <Timetable
      lectures={myLectureDayValue}
      columnWidth={88.73}
      firstColumnWidth={44.36}
      rowHeight={33.07}
      totalHeight={rowNumber * 33 + 38}
      forDownload
    />
  );
}

export default function DownloadTimetableModal({
  onClose,
}: DownloadTimetableModalProps) {
  const { onImageDownload: DownloadForPC, divRef: pcTimetableRef } = useImageDownload();
  const { onImageDownload: DownloadForMobile, divRef: mobileTimetableRef } = useImageDownload();
  const onClickImageDownload = (usage: string) => {
    if (usage === 'PC') {
      DownloadForPC('my-timetable');
    } else {
      DownloadForMobile('my-timetable');
    }
    onClose();
  };
  const { timeString } = useTimeString();

  return (
    <div className={styles.background} aria-hidden>
      <div className={styles.container}>
        <div className={styles.container__header}>
          <div className={styles['container__header--text']}>시간표 저장</div>
          <CloseIcon onClick={onClose} className={styles['container__header--close-button']} />
        </div>
        <div className={styles['container__image-option']}>저장할 이미지 형식을 선택해 주세요.</div>
        <div className={styles.container__button}>
          <button type="button" className={styles['container__button--mobile']} onClick={() => onClickImageDownload('Mobile')}>모바일 이미지 저장</button>
          <button type="button" className={styles['container__button--pc']} onClick={() => onClickImageDownload('PC')}>PC용 이미지 저장</button>
        </div>
      </div>
      <div ref={pcTimetableRef} className={styles['container__timetable-image']}>
        <TimetableForPCDownload rowNumber={timeString.length} />
      </div>
      <div ref={mobileTimetableRef} className={styles['container__timetable-image']}>
        <TimetableForMobileDownload rowNumber={timeString.length} />
      </div>
    </div>
  );
}
