import { cn } from '@bcsdlab/utils';
import type { ReviewSorter } from 'api/storeMobile/entity';
import CheckIcon from 'assets/svg/Store/check-icon.svg';
import CloseIcon from 'assets/svg/Store/close-icon.svg';
import BottomModal, {
  BottomModalContent,
  BottomModalFooter,
  BottomModalHeader,
} from 'components/Store/mobile/common/BottomModal';
import { REVIEW_SORT_OPTIONS } from 'components/Store/mobile/StoreReviewsPage/utils/reviewSort';
import useLogger from 'utils/hooks/analytics/useLogger';

import styles from './SortModal.module.scss';

// KOIN_ORDER_WEBVIEW pages/Shop/components/SortModal 이전. 고르면 바로 적용하고 닫는다
interface SortModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (sort: ReviewSorter) => void;
  selectedSort: ReviewSorter;
}

export default function SortModal({ isOpen, onClose, onApply, selectedSort }: SortModalProps) {
  const logger = useLogger();

  const handleSelect = (sort: ReviewSorter) => {
    const selectedLabel = REVIEW_SORT_OPTIONS.find((option) => option.id === sort)?.label ?? '';

    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_detail_view_review_can',
      value: selectedLabel,
    });

    onApply(sort);
    onClose();
  };

  return (
    <BottomModal isOpen={isOpen} onClose={onClose} className={styles['sort-sheet']}>
      <BottomModalHeader className={styles['sort-sheet__header']}>
        <div className={styles['sort-sheet__title']}>정렬</div>
        <button type="button" onClick={onClose} className={styles['sort-sheet__close']}>
          <CloseIcon className={styles['sort-sheet__icon']} />
        </button>
      </BottomModalHeader>

      <BottomModalContent>
        <div className={styles['sort-sheet__options']}>
          {REVIEW_SORT_OPTIONS.map((option) => {
            const isActive = selectedSort === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option.id)}
                className={cn({
                  [styles['sort-sheet__option']]: true,
                  [styles['sort-sheet__option--active']]: isActive,
                })}
              >
                {option.label}
                {isActive && <CheckIcon className={styles['sort-sheet__check']} />}
              </button>
            );
          })}
        </div>
      </BottomModalContent>

      <BottomModalFooter />
    </BottomModal>
  );
}
