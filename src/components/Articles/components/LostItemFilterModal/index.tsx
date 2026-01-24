import { useState } from 'react';
import CloseIcon from 'assets/svg/Articles/close.svg';
import RefreshIcon from 'assets/svg/Articles/refresh.svg';
import styles from './LostItemFilterModal.module.scss';

interface LostItemFilterModalProps {
  onClose: () => void;
  onReset?: () => void;
  onApply?: (filter: FilterState) => void;
}

type ListType = 'MY';
type Category = 'FOUND' | 'LOST';
type ItemType = 'CARD' | 'ID' | 'WALLET' | 'ELECTRONICS' | 'ETC';
type Status = 'SEARCHING' | 'FOUND';

type FilterState = {
  listTypes: ListType[];
  categories: Category[];
  itemTypes: ItemType[];
  statuses: Status[];
};

const DEFAULT_FILTER: FilterState = {
  listTypes: [],
  categories: [],
  itemTypes: [],
  statuses: [],
};

function toggleInArray<T>(arr: T[], value: T) {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export default function LostItemFilterModal({ onClose, onReset, onApply }: LostItemFilterModalProps) {
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);

  const handleReset = () => {
    setFilter(DEFAULT_FILTER);
    onReset?.();
  };

  return (
    <div className={styles.modal} role="dialog" aria-label="필터 모달">
      <div className={styles.header}>
        <div className={styles.title}>필터</div>
        <button type="button" className={styles.close} onClick={onClose}>
          <CloseIcon />
        </button>
      </div>

      <div className={styles.section}>
        <div className={styles.label}>목록</div>
        <div className={styles.chips}>
          <button
            type="button"
            className={`${styles.chip} ${filter.listTypes.length === 0 ? styles.active : ''}`}
            onClick={() => setFilter((p) => ({ ...p, listTypes: [] }))}
          >
            전체
          </button>

          <button
            type="button"
            className={`${styles.chip} ${filter.listTypes.includes('MY') ? styles.active : ''}`}
            onClick={() => setFilter((p) => ({ ...p, listTypes: toggleInArray(p.listTypes, 'MY') }))}
          >
            내 게시물
          </button>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.label}>물품 카테고리</div>
        <div className={styles.chips}>
          <button
            type="button"
            className={`${styles.chip} ${filter.categories.length === 0 ? styles.active : ''}`}
            onClick={() => setFilter((p) => ({ ...p, categories: [] }))}
          >
            전체
          </button>

          <button
            type="button"
            className={`${styles.chip} ${filter.categories.includes('FOUND') ? styles.active : ''}`}
            onClick={() => setFilter((p) => ({ ...p, categories: toggleInArray(p.categories, 'FOUND') }))}
          >
            습득물
          </button>

          <button
            type="button"
            className={`${styles.chip} ${filter.categories.includes('LOST') ? styles.active : ''}`}
            onClick={() => setFilter((p) => ({ ...p, categories: toggleInArray(p.categories, 'LOST') }))}
          >
            분실물
          </button>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.label}>물품 종류</div>
        <div className={styles.chips}>
          <button
            type="button"
            className={`${styles.chip} ${filter.itemTypes.length === 0 ? styles.active : ''}`}
            onClick={() => setFilter((p) => ({ ...p, itemTypes: [] }))}
          >
            전체
          </button>

          <button
            type="button"
            className={`${styles.chip} ${filter.itemTypes.includes('CARD') ? styles.active : ''}`}
            onClick={() => setFilter((p) => ({ ...p, itemTypes: toggleInArray(p.itemTypes, 'CARD') }))}
          >
            카드
          </button>

          <button
            type="button"
            className={`${styles.chip} ${filter.itemTypes.includes('ID') ? styles.active : ''}`}
            onClick={() => setFilter((p) => ({ ...p, itemTypes: toggleInArray(p.itemTypes, 'ID') }))}
          >
            신분증
          </button>

          <button
            type="button"
            className={`${styles.chip} ${filter.itemTypes.includes('WALLET') ? styles.active : ''}`}
            onClick={() => setFilter((p) => ({ ...p, itemTypes: toggleInArray(p.itemTypes, 'WALLET') }))}
          >
            지갑
          </button>

          <button
            type="button"
            className={`${styles.chip} ${filter.itemTypes.includes('ELECTRONICS') ? styles.active : ''}`}
            onClick={() => setFilter((p) => ({ ...p, itemTypes: toggleInArray(p.itemTypes, 'ELECTRONICS') }))}
          >
            전자제품
          </button>

          <button
            type="button"
            className={`${styles.chip} ${filter.itemTypes.includes('ETC') ? styles.active : ''}`}
            onClick={() => setFilter((p) => ({ ...p, itemTypes: toggleInArray(p.itemTypes, 'ETC') }))}
          >
            기타
          </button>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.label}>물품 상태</div>
        <div className={styles.chips}>
          <button
            type="button"
            className={`${styles.chip} ${filter.statuses.length === 0 ? styles.active : ''}`}
            onClick={() => setFilter((p) => ({ ...p, statuses: [] }))}
          >
            전체
          </button>

          <button
            type="button"
            className={`${styles.chip} ${filter.statuses.includes('SEARCHING') ? styles.active : ''}`}
            onClick={() => setFilter((p) => ({ ...p, statuses: toggleInArray(p.statuses, 'SEARCHING') }))}
          >
            찾는중
          </button>

          <button
            type="button"
            className={`${styles.chip} ${filter.statuses.includes('FOUND') ? styles.active : ''}`}
            onClick={() => setFilter((p) => ({ ...p, statuses: toggleInArray(p.statuses, 'FOUND') }))}
          >
            찾음
          </button>
        </div>
      </div>

      <div className={styles.footer}>
        <button type="button" className={styles.reset} onClick={handleReset}>
          초기화
          <RefreshIcon />
        </button>
        <button type="button" className={styles.apply} onClick={() => onApply?.(filter)}>
          적용하기
        </button>
      </div>
    </div>
  );
}
