/* eslint-disable no-param-reassign */
/* MobileView.tsx */
import { NewClubData } from 'api/club/entity';
import { useNavigate } from 'react-router-dom';
import ROUTES from 'static/routes';
import showToast from 'utils/ts/showToast';
import useImageUpload from 'utils/hooks/ui/useImageUpload';
import { uploadClubFile } from 'api/uploadFile';
import UploadIcon from 'assets/svg/Club/add-image.svg';
import DropDownIcon from 'assets/svg/Club/dropdown-icon.svg';
import DisplayIcon from 'assets/svg/Club/display-icon.svg';
import UndisplayIcon from 'assets/svg/Club/undisplay-icon.svg';
import LikeIcon from 'assets/svg/Club/like-icon.svg';
import { Dispatch, SetStateAction, useState } from 'react';
import ClubInputErrorCondition from 'pages/Club/components/ClubInputErrorCondition';
import { cn } from '@bcsdlab/utils';
import useLogger from 'utils/hooks/analytics/useLogger';
import { addHyphen } from 'utils/ts/formatPhoneNumber';
import styles from './NewClubMobileView.module.scss';

interface MobileViewProps {
  formData: NewClubData;
  setFormData: Dispatch<SetStateAction<NewClubData>>;
  setType?:Dispatch<SetStateAction<string>>;
  openModal: () => void;
  isEdit?: boolean
}

