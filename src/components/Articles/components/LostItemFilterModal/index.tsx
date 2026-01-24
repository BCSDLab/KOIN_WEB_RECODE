import { useState } from 'react';
import CloseIcon from 'assets/svg/Articles/close.svg';
import RefreshIcon from 'assets/svg/Articles/refresh.svg';
import { LIST_OPTIONS, CATEGORY_OPTIONS, ITEM_TYPE_OPTIONS, STATUS_OPTIONS } from 'static/filterOptions';
import styles from './LostItemFilterModal.module.scss';

interface LostItemFilterModalProps {
  onClose: () => void;
  onReset?: () => void;
  onApply: (filter: FilterState) => void;
}

export type Author = 'MY';
export type Type = 'FOUND' | 'LOST';
export type Category = 'CARD' | 'ID' | 'WALLET' | 'ELECTRONICS' | 'ETC';
export type FoundStatus = 'FOUND' | 'NOT_FOUND';

export type FilterState = {
  author: Author[];
  type: Type[];
  category: Category[];
  foundStatus: FoundStatus[];
};

const DEFAULT_FILTER: FilterState = {
  author: [],
  type: [],
  category: [],
  foundStatus: [],
};

function toggleInArray<T>(arr: T[], value: T) {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

interface ChipOption<T extends string> {
  key: T;
  label: string;
}

interface ChipGroupProps<T extends string> {
  value: T[];
  options: readonly ChipOption<T>[];
  onChange: (next: T[]) => void;
  allLabel?: string;
}

function ChipGroup<T extends string>({ value, options, onChange, allLabel = '전체' }: ChipGroupProps<T>) {
  return (
    <div className={styles.chips}>
      <button
        type="button"
        className={`${styles.chip} ${value.length === 0 ? styles.active : ''}`}
        onClick={() => onChange([])}
      >
        {allLabel}
      </button>

      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          className={`${styles.chip} ${value.includes(opt.key) ? styles.active : ''}`}
          onClick={() => onChange(toggleInArray(value, opt.key))}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
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
        <ChipGroup
          value={filter.author}
          options={LIST_OPTIONS}
          onChange={(author) => setFilter((p) => ({ ...p, author }))}
        />
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.label}>물품 카테고리</div>
        <ChipGroup
          value={filter.type}
          options={CATEGORY_OPTIONS}
          onChange={(type) => setFilter((p) => ({ ...p, type }))}
        />
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.label}>물품 종류</div>
        <ChipGroup
          value={filter.category}
          options={ITEM_TYPE_OPTIONS}
          onChange={(category) => setFilter((p) => ({ ...p, category }))}
        />
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.label}>물품 상태</div>
        <ChipGroup
          value={filter.foundStatus}
          options={STATUS_OPTIONS}
          onChange={(foundStatus) => setFilter((p) => ({ ...p, foundStatus }))}
        />
      </div>

      <div className={styles.footer}>
        <button type="button" className={styles.reset} onClick={handleReset}>
          초기화
          <RefreshIcon />
        </button>
        <button type="button" className={styles.apply} onClick={() => onApply(filter)}>
          적용하기
        </button>
      </div>
    </div>
  );
}
