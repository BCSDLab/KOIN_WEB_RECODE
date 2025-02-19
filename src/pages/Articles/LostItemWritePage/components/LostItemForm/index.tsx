import GarbageCanIcon from 'assets/svg/Articles/garbage-can.svg';
import { LostItem, LostItemHandler } from 'pages/Articles/hooks/useLostItemForm';
import FormImage from 'pages/Articles/LostItemWritePage/components/FormImage';
import FormContent from 'pages/Articles/LostItemWritePage/components/FormContent';
import FormFoundPlace from 'pages/Articles/LostItemWritePage/components/FormFoundPlace';
import FormCategory from 'pages/Articles/LostItemWritePage/components/FormCategory';
import FormDate from 'pages/Articles/LostItemWritePage/components/FormDate';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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

export default function LostItemForm({
  type, count, lostItem, lostItemHandler, removeLostItem,
}: LostItemFormProps) {
  const location = useLocation();
  const {
    // type,
    category,
    foundDate,
    foundPlace,
    content,
    author,
    images,
    registered_at,
    updated_at,
    hasDateBeenSelected,
    isCategorySelected,
    isDateSelected,
    isFoundPlaceSelected,
  } = lostItem;
  const {
    setCategory,
    setFoundDate,
    setFoundPlace,
    setContent,
    setImages,
    setHasDateBeenSelected,
  } = lostItemHandler;

  // const itemTag = `${MAX_LOST_ITEM_TYPE[type]} ${count + 1}`;
  const itemTag = `${MAX_LOST_ITEM_TYPE[type]} ${count + 1}`;

  return (
    <div className={styles.container}>
      <div className={styles.tag}>
        <span className={styles.tag__chip}>
          {itemTag}
        </span>
        <button
          className={styles.tag__delete}
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
          <FormImage images={images} setImages={setImages} type={type} />
        </div>
        <div className={styles.template__bottom}>
          <FormContent content={content} setContent={setContent} type={type} />
        </div>
      </div>
    </div>
  );
}
