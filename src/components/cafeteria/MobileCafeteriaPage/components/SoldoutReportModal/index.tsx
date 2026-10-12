import { useEffect, useState } from 'react';

import { cn } from '@bcsdlab/utils';
import type { DiningPlace } from 'api/dinings/entity';
import CloseIcon from 'assets/svg/cafeteria/soldout-report-close-icon.svg';
import { useCafeteriaParams } from 'components/cafeteria/hooks/useCafeteriaParams';
import useDinings from 'components/cafeteria/hooks/useDinings';
import { getSoldoutPlaces } from 'components/cafeteria/utils/filter';
import showMobileToast from 'components/feedback/Toast/showMobileToast';
import { SOLDOUT_REPORT_PLACES } from 'static/cafeteria';
import useLogger from 'utils/hooks/analytics/useLogger';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import useUploadFile from 'utils/hooks/uploadFile/useUploadFile';

import PhotoCapture from './components/PhotoCapture';
import useCreateSoldoutReport from './hooks/useCreateSoldoutReport';
import styles from './SoldoutReportModal.module.scss';

interface SoldoutReportModalProps {
  initialPlace?: DiningPlace;
  variantLabel: string;
  onClose: () => void;
}

export default function SoldoutReportModal({ initialPlace, variantLabel, onClose }: SoldoutReportModalProps) {
  const logger = useLogger();
  const { date, diningType } = useCafeteriaParams();
  const { dinings } = useDinings(date.current());
  const soldoutPlaces = getSoldoutPlaces(dinings, diningType);
  const availablePlaces = SOLDOUT_REPORT_PLACES.filter((place) => !soldoutPlaces.includes(place));
  const [selectedPlace, setSelectedPlace] = useState<DiningPlace | null>(
    initialPlace && !soldoutPlaces.includes(initialPlace) ? initialPlace : (availablePlaces[0] ?? null),
  );
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const { uploadFile, isPending: isUploading } = useUploadFile();
  const { mutate: createSoldoutReport, isPending: isSubmitting } = useCreateSoldoutReport();

  useEffect(
    () => () => {
      if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    },
    [photoPreviewUrl],
  );

  const handlePlaceSelect = (place: DiningPlace) => {
    if (variantLabel === 'A안') {
      logger.actionEventClick({
        event_name: 'DA1',
        event_category: 'select',
        event_label: 'cafeteria__dining__soldout__select',
        value: `A안_${place}`,
      });
    }
    setSelectedPlace(place);
  };

  const handlePhotoCapture = (file: File) => {
    logger.actionEventClick({
      event_name: 'DA1',
      event_label: 'cafeteria__dining__soldout__photo',
      value: `${variantLabel}_${selectedPlace ?? ''}`,
    });

    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    setPhotoFile(file);
    setPhotoPreviewUrl(URL.createObjectURL(file));
  };

  const canSubmit = !!selectedPlace && !!photoFile;
  const isProcessing = isUploading || isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit || !selectedPlace || !photoFile || isProcessing) return;

    const targetDining = dinings.find((dining) => dining.place === selectedPlace && dining.type === diningType);
    if (!targetDining) {
      showMobileToast('error', '식단 정보를 찾을 수 없습니다.');

      return;
    }

    logger.actionEventClick({
      event_name: 'DA1',
      event_category: 'submit',
      event_label: 'cafeteria__dining__soldout__submit',
      value: `${variantLabel}_${selectedPlace}`,
    });

    let imageUrl: string;
    try {
      const uploaded = await uploadFile({ domain: 'COOP', file: photoFile });
      imageUrl = uploaded.file_url;
    } catch {
      showMobileToast('error', '사진 업로드에 실패했습니다.');

      return;
    }

    createSoldoutReport(
      { diningId: targetDining.id, imageUrl },
      {
        onSuccess: () => {
          showMobileToast('success', `${selectedPlace} 품절 제보되었습니다.`);
          onClose();
        },
      },
    );
  };

  const handleClose = () => {
    logger.actionEventClick({
      event_name: 'DA1',
      event_label: 'cafeteria__dining__soldout__exit',
      value: selectedPlace ? `${variantLabel}_${selectedPlace}_이탈` : `${variantLabel}_이탈`,
    });
    onClose();
  };

  const { backgroundRef } = useOutsideClick({ onOutsideClick: handleClose });

  return (
    <div className={styles.background} ref={backgroundRef}>
      <div className={styles.container}>
        <div className={styles.container__header}>
          <span className={styles.container__title}>식단 품절 제보하기</span>
          <button type="button" className={styles.container__close} aria-label="닫기" onClick={handleClose}>
            <CloseIcon />
          </button>
        </div>

        <div className={styles.section}>
          <span className={styles.section__label}>품절 코너 선택</span>
          <div className={styles.chips}>
            {SOLDOUT_REPORT_PLACES.map((place) => {
              const isSoldout = soldoutPlaces.includes(place);
              const isLockedByVariant = variantLabel === 'B안' && place !== selectedPlace;

              return (
                <button
                  key={place}
                  type="button"
                  className={cn({
                    [styles.chip]: true,
                    [styles['chip--selected']]: place === selectedPlace,
                    [styles['chip--soldout']]: isSoldout || isLockedByVariant,
                  })}
                  disabled={isSoldout || isLockedByVariant}
                  onClick={() => handlePlaceSelect(place)}
                >
                  {place}
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.section}>
          <span className={styles.section__label}>품절 사진 촬영</span>
          <div className={styles.photo}>
            <PhotoCapture previewUrl={photoPreviewUrl} onCapture={handlePhotoCapture} />
            <div className={styles.photo__guide}>
              <ul>
                <li>배식대의 품절 안내판 촬영</li>
                <li>학식당 앞 품절 식판 안내</li>
                <li>품절 상태 확인 가능한 사진</li>
                <li>품절 미확인 시 제보 반려</li>
                <li>앱 내 직접 촬영 사진만 가능</li>
              </ul>
            </div>
          </div>
        </div>

        <button
          type="button"
          className={cn({
            [styles.submit]: true,
            [styles['submit--active']]: canSubmit,
          })}
          disabled={!canSubmit || isProcessing}
          onClick={handleSubmit}
        >
          품절 제보하기
        </button>
      </div>
    </div>
  );
}
