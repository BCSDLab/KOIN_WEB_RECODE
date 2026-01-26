import LostItemFilterContent, { FilterState } from 'components/Articles/components/LostItemFilterContent';
import styles from './LostItemFilterModal.module.scss';

interface LostItemFilterModalProps {
  onClose: () => void;
  onReset?: () => void;
  onApply: (filter: FilterState) => void;
  initialFilter?: FilterState;
}

export default function LostItemFilterModal(props: LostItemFilterModalProps) {
  return (
    <div className={styles.modal}>
      <div className={styles.modalInner}>
        <LostItemFilterContent {...props} />
      </div>
    </div>
  );
}
