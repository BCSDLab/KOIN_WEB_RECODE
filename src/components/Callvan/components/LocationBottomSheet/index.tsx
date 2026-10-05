import { useEffect, useRef, useState } from 'react';
import { cn } from '@bcsdlab/utils';
import { CALLVAN_POST_LOCATION_LABEL, CallvanPostLocationType } from 'api/callvan/entity';
import CloseIcon from 'assets/svg/close-icon-black.svg';
import useLogger from 'utils/hooks/analytics/useLogger';
import styles from './LocationBottomSheet.module.scss';

const CHIP_ROWS: CallvanPostLocationType[][] = [
  ['FRONT_GATE', 'BACK_GATE', 'DORMITORY_MAIN', 'DORMITORY_SUB'],
  ['TERMINAL', 'STATION', 'ASAN_STATION', 'CUSTOM'],
];

const CHIP_LABEL: Record<CallvanPostLocationType, string> = {
  ...CALLVAN_POST_LOCATION_LABEL,
  CUSTOM: '기타',
};

interface LocationBottomSheetProps {
  isOpen: boolean;
  title: string;
  initialType: CallvanPostLocationType | null;
  initialCustomName: string;
  onClose: () => void;
  onConfirm: (type: CallvanPostLocationType, customName: string) => void;
}

type LocationBottomSheetContentProps = Omit<LocationBottomSheetProps, 'isOpen'>;

function LocationBottomSheetContent({
  title,
  initialType,
  initialCustomName,
  onClose,
  onConfirm,
}: LocationBottomSheetContentProps) {
  const [selectedType, setSelectedType] = useState<CallvanPostLocationType | null>(initialType);
  const [customName, setCustomName] = useState(initialCustomName);
  const inputRef = useRef<HTMLInputElement>(null);
  const logger = useLogger();

  useEffect(() => {
    if (selectedType === 'CUSTOM') {
      inputRef.current?.focus();
    }
  }, [selectedType]);

  const isConfirmEnabled = selectedType !== null && (selectedType !== 'CUSTOM' || customName.trim() !== '');

  const handleConfirm = () => {
    if (!selectedType || !isConfirmEnabled) return;
    onConfirm(selectedType, customName);
    logger.actionEventClick({
      event_label: `${title === '출발지가 어디인가요?' ? 'callvan_write_departure' : 'callvan_write_arrival'}`,
      team: 'CAMPUS',
      value: selectedType,
    });
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose} aria-hidden />
      <div className={styles.sheet} role="dialog" aria-modal aria-label={title}>
        <div className={styles.sheet__header}>
          <p className={styles.sheet__title}>{title}</p>
          <button type="button" className={styles.sheet__close} onClick={onClose} aria-label="닫기">
            <CloseIcon />
          </button>
        </div>

        <div className={styles.sheet__content}>
          <div className={styles['chip-group']}>
            {CHIP_ROWS.map((row, rowIndex) => (
              <div key={rowIndex} className={styles['chip-row']}>
                {row.map((locationType) => (
                  <button
                    key={locationType}
                    type="button"
                    className={cn({
                      [styles.chip]: true,
                      [styles['chip--selected']]: selectedType === locationType,
                    })}
                    onClick={() => setSelectedType(locationType)}
                  >
                    {CHIP_LABEL[locationType]}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <hr className={styles.divider} />

          {selectedType === 'CUSTOM' && (
            <input
              ref={inputRef}
              type="text"
              className={styles['custom-input']}
              placeholder="직접 입력해주세요."
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              maxLength={50}
            />
          )}

          <button
            type="button"
            className={styles['confirm-button']}
            onClick={handleConfirm}
            disabled={!isConfirmEnabled}
          >
            {selectedType === 'CUSTOM' ? '입력 완료' : '선택하기'}
          </button>
        </div>
      </div>
    </>
  );
}

export default function LocationBottomSheet({ isOpen, ...props }: LocationBottomSheetProps) {
  if (!isOpen) return null;
  return <LocationBottomSheetContent {...props} />;
}
