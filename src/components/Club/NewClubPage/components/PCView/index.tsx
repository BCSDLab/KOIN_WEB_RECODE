import { Dispatch, SetStateAction, useState } from 'react';
import { useRouter } from 'next/router';
import { cn } from '@bcsdlab/utils';
import { NewClubData } from 'api/club/entity';
import { uploadClubFile } from 'api/uploadFile';
import UploadIcon from 'assets/svg/Club/add-image.svg';
import DisplayIcon from 'assets/svg/Club/display-icon.svg';
import DropDownIcon from 'assets/svg/Club/dropdown-icon.svg';
import LikeIcon from 'assets/svg/Club/like-icon.svg';
import UndisplayIcon from 'assets/svg/Club/undisplay-icon.svg';
import ClubInputErrorCondition from 'components/Club/components/ClubInputErrorCondition';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useImageUpload from 'utils/hooks/ui/useImageUpload';
import { addHyphen } from 'utils/ts/formatPhoneNumber';
import showToast from 'utils/ts/showToast';
import styles from './NewClubPCView.module.scss';

interface PCViewProps {
  formData: NewClubData;
  setFormData: Dispatch<SetStateAction<NewClubData>>;
  setType?: Dispatch<SetStateAction<string>>;
  openModal: () => void;
  isEdit?: boolean;
}
export default function PCView({ formData, setFormData, openModal, isEdit, setType }: PCViewProps) {
  const router = useRouter();
  const navigate = router.push;
  const logger = useLogger();
  const { imgRef, saveImgFile } = useImageUpload({ uploadFn: uploadClubFile });
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isTried, setIsTried] = useState(false);
  const saveImage = async () => {
    try {
      const images = await saveImgFile();
      if (images) {
        setFormData({ ...formData, image_url: images[0] });
      }
    } catch {
      showToast('error', '이미지 업로드에 실패했습니다. 다시 시도해주세요.');
    }
  };
  const categoryOptions = [
    { value: 1, label: '학술 분과' },
    { value: 2, label: '운동 분과' },
    { value: 3, label: '취미 분과' },
    { value: 4, label: '종교 분과' },
    { value: 5, label: '공연 분과' },
  ];

  const autoResize = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  const handleDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) return;

    if (imgRef.current) {
      const dataTransfer = new DataTransfer();
      files.forEach((file) => dataTransfer.items.add(file));
      imgRef.current.files = dataTransfer.files;
    }

    try {
      const images = await saveImgFile();
      if (images) {
        setFormData({ ...formData, image_url: images[0] });
      }
    } catch {
      showToast('error', '이미지 업로드에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleOpenModal = () => {
    if (!formData.name || !formData.location || !formData.image_url || !formData.phone_number) {
      showToast('error', '동아리명, 위치, 대표자 연락처, 이미지는 필수 입력 사항입니다.');
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
        event_label: 'club_correction_cancel',
        value: '취소',
      });
      setType('cancel');
      openModal();
    } else {
      logger.actionEventClick({
        team: 'CAMPUS',
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
        event_label: 'club_correction_save',
        value: '저장',
      });
      setType('confirm');
    } else {
      logger.actionEventClick({
        team: 'CAMPUS',
        event_label: 'club_create_request',
        value: '생성요청',
      });
    }
    setIsTried(true);
    handleOpenModal();
  };

  const handleEditClickEditButton = () => {
    // 일단 드래그 선택을 위해서 기존 이미지 제거만
    setFormData({ ...formData, image_url: '' });
  };

  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <h1 className={styles.header__title}>
          동아리
          {isEdit ? ' 수정' : ' 생성'}
        </h1>
        <div className={styles['header__button-container']}>
          <button type="button" className={styles.header__button} onClick={handleClickCancel}>
            {!isEdit && '생성'} 취소
          </button>
          <button type="button" className={styles.header__button} onClick={handleClickSave}>
            {isEdit ? '저장' : '생성 요청'}
          </button>
        </div>
      </div>

      <div className={styles['form-container']}>
        <div className={styles['form-left']}>
          <div className={styles['form-name']}>
            <div className={styles['form-label__name']}>동아리명</div>
            <input
              className={cn({
                [styles['form__text-input']]: true,
                [styles['form__text-input--error']]: formData.name.length === 0 && isTried,
              })}
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="동아리명을 입력해주세요(필수)"
            />
            {!formData.name && isTried && <ClubInputErrorCondition />}
          </div>
          <div className={styles['form-category']}>
            <div className={styles['form-label']}>분과</div>

            <div
              className={`${styles.dropdown} ${isDropDownOpen ? styles['dropdown--open'] : ''}`}
              role="listbox"
              tabIndex={0}
              onKeyDown={() => {}}
              onBlur={() => setIsDropDownOpen(false)}
            >
              <button
                type="button"
                className={styles.dropdown__trigger}
                onClick={() => setIsDropDownOpen(!isDropDownOpen)}
              >
                {categoryOptions.find((o) => o.value === formData.club_category_id)?.label}
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
                      o.value === formData.club_category_id ? styles['dropdown__option--selected'] : ''
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
                [styles['form__text-input--error']]: formData.location.length === 0 && isTried,
              })}
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="동아리 방 위치를 입력하세요(필수)"
              maxLength={20}
            />
            {!formData.location && isTried && <ClubInputErrorCondition />}
          </div>

          <div className={styles['form-description']}>
            <div className={styles['form-label']}>동아리 소개:</div>
            <textarea
              className={styles.form__textarea}
              value={formData.description}
              rows={1}
              placeholder="동아리 소개를 입력해주세요(선택)"
              onChange={(e) => {
                autoResize(e.currentTarget);
                setFormData({ ...formData, description: e.target.value });
              }}
              maxLength={40}
              onInput={(e) => autoResize(e.currentTarget)}
            />
          </div>
          <div className={styles['form-contact']}>
            <div className={styles['form-label']}>인스타:</div>
            <input
              className={styles['form__text-input']}
              type="text"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              placeholder="인스타 아이디를 입력해주세요(선택)"
            />
          </div>
          <div className={styles['form-contact']}>
            <div className={styles['form-label']}>구글 폼:</div>
            <input
              className={styles['form__text-input']}
              type="text"
              value={formData.google_form}
              onChange={(e) => setFormData({ ...formData, google_form: e.target.value })}
              placeholder="구글폼 링크를 입력해주세요.(선택)"
            />
          </div>
          <div className={styles['form-contact']}>
            <div className={styles['form-label']}>오픈 채팅:</div>
            <div className={styles['form-url__input-wrapper']}>
              <span className={styles['form-url__prefix']}>https://</span>
              <input
                className={styles['form-url__input']}
                type="text"
                value={formData.open_chat}
                placeholder="open.kakao.com/o/abcd1234"
                onChange={(e) => {
                  const { value } = e.target;
                  if (/^https?:\/\//.test(value)) {
                    showToast('error', '"https://"는 자동으로 포함되어 있습니다.');
                    return;
                  }
                  setFormData({ ...formData, open_chat: value });
                }}
              />
            </div>
          </div>

          <div className={styles['form-contact']}>
            <div className={styles['form-label']}>전화번호:</div>
            <div className={styles['form-contact__wrapper']}>
              <input
                className={cn({
                  [styles['form__text-input']]: true,
                  [styles['form__text-input--error']]: !formData.phone_number && isTried,
                })}
                type="text"
                value={formData.phone_number}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    phone_number: addHyphen(e.target.value),
                  }))
                }
                placeholder="대표자 전화번호를 입력해주세요.(필수)"
              />
              {!formData.phone_number && isTried && (
                <div className={styles['error-container']}>
                  <ClubInputErrorCondition />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles['form-right']}>
          {formData.image_url ? (
            <div className={styles['form-image__preview']}>
              {isEdit && (
                <div className={styles['form-image__edit-button__box']}>
                  <button
                    type="button"
                    className={styles['form-image__edit-button']}
                    onClick={handleEditClickEditButton}
                  >
                    이미지 변경
                  </button>
                </div>
              )}
              <div className={styles['form-image__img__box']}>
                <img className={styles['form-image__img']} src={formData.image_url} alt="동아리 이미지 미리보기" />
              </div>
            </div>
          ) : (
            <div className={styles['form-image']}>
              <label
                className={cn({
                  [styles['form-image__label']]: true,
                  [styles['form-image__label--drag-over']]: isDragOver,
                  [styles['form-image__label--error']]: !formData.image_url && isTried,
                })}
                htmlFor="club-image-upload"
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragEnter={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragOver(false);
                  handleDrop(e);
                }}
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
                  aria-label="동아리 이미지 업로드"
                />
                <UploadIcon />
                <div className={styles['form-image__label-text']}>
                  <div>클릭하거나</div>
                  <div>사진을 드래그해</div>
                  <div>업로드해주세요</div>
                  <br />
                  <div>1:1 비율로 업로드 해주세요</div>
                </div>
              </label>
            </div>
          )}
          {!formData.image_url && isTried && <ClubInputErrorCondition />}
          <button type="button" className={styles.like} onClick={handleClickLike}>
            <LikeIcon />
            {formData.is_like_hidden ? '좋아요 숨기기' : '좋아요 표시하기'}
            {formData.is_like_hidden ? <UndisplayIcon /> : <DisplayIcon />}
          </button>
        </div>
      </div>
    </div>
  );
}
