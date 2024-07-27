import React from 'react';
import Timetable from 'components/TimetablePage/Timetable';
import useImageDownload from 'utils/hooks/useImageDownload';
import useMyLectures from 'pages/Timetable/hooks/useMyLectures';
import useTimetableDayList from 'utils/hooks/useTimetableDayList';
import { ReactComponent as CloseIcon } from 'assets/svg/close-icon-black.svg';
import { useTimeString } from 'utils/zustand/myLectures';
import { useClose } from 'utils/hooks/useClose';
import styles from './DownloadTimetableModal.module.scss';

interface DownloadTimetableModalProps {
  onClose: () => void
}

interface TimetableDownloadProps {
  rowNumber: number
  forMobile: boolean
}

function TimetableDownload({ rowNumber, forMobile }: TimetableDownloadProps) {
  const { myLectures } = useMyLectures();
  const myLectureDayValue = useTimetableDayList(myLectures);
  return (
    <Timetable
      lectures={myLectureDayValue}
      columnWidth={forMobile ? 88.73 : 140}
      firstColumnWidth={forMobile ? 44.36 : 70}
      rowHeight={forMobile ? 33.07 : 33}
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
  const { backgroundRef } = useClose({ closeFunction: onClose });

  return (
    <div className={styles.background} ref={backgroundRef}>
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
        <TimetableDownload rowNumber={timeString.length} forMobile={false} />
      </div>
      <div ref={mobileTimetableRef} className={styles['container__timetable-image']}>
        <TimetableDownload rowNumber={timeString.length} forMobile />
      </div>
    </div>
  );
}
