import { cn } from '@bcsdlab/utils';
import { uploadLostItemFile } from 'api/uploadFile';
import ChevronDown from 'assets/svg/Articles/chevron-down.svg';
import PhotoIcon from 'assets/svg/Articles/photo.svg';
import GarbageCanIcon from 'assets/svg/Articles/garbage-can.svg';
import WarnIcon from 'assets/svg/Articles/warn.svg';
import RemoveImageIcon from 'assets/svg/Articles/remove-image.svg';
import Calendar from 'pages/Articles/components/Calendar';
import { LostItem, LostItemHandler } from 'pages/Articles/hooks/useLostItemForm';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import useImageUpload from 'utils/hooks/ui/useImageUpload';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import showToast from 'utils/ts/showToast';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import { FindUserCategory, useArticlesLogger } from 'pages/Articles/hooks/useArticlesLogger';
import { useState } from 'react';
import styles from './LostItemForm.module.scss';

const MAX_LOST_ITEM_TYPE = {
  found: '습득물',
  lost: '분실물',
};

const CATEGORIES: FindUserCategory[] = ['카드', '신분증', '지갑', '전자제품', '그 외'];

const MAX_IMAGES_LENGTH = 10;
const MAX_CONTENT_LENGTH = 1000;

const getyyyyMMdd = (date: Date) => {
  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}.${MM}.${dd}`;
};

interface LostItemFormProps {
  type: 'found' | 'lost';
  count: number;
  lostItem: LostItem;
  lostItemHandler: LostItemHandler;
  removeLostItem: (index: number) => void;
}

export default function LostItemForm({
  type, count, lostItem, lostItemHandler, removeLostItem,
}: LostItemFormProps) {
  const isMobile = useMediaQuery();
  const {
    category,
    foundDate,
    foundPlace,
    content,
    images,
    hasDateBeenSelected,
    isCategorySelected,
    isDateSelected,
    isFoundPlaceSelected: isLocationSelected,
  } = lostItem;
  const {
    setCategory,
    setFoundDate,
    setFoundPlace,
    setContent,
    setImages,
    setHasDateBeenSelected,
  } = lostItemHandler;
  const {
    imgRef, saveImgFile,
  } = useImageUpload({ uploadFn: uploadLostItemFile });

  const [calendarOpen,, closeCalendar, toggleCalendar] = useBooleanState(false);
  const { logFindUserCategory } = useArticlesLogger();

  const [localContent, setLocalContent] = useState(content);
  const contentCounter = `${localContent.length}/${MAX_CONTENT_LENGTH}`;
  const imageCounter = `${images.length}/${MAX_IMAGES_LENGTH}`;

  const handleContentChange = (value: string) => {
    if (value.length <= MAX_CONTENT_LENGTH) {
      setLocalContent(value);
    } else {
      showToast('error', `최대 ${MAX_CONTENT_LENGTH}자까지 입력 가능합니다.`);
    }
  };

  const handleCategoryClick = (item: FindUserCategory) => {
    logFindUserCategory(item);
    setCategory(item);
  };

  const handleDateSelect = (date: Date) => {
    setFoundDate(date);
    setHasDateBeenSelected();
    closeCalendar();
  };

  const saveImage = async () => {
    if (images.length >= MAX_IMAGES_LENGTH) {
      showToast('error', `파일은 ${MAX_IMAGES_LENGTH}개까지 등록할 수 있습니다.`);
      return;
    }

    saveImgFile().then((res) => {
      setImages([...images, ...res!]);
    });
  };

  const deleteImage = (url: string) => {
    setImages(images.filter((image: string) => image !== url));
  };

  const { containerRef } = useOutsideClick({ onOutsideClick: closeCalendar });
  useEscapeKeyDown({ onEscape: closeCalendar });

  return (
    <div className={styles.container}>
      <div className={styles.tag}>
        <span className={styles.tag__chip}>
          {MAX_LOST_ITEM_TYPE[type]}
          &nbsp;
          {count + 1}
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
          <div
            className={styles.date}
          >
            <span className={styles.title}>습득 일자</span>
            <div className={styles.date__wrapper} ref={containerRef}>
              <div className={styles.date__wrapper}>
                <button
                  className={styles.date__toggle}
                  type="button"
                  onClick={toggleCalendar}
                >
                  <span
                    className={cn({
                      [styles.date__description]: true,
                      [styles['date__description--has-been-selected']]: hasDateBeenSelected,
                    })}
                  >
                    {hasDateBeenSelected ? getyyyyMMdd(foundDate) : '습득 일자를 선택해주세요.'}
                  </span>
                  <span className={cn({
                    [styles.icon]: true,
                    [styles['icon--open']]: calendarOpen,
                  })}
                  >
                    <ChevronDown />
                  </span>
                </button>
                {calendarOpen && (
                  <div className={styles.date__calendar}>
                    <Calendar
                      selectedDate={foundDate}
                      setSelectedDate={handleDateSelect}
                    />
                  </div>
                )}
                {!isDateSelected && (
                  <span className={styles.warning}>
                    <WarnIcon />
                    습득 일자가 입력되지 않았습니다.
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className={styles['found-place']}>
            <span className={styles.title}>습득 장소</span>
            <div className={styles['found-place__wrapper']}>
              <input
                className={styles['found-place__input']}
                defaultValue={foundPlace}
                onBlur={(e) => setFoundPlace(e.target.value)}
                placeholder="습득 장소를 선택해주세요."
              />
              {!isLocationSelected && (
                <span className={styles.warning}>
                  <WarnIcon />
                  습득 장소가 입력되지 않았습니다.
                </span>
              )}
            </div>
          </div>
        </div>

        <div className={`${styles.template__right}`}>
          <div className={styles.images}>
            <div className={styles.images__header}>
              <span className={styles.title}>사진</span>
              <div className={styles.images__text}>
                <span className={styles.title__description}>습득물 사진을 업로드해주세요.</span>
                <span className={styles.images__counter}>
                  {imageCounter}
                </span>
              </div>
            </div>
            {(!isMobile || images.length !== 0) && (
              <ul className={styles.images__list}>
                {images.map((url: string) => (
                  <li key={url} className={styles.images__item}>
                    <img
                      src={url}
                      className={styles.images__image}
                      alt="분실물 이미지"
                    />
                    <button
                      className={styles.images__delete}
                      type="button"
                      aria-label="이미지 삭제"
                      onClick={() => deleteImage(url)}
                    >
                      <RemoveImageIcon />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <label htmlFor="image-file" className={styles.images__upload}>
              <PhotoIcon />
              사진 등록하기
              <input
                type="file"
                ref={imgRef}
                accept="image/*"
                id="image-file"
                multiple
                onChange={saveImage}
                aria-label="사진 등록하기"
              />
            </label>
          </div>
        </div>

        <div className={styles.template__bottom}>
          <div className={styles.content}>
            <div className={styles.content__header}>
              <span className={styles.title}>내용</span>
              <span className={styles.content__counter}>{contentCounter}</span>
            </div>
            <textarea
              className={styles.content__input}
              placeholder="습득한 물건에 대한 설명을 적어주세요."
              value={localContent}
              onChange={(e) => handleContentChange(e.target.value)}
              onBlur={(e) => setContent(e.target.value)}
              maxLength={1000}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
