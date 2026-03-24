import React, { useRef } from 'react';
import ImageUploadIcon from 'assets/svg/Callvan/image-upload.svg';
import styles from './ReportPage.module.scss';

const MAX_DESCRIPTION_LENGTH = 1000;
const MAX_IMAGES = 10;

interface DetailStepProps {
  description: string;
  images: File[];
  onDescriptionChange: (text: string) => void;
  onImagesChange: (images: File[]) => void;
}

export default function DetailStep({ description, images, onDescriptionChange, onImagesChange }: DetailStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) return;
    const newImages = [...images, ...files.slice(0, remaining)];
    onImagesChange(newImages);
    e.target.value = '';
  };

  const handleDelete = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className={styles['detail-step__section']}>
        <div className={styles['detail-step__section-header']}>
          <h2 className={styles['detail-step__section-heading']}>신고 상황을 입력해주세요.</h2>
          <span className={styles['detail-step__char-count']}>
            {description.length}/{MAX_DESCRIPTION_LENGTH}
          </span>
        </div>
        <textarea
          className={styles['detail-step__textarea']}
          placeholder="신고 상황을 확인하기 위해 자세히 작성해주세요."
          value={description}
          maxLength={MAX_DESCRIPTION_LENGTH}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </div>

      <div className={styles['detail-step__divider']} />

      <div className={styles['detail-step__section']}>
        <h2 className={styles['detail-step__image-heading']}>증빙자료 첨부</h2>
        <p className={styles['detail-step__image-description']}>
          신고 상황에 대한 채팅내역 등 증빙자료로 사용할 이미지를 첨부해주세요.
        </p>
        <p className={styles['detail-step__image-count']}>
          {images.length}/{MAX_IMAGES}
        </p>
        <div className={styles['detail-step__image-box']}>
          <div className={styles['detail-step__image-slider']}>
            {images.map((file, index) => (
              <div key={index} className={styles['image-item']}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(file)}
                  alt={`첨부 이미지 ${index + 1}`}
                  className={styles['image-item__thumbnail']}
                />
                <button
                  type="button"
                  className={styles['image-item__delete']}
                  onClick={() => handleDelete(index)}
                  aria-label={`이미지 ${index + 1} 삭제`}
                />
              </div>
            ))}
          </div>
          {images.length < MAX_IMAGES && (
            <button
              type="button"
              className={styles['detail-step__image-btn']}
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageUploadIcon />
              <span>{images.length === 0 ? '사진 등록하기' : '사진 추가하기'}</span>
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
