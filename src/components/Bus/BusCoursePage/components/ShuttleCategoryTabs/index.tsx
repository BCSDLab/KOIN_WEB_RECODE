import { cn } from '@bcsdlab/utils';
import styles from './ShuttleCategoryTabs.module.scss';

interface ShuttleCategoryTabsProps {
  category: string;
  onChange: (v: string) => void;
}

const courseCategory = ['전체', '주중노선', '주말노선', '순환노선'];

export function ShuttleCategoryTabs({ category, onChange }: ShuttleCategoryTabsProps) {
  return (
    <div className={styles['course-category']}>
      {courseCategory.map((value) => (
        <button
          key={value}
          className={cn({
            [styles['course-category__button']]: true,
            [styles['course-category__button--selected']]: value === category,
          })}
          type="button"
          onClick={() => onChange(value)}
        >
          {value}
        </button>
      ))}
    </div>
  );
}
