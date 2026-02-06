import LostItemFilterContent from 'components/Articles/components/LostItemFilterContent';
import BottomModal from 'components/ui/BottomModal';
import type { FilterState } from 'components/Articles/components/LostItemFilterContent';
import styles from './LostItemFilterBottomSheet.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onReset?: () => void;
  onApply: (filter: FilterState) => void;
  initialFilter?: FilterState;
}

export default function LostItemFilterBottomSheet({ isOpen, onClose, onReset, onApply, initialFilter }: Props) {
  return (
    <BottomModal isOpen={isOpen} onClose={onClose} className={styles.sheet}>
      <div className={styles.sheetInner}>
        <LostItemFilterContent initialFilter={initialFilter} onClose={onClose} onReset={onReset} onApply={onApply} />
      </div>
    </BottomModal>
  );
}
