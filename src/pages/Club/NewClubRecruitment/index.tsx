import { useState } from 'react';
import { ClubRecruitment } from 'api/club/entity';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { uploadClubFile } from 'api/uploadFile';
import { cn } from '@bcsdlab/utils';
import { formatKoreanDate } from 'utils/ts/calendar';
import showToast from 'utils/ts/showToast';
import useImageUpload from 'utils/hooks/ui/useImageUpload';
import DatePicker from 'components/ui/DatePicker';
import UploadIcon from 'assets/svg/Club/add-image.svg';
import ConfirmModal from './components/ConfirmModal';
import styles from './NewClubRecruitment.module.scss';

export default function NewClubRecruitment() {
  const [modalType, setModalType] = useState('');
  const [isModalOpen, openModal, closeModal] = useBooleanState(false);
  const [formData, setFormData] = useState<ClubRecruitment>({
    start_date: '',
    end_date: '',
    is_always_recruiting: false,
    image_url: '',
    content: '',
  });

  const [isDragOver, setIsDragOver] = useState(false);
  const [isAlwaysRecruiting,,,toggleIsAlwaysRecruiting] = useBooleanState(false);
  const { imgRef, saveImgFile } = useImageUpload({ uploadFn: uploadClubFile });
  const [isTried] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

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

  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.header__title}>모집 생성</h1>
          <div className={styles['header__button-container']}>
            <button type="button" className={styles.header__button} onClick={() => { setModalType('cancel'); openModal(); }}>
              생성 취소
            </button>
            <button type="button" className={styles.header__button} onClick={() => { setModalType('confirm'); openModal(); }}>
              생성 완료
            </button>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles['form-left']}>
            <div className={styles.form__item}>
              <div className={styles['form__item-title']}>
                <div className={styles.form__label}>모집기한</div>
                <div className={styles.form__input}>
                  <label htmlFor="period" className={styles.form__label}>
                    상시 모집
                  </label>
                  <input id="period" type="checkbox" checked={isAlwaysRecruiting} className={styles.form__checkbox} onChange={toggleIsAlwaysRecruiting} />
                </div>
              </div>
              { !isAlwaysRecruiting && (
              <div className={styles['form__item-title']}>
                <DatePicker
                  selectedDate={startDate}
                  onChange={setStartDate}
                  trigger={<button type="button" className={styles['date-picker-button']}>{formatKoreanDate(startDate)}</button>}
                />
                <p>~</p>
                <DatePicker
                  selectedDate={endDate}
                  onChange={setEndDate}
                  trigger={<button type="button" className={styles['date-picker-button']}>{formatKoreanDate(endDate)}</button>}
                />
              </div>
              )}
            </div>
            <div className={styles.form__item}>
              <div className={styles['form__item-title']}>
                <div className={styles.form__label}>상세 설명</div>
              </div>
              <textarea
                className={styles.form__textarea}
                placeholder="모집에 대한 자세한 설명을 작성해주세요."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>
          </div>
          <div>
            <div className={styles['form-image']}>
              <label
                className={cn(
                  {
                    [styles['form-image__label']]: true,
                    [styles['form-image__label--drag-over']]: isDragOver,
                    [styles['form-image__label--error']]: !formData.image_url && isTried,
                  },
                )}
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
                  <div>클릭하거나 사진을 드래그해</div>
                  <div>업로드 해주세요.</div>
                </div>
              </label>
            </div>
            <div className={styles['form-image__description']}>
              <p>4:5 비율로 업로드 해주세요.</p>
              <p>사진을 클릭하여 수정할 수 있습니다.</p>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
      <ConfirmModal
        closeModal={closeModal}
        type={modalType}
      />
      )}
    </div>
  );
}