export default function MobileView({
  formData,
  setFormData,
  openModal,
  isEdit,
  setType,
}: MobileViewProps) {
  const navigate = useNavigate();
  const logger = useLogger();
  const { imgRef, saveImgFile } = useImageUpload({ uploadFn: uploadClubFile });
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isTried, setIsTried] = useState(false);

  const categoryOptions = [
    { value: 1, label: '학술 분과' },
    { value: 2, label: '운동 분과' },
    { value: 3, label: '취미 분과' },
    { value: 4, label: '종교 분과' },
    { value: 5, label: '공연 분과' },
  ];

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };

  const saveImage = async () => {
    try {
      const images = await saveImgFile();
      if (images) setFormData({ ...formData, image_url: images[0] });
    } catch {
      showToast('error', '이미지 업로드에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleOpenModal = () => {
    if (!formData.name || !formData.location || !formData.image_url) {
      showToast('error', '동아리명, 위치, 이미지는 필수 입력 사항입니다.');
      return;
    }
    openModal();
  };

  const handleClickLike = () => {
    setFormData((prev) => ({
      ...prev,
      is_like_hidden: !prev.is_like_hidden,
    }));
  };

  const handleClickCancel = () => {
    if (isEdit && setType) {
      logger.actionEventClick({
        team: 'CAMPUS',
        event_category: 'click',
        event_label: 'club_correction_cancel',
        value: '취소',
      });
      setType('cancel');
      openModal();
    } else {
      logger.actionEventClick({
        team: 'CAMPUS',
        event_category: 'click',
        event_label: 'club_create_cancel',
        value: '생성취소',
      });
      navigate(ROUTES.Club());
    }
  };

  const handleClickSave = () => {
    if (isEdit && setType) {
      logger.actionEventClick({
        team: 'CAMPUS',
        event_category: 'click',
        event_label: 'club_correction_save',
        value: '저장',
      });
      setType('confirm');
    } else {
      logger.actionEventClick({
        team: 'CAMPUS',
        event_category: 'click',
        event_label: 'club_create_request',
        value: '생성요청',
      });
    }
    setIsTried(true);
    handleOpenModal();
  };

  return (
    <div className={styles.layout}>
      <div className={styles['form-container']}>
        {formData.image_url ? (
          <div className={styles['form-image__preview']}>
            <img
              className={styles['form-image__img']}
              src={formData.image_url}
              alt="동아리 이미지 미리보기"
            />
          </div>
        ) : (
          <div className={styles['form-image']}>
            <label
              className={cn({
                [styles['form-image__label']]: true,
                [styles['form-image__label--error']]: !formData.image_url && isTried,
              })}
              htmlFor="club-image-upload"
              aria-label="동아리 이미지 업로드"
            >
              <input
                id="club-image-upload"
                className={styles['form-image__input']}
                type="file"
                ref={imgRef}
                accept="image/*"
                multiple
                onChange={saveImage}
              />
              <UploadIcon />
              <div className={styles['form-image__label-text']}>
                <div>클릭하여 사진을</div>
                <div>업로드해주세요.</div>
                <br />
                <div>1:1 비율로 업로드 해주세요</div>
              </div>
            </label>
            {!formData.image_url && isTried && <ClubInputErrorCondition />}
          </div>
        )}
        <div className={styles['button-group__top']}>
          <button
            type="button"
            className={styles['button-group__top__button']}
            onClick={handleClickCancel}
          >
            {!isEdit && '생성'}
            {' '}
            취소
          </button>
          <button
            type="button"
            className={styles['button-group__top__button']}
            onClick={handleClickSave}
          >
            {isEdit ? '저장' : '생성 요청'}
          </button>
        </div>
        <div className={styles['form-name']}>
          <div className={styles['name-header']}>
            <div className={styles['form-label__name']}>
              동아리명
            </div>
            <button type="button" className={styles.like} onClick={handleClickLike}>
              <LikeIcon />
              좋아요 표시하기
              {formData.is_like_hidden ? <UndisplayIcon /> : <DisplayIcon />}
            </button>
          </div>
          <input
            className={cn({
              [styles['form__text-input']]: true,
              [styles['form__text-input--error']]: (formData.name.length === 0 && isTried),
            })}
            value={formData.name}
            placeholder="동아리명을 입력해주세요(필수)"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        {!formData.name && isTried && <ClubInputErrorCondition />}
        <div className={styles['form-category']}>
          <div className={styles['form-label']}>분과:</div>
          <div
            className={`${styles.dropdown} ${
              isDropDownOpen ? styles['dropdown--open'] : ''
            }`}
            role="listbox"
            tabIndex={0}
            onBlur={() => setIsDropDownOpen(false)}
          >
            <button
              type="button"
              className={`${styles.dropdown__trigger} ${
                isDropDownOpen ? styles['dropdown__trigger--active'] : ''
              }`}
              onClick={() => setIsDropDownOpen(!isDropDownOpen)}
            >
              {
                  categoryOptions.find(
                    (o) => o.value === formData.club_category_id,
                  )?.label
                }
              <span className={styles.dropdown__arrow}>
                <DropDownIcon />
              </span>
            </button>

            <ul className={styles.dropdown__menu}>
              {categoryOptions.map((o) => (
                <li
                  key={o.value}
                  role="option"
                  aria-selected={o.value === formData.club_category_id}
                  className={`${styles.dropdown__option} ${
                    o.value === formData.club_category_id
                      ? styles['dropdown__option--selected']
                      : ''
                  }`}
                  onMouseDown={() => {
                    setFormData({ ...formData, club_category_id: o.value });
                    setIsDropDownOpen(false);
                  }}
                >
                  {o.label}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles['form-category__description']}>(필수)</div>
        </div>
        <div className={styles['form-location']}>
          <div className={styles['form-label']}>동아리 방 위치:</div>
          <input
            className={cn({
              [styles['form__text-input']]: true,
              [styles['form__text-input--error']]: (formData.location.length === 0) && isTried,
            })}
            value={formData.location}
            placeholder="동아리 방 위치를 입력하세요(필수)"
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>
        {!formData.location && isTried && <ClubInputErrorCondition />}
        <div className={styles['form-description']}>
          <div className={styles['form-label']}>동아리 소개:</div>
          <textarea
            className={styles.form__textarea}
            rows={1}
            placeholder="동아리 소개를 입력해주세요(선택)"
            value={formData.description}
            onChange={(e) => {
              autoResize(e.currentTarget);
              setFormData({ ...formData, description: e.target.value });
            }}
            onInput={(e) => autoResize(e.currentTarget)}
          />
        </div>
        <div className={styles['form-contact']}>
          <div className={styles['form-label']}>인스타:</div>
          <input
            className={styles['form__text-input']}
            value={formData.instagram}
            placeholder="인스타 아이디를 입력해주세요.(선택)"
            onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
          />
        </div>
        <div className={styles['form-contact']}>
          <div className={styles['form-label']}>구글 폼:</div>
          <input
            className={styles['form__text-input']}
            value={formData.google_form}
            placeholder="구글폼 링크를 입력해주세요.(선택)"
            onChange={(e) => setFormData({ ...formData, google_form: e.target.value })}
          />
        </div>
        <div className={styles['form-contact']}>
          <div className={styles['form-label']}>오픈 채팅:</div>
          <input
            className={styles['form__text-input']}
            value={formData.open_chat}
            placeholder="오픈채팅 링크를 입력해주세요.(선택)"
            onChange={(e) => setFormData({ ...formData, open_chat: e.target.value })}
          />
        </div>
        <div className={styles['form-contact']}>
          <div className={styles['form-label']}>전화번호:</div>
          <div className={styles['form-contact__wrapper']}>
            <input
              className={cn({
                [styles['form__text-input']]: true,
                [styles['form__text-input--error']]: !formData.phone_number && isTried,
              })}
              value={formData.phone_number}
              placeholder="대표자 전화번호를 입력해주세요.(필수)"
              onChange={(e) => setFormData((prev) => ({
                ...prev,
                phone_number: addHyphen(e.target.value),
              }))}
            />
            {!formData.phone_number && isTried && (
              <div className={styles['error-container']}>
                <ClubInputErrorCondition />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
