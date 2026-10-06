import { useEffect, useRef, useState } from 'react';

import { cn } from '@bcsdlab/utils';
import type { DiningPlace } from 'api/dinings/entity';
import CameraAddIcon from 'assets/svg/cafeteria/soldout-report-camera-icon.svg';
import CloseIcon from 'assets/svg/cafeteria/soldout-report-close-icon.svg';
import useLogger from 'utils/hooks/analytics/useLogger';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import showToast from 'utils/ts/showToast';

import styles from './SoldoutReportModal.module.scss';

interface SoldoutReportModalProps {
  places: DiningPlace[];
  soldoutPlaces?: DiningPlace[];
  initialPlace?: DiningPlace;
  placeLabelMap: Partial<Record<DiningPlace, string>>;
  variantLabel: string;
  onClose: () => void;
}

export default function SoldoutReportModal({
  places,
  soldoutPlaces = [],
  initialPlace,
  placeLabelMap,
  variantLabel,
  onClose,
}: SoldoutReportModalProps) {
  const logger = useLogger();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const availablePlaces = places.filter((place) => !soldoutPlaces.includes(place));
  const [selectedPlace, setSelectedPlace] = useState<DiningPlace | null>(
    initialPlace && !soldoutPlaces.includes(initialPlace) ? initialPlace : (availablePlaces[0] ?? null),
  );
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);

  useEffect(
    () => () => {
      if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    },
    [photoPreviewUrl],
  );

  // Notion 로깅 스펙 상 "코너 선택(select)" 단계는 A안(헤더 버튼)에만 존재한다.
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

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

  const handleSubmit = () => {
    if (!canSubmit || !selectedPlace) return;

    logger.actionEventClick({
      event_name: 'DA1',
      event_category: 'submit',
      event_label: 'cafeteria__dining__soldout__submit',
      value: `${variantLabel}_${selectedPlace}`,
    });
    showToast('success', `${placeLabelMap[selectedPlace] ?? selectedPlace} 품절 제보되었습니다.`);
    onClose();
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
          <span className={styles.section__label}>품절 코스 선택</span>
          <div className={styles.chips}>
            {places.map((place) => {
              const isSoldout = soldoutPlaces.includes(place);

              return (
                <button
                  key={place}
                  type="button"
                  className={cn({
                    [styles.chip]: true,
                    [styles['chip--selected']]: place === selectedPlace,
                    [styles['chip--soldout']]: isSoldout,
                  })}
                  disabled={isSoldout}
                  onClick={() => handlePlaceSelect(place)}
                >
                  {placeLabelMap[place] ?? place}
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.section}>
          <span className={styles.section__label}>품절 사진 촬영</span>
          <div className={styles.photo}>
            <button
              type="button"
              className={styles['photo__camera-box']}
              aria-label="품절 사진 촬영하기"
              onClick={handleCameraClick}
            >
              {photoPreviewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- 사용자가 방금 찍은 로컬 파일 미리보기라 next/image 최적화 대상이 아님
                <img src={photoPreviewUrl} alt="품절 사진 미리보기" className={styles['photo__preview-image']} />
              ) : (
                <>
                  <CameraAddIcon />
                  <span className={styles['photo__camera-text']}>사진 촬영하기</span>
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className={styles['photo__file-input']}
              onChange={handlePhotoChange}
              aria-label="품절 사진 파일 선택"
            />
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
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          품절 제보하기
        </button>
      </div>
    </div>
  );
}
