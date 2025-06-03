/* eslint-disable no-param-reassign */
import { NewClubData } from 'api/club/entity';
import { useNavigate } from 'react-router-dom';
import ROUTES from 'static/routes';
import showToast from 'utils/ts/showToast';
import useImageUpload from 'utils/hooks/ui/useImageUpload';
import { uploadClubFile } from 'api/uploadFile';
import UploadIcon from 'assets/svg/Club/add-image.svg';
import { Dispatch, SetStateAction, useState } from 'react';
import DropDownIcon from 'assets/svg/Club/dropdown-icon.svg';
import LikeIcon from 'assets/svg/Club/like-icon.svg';
import DisplayIcon from 'assets/svg/Club/display-icon.svg';
import UndisplayIcon from 'assets/svg/Club/undisplay-icon.svg';
import styles from './NewClubPCView.module.scss';

interface PCViewProps {
  formData: NewClubData;
  setFormData: Dispatch<SetStateAction<NewClubData>>;
  openModal: () => void;
  isEdit?: boolean;
}
export default function PCView({
  formData, setFormData, openModal, isEdit,
}: PCViewProps) {
  const navigate = useNavigate();
  const { imgRef, saveImgFile } = useImageUpload({ uploadFn: uploadClubFile });
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const saveImage = async () => {
    try {
      const images = await saveImgFile();
      if (images) {
        setFormData({ ...formData, image_url: images[0] });
      }
    } catch (error) {
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

  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <h1 className={styles.header__title}>동아리 생성</h1>
        <div className={styles['header__button-container']}>
          <button type="button" className={styles.header__button} onClick={() => navigate(ROUTES.Club())}>
            {!isEdit && '생성'}
            {' '}
            취소
          </button>
          <button type="button" className={styles.header__button} onClick={handleOpenModal}>
            {isEdit ? '저장' : '생성 요청'}
          </button>
        </div>
      </div>

      <div className={styles['form-container']}>
        <div className={styles['form-left']}>
          <div className={styles['form-name']}>
            <div className={styles['form-label__name']}>동아리명</div>
            <input
              className={styles['form__text-input']}
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="동아리명을 입력해주세요(필수)"
            />
          </div>
          <div className={styles['form-category']}>
            <div className={styles['form-label']}>분과</div>

            <div
              className={`${styles.dropdown} ${isDropDownOpen ? styles['dropdown--open'] : ''}`}
              role="listbox"
              tabIndex={0}
              onKeyDown={() => {
              }}
              onBlur={() => setIsDropDownOpen(false)}
            >
              <button
                type="button"
                className={styles.dropdown__trigger}
                onClick={() => setIsDropDownOpen(!isDropDownOpen)}
              >
                {categoryOptions.find((o) => o.value === formData.club_category_id)?.label}
                <span className={styles.dropdown__arrow}><DropDownIcon /></span>
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
              className={styles['form__text-input']}
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="동아리 방 위치를 입력하세요(필수)"
            />
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
              placeholder="인스타 계정 주소를 입력해주세요(선택)"
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
            <input
              className={styles['form__text-input']}
              type="text"
              value={formData.open_chat}
              onChange={(e) => setFormData({ ...formData, open_chat: e.target.value })}
              placeholder="오픈채팅 링크를 입력해주세요.(선택)"
            />
          </div>
          <div className={styles['form-contact']}>
            <div className={styles['form-label']}>전화번호:</div>
            <input
              className={styles['form__text-input']}
              type="text"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              placeholder="대표자 전화번호를 입력해주세요.(선택)"
            />
          </div>
        </div>

        <div className={styles['form-right']}>
          {formData.image_url ? (
            <div className={styles['form-image__preview']}>
              <img className={styles['form-image__img']} src={formData.image_url} alt="동아리 이미지 미리보기" />
            </div>
          )
            : (
              <div className={styles['form-image']}>
                <label
                  className={`${styles['form-image__label']} ${isDragOver ? styles['form-image__label--drag-over'] : ''}`}
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
                  </div>
                </label>
              </div>
            )}
          <button type="button" className={styles.like} onClick={handleClickLike}>
            <LikeIcon />
            좋아요 표시하기
            {formData.is_like_hidden ? <UndisplayIcon /> : <DisplayIcon />}
          </button>
        </div>
      </div>
    </div>
  );
}
