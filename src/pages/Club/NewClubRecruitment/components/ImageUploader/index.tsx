import { type Dispatch, type SetStateAction, useState } from 'react';
import { uploadClubFile } from 'api/uploadFile';
import { ClubRecruitment } from 'api/club/entity';
import { cn } from '@bcsdlab/utils';
import useImageUpload from 'utils/hooks/ui/useImageUpload';
import showToast from 'utils/ts/showToast';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import UploadIcon from 'assets/svg/Club/add-image.svg';
import styles from './ImageUploader.module.scss';

interface ClubImageUploaderProps {
  formData: ClubRecruitment;
  setFormData: Dispatch<SetStateAction<ClubRecruitment>>;
  isTried: boolean;
}

export default function ClubImageUploader({
  formData,
  setFormData,
  isTried,
}: ClubImageUploaderProps) {
  const isMobile = useMediaQuery();
  const [isDragOver, setIsDragOver] = useState(false);
  const { imgRef, saveImgFile } = useImageUpload({ uploadFn: uploadClubFile });

  const saveImage = async () => {
    try {
      const images = await saveImgFile();
      if (images) setFormData({ ...formData, image_url: images[0] });
    } catch {
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

    await saveImage();
  };

  if (formData.image_url) {
    return (
      <div className={styles['form-image__preview']}>
        <div className={styles['form-image__img__box']}>
          <img className={styles['form-image__img']} src={formData.image_url} alt="동아리 이미지 미리보기" />
        </div>
      </div>
    );
  }

  return (
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
        onDrop={handleDrop}
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
          {isMobile ? (
            <>
              <div>클릭하여 사진을</div>
              <div>업로드 해주세요.</div>
            </>
          ) : (
            <>
              <div>클릭하거나 사진을 드래그해</div>
              <div>업로드 해주세요.</div>
            </>
          )}
        </div>
      </label>
      <div className={styles['form-image__description']}>
        <p>4:5 비율로 업로드 해주세요.</p>
        <p>사진을 클릭하여 수정할 수 있습니다.</p>
      </div>
    </div>
  );
}
