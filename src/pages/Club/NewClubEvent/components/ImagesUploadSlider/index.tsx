import { useEffect, useState } from 'react';
import { uploadClubFile } from 'api/uploadFile';
import { cn } from '@bcsdlab/utils';
import showToast from 'utils/ts/showToast';
import resizeImageFile from 'utils/ts/imageResize';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useImageUpload from 'utils/hooks/ui/useImageUpload';
import ArrowIcon from 'assets/svg/previous-arrow-icon.svg';
import UploadIcon from 'assets/svg/Club/add-image.svg';
import styles from './ImagesUploadSlider.module.scss';

interface ClubImageUploaderProps {
  imageUrls: string[];
  addImageUrls: (newImageUrls: string[]) => void;
}

export default function ImagesUploadSlider({
  imageUrls,
  addImageUrls,
}: ClubImageUploaderProps) {
  const isMobile = useMediaQuery();
  const [isDragOver, setIsDragOver] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const { imgRef, saveImgFile, setImageFile } = useImageUpload({
    uploadFn: uploadClubFile,
    maxLength: 7,
    resize: (file) => resizeImageFile(file),
  });

  const saveImage = async () => {
    try {
      const images = await saveImgFile();
      if (images) {
        const uniqueImages = images.filter((url) => !imageUrls.includes(url));
        const nextImages = [...imageUrls, ...uniqueImages];
        addImageUrls(nextImages);
        setCurrentIdx(nextImages.length - 1);
      }

      if (imgRef.current) imgRef.current.value = '';
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

  const handleDelete = (index: number) => {
    const nextImages = imageUrls.filter((_, i) => i !== index);
    addImageUrls(nextImages);
    setCurrentIdx((prev) => Math.max(0, Math.min(prev, nextImages.length)));
  };

  const goPrev = () => setCurrentIdx((prev) => (prev === 0 ? imageUrls.length : prev - 1));
  const goNext = () => setCurrentIdx((prev) => (prev === imageUrls.length ? 0 : prev + 1));
  const slideCounter = `${currentIdx + 1}/${imageUrls.length + 1}`;

  useEffect(() => {
    setImageFile(imageUrls);
  }, [imageUrls, setImageFile]);

  return (
    <div>
      <div className={styles['form-image__preview']}>
        <div className={styles.slider}>
          <span className={styles.slider__counter}>{slideCounter}</span>

          <button
            type="button"
            className={cn({
              [styles.slider__arrow]: true,
              [styles['slider__arrow--left']]: true,
            })}
            onClick={goPrev}
            aria-label="이전 이미지"
          >
            <ArrowIcon />
          </button>

          {currentIdx === imageUrls.length ? (
            <label
              className={cn({
                [styles['form-image__label']]: true,
                [styles['form-image__label--drag-over']]: isDragOver,
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
          ) : (
            <div className={styles['form-image__img__box']}>
              <button
                type="button"
                onClick={() => handleDelete(currentIdx)}
                className={styles['form-image__img__button']}
                aria-label="이미지 삭제"
              >
                <img
                  className={styles['form-image__img']}
                  src={imageUrls[currentIdx]}
                  alt={`동아리 이미지 미리보기 ${currentIdx + 1}`}
                />
              </button>
            </div>
          )}
          <button
            type="button"
            className={cn({
              [styles.slider__arrow]: true,
              [styles['slider__arrow--right']]: true,
            })}
            onClick={goNext}
            aria-label="다음 이미지"
          >
            <ArrowIcon />
          </button>
        </div>
      </div>

      <div className={styles['form-image__description']}>
        <p>5:4 비율로 업로드 해주세요.</p>
        <p>사진을 클릭하여 수정/삭제할 수 있습니다.</p>
      </div>
    </div>
  );
}
