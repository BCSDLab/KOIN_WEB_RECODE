import { useState } from 'react';
import CloseIcon from 'assets/svg/Articles/close.svg';
import RefreshIcon from 'assets/svg/Articles/refresh.svg';
import { useArticlesLogger } from 'components/Articles/hooks/useArticlesLogger';
import { LIST_OPTIONS, CATEGORY_OPTIONS, ITEM_TYPE_OPTIONS, STATUS_OPTIONS } from 'static/filterOptions';
import styles from './LostItemFilterContent.module.scss';

export type Author = 'ALL' | 'MY';
export type Type = 'ALL' | 'LOST' | 'FOUND';
export type Category = 'CARD' | 'ID' | 'WALLET' | 'ELECTRONICS' | 'ETC';
export type FoundStatus = 'ALL' | 'FOUND' | 'NOT_FOUND';

export type FilterState = {
  author: Author;
  type: Type;
  category: Category[];
  foundStatus: FoundStatus;
};

const DEFAULT_FILTER: FilterState = {
  author: 'ALL',
  type: 'ALL',
  category: [],
  foundStatus: 'ALL',
};

// 단일 선택 Chip --------------------
interface ChipSingleOption<T extends string> {
  key: T;
  label: string;
}

function ChipSingle<T extends string>({
  value,
  options,
  onChange,
  allKey,
  allLabel = '전체',
}: {
  value: T | null;
  options: readonly ChipSingleOption<T>[];
  onChange: (next: T) => void;
  allKey: T;
  allLabel?: string;
}) {
  return (
    <div className={styles.chips}>
      <button
        type="button"
        className={`${styles.chip} ${value === allKey ? styles.active : ''}`}
        onClick={() => onChange(allKey)}
      >
        {allLabel}
      </button>
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          className={`${styles.chip} ${value === opt.key ? styles.active : ''}`}
          onClick={() => onChange(opt.key)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// 복수 선택 Chip --------------------
function toggleInArray<T>(arr: T[], value: T) {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

function ChipMulti<T extends string>({
  value,
  options,
  onChange,
  allLabel = '전체',
}: {
  value: T[];
  options: readonly ChipSingleOption<T>[];
  onChange: (next: T[]) => void;
  allLabel?: string;
}) {
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

interface LostItemFilterContentProps {
  onClose: () => void;
  onReset?: () => void;
  onApply: (filter: FilterState) => void;
  initialFilter?: FilterState;
}

export default function LostItemFilterContent({
  onClose,
  onReset,
  onApply,
  initialFilter,
}: LostItemFilterContentProps) {
  const { logLostItemFilterApply } = useArticlesLogger();
  const [filter, setFilter] = useState<FilterState>(initialFilter ?? DEFAULT_FILTER);

  const handleApply = () => {
    logLostItemFilterApply();
    onApply(filter);
  };

  const handleReset = () => {
    setFilter(DEFAULT_FILTER);
    onReset?.();
  };

  return (
    <div className={styles.container} role="dialog" aria-label="필터">
      <div className={styles.header}>
        <div className={styles.title}>필터</div>
        <button type="button" className={styles.close} onClick={onClose} aria-label="닫기">
          <CloseIcon />
        </button>
      </div>

      <div className={styles.section}>
        <div className={styles.label}>목록</div>
        <ChipSingle
          value={filter.author}
          options={LIST_OPTIONS}
          allKey="ALL"
          onChange={(author) => setFilter((p) => ({ ...p, author }))}
        />
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.label}>물품 카테고리</div>
        <ChipSingle
          value={filter.type}
          options={CATEGORY_OPTIONS}
          allKey="ALL"
          onChange={(type) => setFilter((p) => ({ ...p, type }))}
        />
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.label}>물품 종류</div>
        <div className={styles.categorys}>
          <ChipMulti
            value={filter.category}
            options={ITEM_TYPE_OPTIONS}
            onChange={(category) => setFilter((p) => ({ ...p, category }))}
          />
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.label}>물품 상태</div>
        <ChipSingle
          value={filter.foundStatus}
          options={STATUS_OPTIONS}
          allKey="ALL"
          onChange={(foundStatus) => setFilter((p) => ({ ...p, foundStatus }))}
        />
      </div>

      <div className={styles.footer}>
        <button type="button" className={styles.reset} onClick={handleReset}>
          초기화
          <RefreshIcon />
        </button>
        <button type="button" className={styles.apply} onClick={handleApply}>
          적용하기
        </button>
      </div>
    </div>
  );
}
