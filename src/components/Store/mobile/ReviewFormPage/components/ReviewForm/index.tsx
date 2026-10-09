import type { ChangeEvent } from 'react';

import AddThumbnailIcon from 'assets/svg/store/add-thumbnail.svg';
import CloseIcon from 'assets/svg/store/close-icon.svg';
import EditableStarList from 'components/Store/mobile/ReviewFormPage/components/EditableStarList';
import type useReviewFormBase from 'components/Store/mobile/ReviewFormPage/hooks/useReviewFormBase';
import Button from 'components/ui/Button';

import styles from './ReviewForm.module.scss';

// KOIN_ORDER_WEBVIEW ReviewCreateForm·ReviewEditForm의 공통 본문. 값은 오라클 화면의 계산된 스타일을 옮겼다
interface ReviewFormProps {
  shopName: string;
  form: ReturnType<typeof useReviewFormBase>;
  imageUrls: string[];
  imgRef: React.RefObject<HTMLInputElement | null>;
  onChangeImage: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  submitLabel: string;
  onSubmit: () => void;
  // edit: 기존 사진(form.existingImageUrls)을 함께 보이고, 입력 상자 아래 여백·내용 줄 수가 오라클 ReviewEditForm을 따른다
  variant?: 'create' | 'edit';
}

export default function ReviewForm({
  shopName,
  form,
  imageUrls,
  imgRef,
  onChangeImage,
  onRemoveImage,
  submitLabel,
  onSubmit,
  variant = 'create',
}: ReviewFormProps) {
  const isEdit = variant === 'edit';
  const {
    content,
    setContent,
    rating,
    setRating,
    menus,
    menuInput,
    setMenuInput,
    textareaRef,
    menuTextareaRef,
    isFormValid,
    existingImageUrls,
    handleRemoveExistingImage,
    handleMenuKeyDown,
    handleMenuBlur,
    handleRemoveMenu,
  } = form;

  // 수정 화면은 기존 사진을 그대로 두므로 사진 수는 기존 + 새로 올린 사진이다
  const visibleExistingImageUrls = isEdit ? existingImageUrls : [];
  const imageCount = visibleExistingImageUrls.length + imageUrls.length;
  const inputBoxClassName = isEdit
    ? `${styles['form__input-box']} ${styles['form__input-box--edit']}`
    : styles['form__input-box'];

  return (
    <div className={styles.form}>
      <div className={styles.form__intro}>
        <span className={styles['form__shop-name']}>{shopName}</span>
        <span className={styles.form__notice}>
          리뷰를 남겨주시면 사장님과 다른 분들에게 도움이 됩니다.
          <br />
          또한, 악의적인 리뷰는 관리자에 의해 삭제될 수 있습니다.
        </span>
      </div>

      <div className={styles.form__rating}>
        <EditableStarList value={rating} onChange={setRating} size={40} />
        <span className={styles['form__rating-value']}>{rating}</span>
      </div>

      <div className={styles.form__divider} />

      <div className={styles['form__photo-title']}>
        <span>사진</span>
        <span className={styles.form__caption}>리뷰와 관련된 사진을 업로드해주세요.</span>
      </div>

      <div className={styles.form__photos}>
        <label className={styles['form__photo-upload']}>
          <AddThumbnailIcon className={styles['form__photo-upload-icon']} />
          <span className={styles['form__photo-count']}>{imageCount}/3</span>
          <input
            type="file"
            accept="image/*"
            multiple
            ref={imgRef}
            className={styles['form__photo-input']}
            onChange={onChangeImage}
            disabled={imageCount >= 3}
          />
        </label>

        {visibleExistingImageUrls.map((url, idx) => (
          <div key={url} className={styles.form__photo}>
            {/* eslint-disable-next-line @next/next/no-img-element -- 기존 리뷰 사진이라 크기가 제각각 */}
            <img src={url} alt={`existing-${idx}`} className={styles['form__photo-image']} />
            {/* 오라클처럼 이름 없는 버튼으로 둔다(별점 버튼과 같은 이름 없는 버튼 순서를 맞춘다) */}
            <button
              type="button"
              className={styles['form__photo-remove']}
              onClick={() => handleRemoveExistingImage(idx)}
            >
              <CloseIcon width={12} height={12} className={styles['form__photo-remove-icon']} />
            </button>
          </div>
        ))}

        {imageUrls.map((url, idx) => (
          <div key={isEdit ? `${url}-${idx}` : url} className={styles.form__photo}>
            {/* eslint-disable-next-line @next/next/no-img-element -- 업로드 이미지 미리보기라 크기가 제각각 */}
            <img src={url} alt={isEdit ? `new-${idx}` : `review-${idx}`} className={styles['form__photo-image']} />
            <button
              type="button"
              aria-label="사진 삭제"
              className={styles['form__photo-remove']}
              onClick={() => onRemoveImage(idx)}
            >
              <CloseIcon width={12} height={12} className={styles['form__photo-remove-icon']} />
            </button>
          </div>
        ))}
      </div>

      <div className={styles.form__section}>
        <div className={styles['form__section-header']}>
          <span className={styles['form__section-title']}>내용</span>
          <span className={styles.form__caption}>{content.length}/500</span>
        </div>
        <div className={inputBoxClassName}>
          {/* 수정 화면은 rows를 주지 않아 기본 2줄 높이에서 늘어난다(오라클 ReviewEditForm) */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="리뷰를 작성해주세요"
            className={styles.form__textarea}
            rows={isEdit ? undefined : 1}
            maxLength={isEdit ? 500 : undefined}
          />
        </div>
      </div>

      <div className={styles.form__menu}>
        <div className={styles['form__menu-header']}>
          <span className={styles['form__section-title']}>주문메뉴</span>

          <div className={styles['form__menu-caption-row']}>
            <span className={styles.form__caption}>입력한 메뉴가 태그로 추가돼요</span>
            {menus.length > 0 && <span className={styles.form__caption}>{menus.length}/5</span>}
          </div>

          {menus.length > 0 && (
            <div className={styles['form__menu-tags']}>
              {menus.map((menu, idx) => (
                <div key={menu} className={styles['form__menu-tag']}>
                  <span>{menu}</span>
                  <CloseIcon
                    width={12}
                    height={12}
                    className={styles['form__menu-tag-remove']}
                    onClick={() => handleRemoveMenu(idx)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={inputBoxClassName}>
          <textarea
            ref={menuTextareaRef}
            value={menuInput}
            onChange={(e) => setMenuInput(e.target.value)}
            onKeyDown={handleMenuKeyDown}
            onBlur={handleMenuBlur}
            placeholder="메뉴명을 입력해주세요"
            className={`${styles.form__textarea} ${styles['form__textarea--menu']}`}
            rows={1}
          />
        </div>
      </div>

      <Button
        fullWidth
        color="primary"
        onClick={onSubmit}
        state={isFormValid ? 'default' : 'disabled'}
        className={styles.form__submit}
      >
        {submitLabel}
      </Button>
    </div>
  );
}
