import PhotoIcon from 'assets/svg/Articles/photo.svg';
import RemoveImageIcon from 'assets/svg/Articles/remove-image.svg';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import { uploadLostItemFile } from 'api/uploadFile';
import useImageUpload from 'utils/hooks/ui/useImageUpload';
import showToast from 'utils/ts/showToast';
import styles from './FormImage.module.scss';

const MAX_IMAGES_LENGTH = 10;

interface FormImageProps {
  images: Array<string>;
  setImages: (images: Array<string>) => void;
  type: 'FOUND' | 'LOST';
  formIndex: number;
}

export default function FormImage({
  images, setImages, type, formIndex,
}: FormImageProps) {
  const isMobile = useMediaQuery();
  const { imgRef, saveImgFile } = useImageUpload({ uploadFn: uploadLostItemFile });

  const imageCounter = `${images.length}/${MAX_IMAGES_LENGTH}`;
  const inputId = `image-file-${formIndex}`;

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

  const uploadImage = type === 'FOUND' ? '습득물 사진을 업로드해주세요.' : '분실물 사진을 업로드해주세요.';

  return (
    <div className={styles.images}>
      <div className={styles.images__header}>
        <span className={styles.title}>사진</span>
        <div className={styles.images__text}>
          <span className={styles.title__description}>{uploadImage}</span>
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
      <label htmlFor={inputId} className={styles.images__upload}>
        <PhotoIcon />
        사진 등록하기
        <input
          type="file"
          ref={imgRef}
          accept="image/*"
          id={inputId}
          multiple
          onChange={saveImage}
          aria-label="사진 등록하기"
        />
      </label>
    </div>
  );
}
