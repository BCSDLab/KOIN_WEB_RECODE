import { cn } from '@bcsdlab/utils';
import WarnIcon from 'assets/svg/Articles/warn.svg';
import { FindUserCategory, useArticlesLogger } from 'components/Articles/hooks/useArticlesLogger';
import styles from './FormCategory.module.scss';

const CATEGORIES: FindUserCategory[] = ['카드', '신분증', '지갑', '전자제품', '기타'];

interface FormCategoryProps {
  category: FindUserCategory | '';
  setCategory: (category: FindUserCategory) => void;
  isCategorySelected: boolean;
  type: 'FOUND' | 'LOST';
}

export default function FormCategory({
  category, setCategory, isCategorySelected, type,
}: FormCategoryProps) {
  const { logFindUserCategory, logLostItemCategory } = useArticlesLogger();

  const handleCategoryClick = (item: FindUserCategory) => {
    if (type === 'FOUND') {
      logFindUserCategory(item);
    } else {
      logLostItemCategory(item);
    }
    setCategory(item);
  };

  return (
    <div className={styles.category}>
      <div className={styles.category__text}>
        <span className={styles.title}>품목</span>
        <span className={styles.title__description}>품목을 선택해주세요.</span>
      </div>
      <div className={styles.category__wrapper}>
        <div className={styles.category__buttons}>
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              className={cn({
                [styles.category__button]: true,
                [styles['category__button--selected']]: category === item,
              })}
              onClick={() => handleCategoryClick(item as FindUserCategory)}
            >
              {item}
            </button>
          ))}
        </div>
        {!isCategorySelected && (
          <span className={styles.warning}>
            <WarnIcon />
            품목이 선택되지 않았습니다.
          </span>
        )}
      </div>
    </div>
  );
}
