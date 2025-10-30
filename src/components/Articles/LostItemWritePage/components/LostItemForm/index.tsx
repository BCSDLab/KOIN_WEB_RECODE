import { cn } from '@bcsdlab/utils';
import GarbageCanIcon from 'assets/svg/Articles/garbage-can.svg';
import { LostItem, LostItemHandler } from 'components/Articles/hooks/useLostItemForm';
import FormCategory from 'components/Articles/LostItemWritePage/components/FormCategory';
import FormContent from 'components/Articles/LostItemWritePage/components/FormContent';
import FormDate from 'components/Articles/LostItemWritePage/components/FormDate';
import FormFoundPlace from 'components/Articles/LostItemWritePage/components/FormFoundPlace';
import FormImage from 'components/Articles/LostItemWritePage/components/FormImage';
import styles from './LostItemForm.module.scss';

const MAX_LOST_ITEM_TYPE = {
  FOUND: '습득물',
  LOST: '분실물',
};

interface LostItemFormProps {
  type: 'FOUND' | 'LOST';
  count: number;
  lostItem: LostItem;
  lostItemHandler: LostItemHandler;
  removeLostItem: (index: number) => void;
}

export default function LostItemForm({ type, count, lostItem, lostItemHandler, removeLostItem }: LostItemFormProps) {
  const {
    category,
    foundDate,
    foundPlace,
    content,
    images,
    hasDateBeenSelected,
    isCategorySelected,
    isDateSelected,
    isFoundPlaceSelected,
  } = lostItem;
  const { setCategory, setFoundDate, setFoundPlace, setContent, setImages, setHasDateBeenSelected } = lostItemHandler;

  const itemTag = `${MAX_LOST_ITEM_TYPE[type]} ${count + 1}`;

  return (
    <div className={styles.container}>
      <div className={styles.tag}>
        <span className={styles.tag__chip}>{itemTag}</span>
        <button
          className={cn({
            [styles.tag__delete]: true,
            [styles['tag__delete--visible']]: count > 0,
          })}
          type="button"
          onClick={() => removeLostItem(count)}
          aria-label="분실물 삭제"
        >
          <GarbageCanIcon />
        </button>
      </div>
      <div className={styles.template}>
        <div className={`${styles.template__left} ${styles.left}`}>
          <FormCategory
            category={category}
            setCategory={setCategory}
            isCategorySelected={isCategorySelected}
            type={type}
          />
          <FormDate
            foundDate={foundDate}
            setFoundDate={setFoundDate}
            isDateSelected={isDateSelected}
            hasDateBeenSelected={hasDateBeenSelected}
            setHasDateBeenSelected={setHasDateBeenSelected}
            type={type}
          />
          <FormFoundPlace
            foundPlace={foundPlace}
            setFoundPlace={setFoundPlace}
            isFoundPlaceSelected={isFoundPlaceSelected}
            type={type}
          />
        </div>
        <div className={`${styles.template__right}`}>
          <FormImage images={images} setImages={setImages} type={type} formIndex={count} />
        </div>
        <div className={styles.template__bottom}>
          <FormContent content={content} setContent={setContent} type={type} />
        </div>
      </div>
    </div>
  );
}
