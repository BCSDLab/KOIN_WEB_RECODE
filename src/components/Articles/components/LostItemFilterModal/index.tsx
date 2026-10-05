import LostItemFilterContent, { type FilterState } from 'components/Articles/components/LostItemFilterContent';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';

import styles from './LostItemFilterModal.module.scss';

interface LostItemFilterModalProps {
  onClose: () => void;
  onReset?: () => void;
  onApply: (filter: FilterState) => void;
  initialFilter?: FilterState;
}

export default function LostItemFilterModal(props: LostItemFilterModalProps) {
  const { containerRef } = useOutsideClick<HTMLDivElement>({
    onOutsideClick: () => {
      props.onClose();
    },
  });

  return (
    <div className={styles.modal}>
      <div ref={containerRef} className={styles['modal-inner']}>
        <LostItemFilterContent {...props} />
      </div>
    </div>
  );
}
