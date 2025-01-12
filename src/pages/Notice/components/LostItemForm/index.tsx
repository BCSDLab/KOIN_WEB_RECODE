import useImageUpload from 'utils/hooks/ui/useImageUpload';
import RemoveImageIcon from 'assets/svg/Notice/remove-image.svg';
import PhotoIcon from 'assets/svg/Notice/photo.svg';
import { LostItem, LostItemHandler } from 'pages/Notice/hooks/useLostItemForm';
import styles from './LostItemForm.module.scss';

const MAX_LOST_ITEM_IMAGE_COUNT = 10;

const MAX_LOST_ITEM_TYPE = {
  found: '습득물',
  lost: '분실물',
};

interface LostItemFromProps {
  type: 'found' | 'lost';
  count: number;
  lostItem: LostItem;
  lostItemHandler: LostItemHandler;
}

export default function LostItemForm({
  type, count, lostItem, lostItemHandler
}: LostItemFromProps) {
  const { category, foundDate, location, content, image } = lostItem;
  const { setCategory, setFoundDate, setLocation, setContent, setImage } = lostItemHandler;
  const {
    imageFile, imgRef, saveImgFile, setImageFile,
  } = useImageUpload(MAX_LOST_ITEM_IMAGE_COUNT);

  const deleteImage = (url: string) => {
    setImageFile(imageFile.filter((image: string) => image !== url));
  };

  return (
    <div className={styles.container}>
      <span className={styles.tag}>
        {MAX_LOST_ITEM_TYPE[type]}
        &nbsp;
        {count + 1}
      </span>
      <div className={styles.template}>
        <div className={`${styles.template__left} ${styles.left}`}>
          <div className={styles.category}>
            <div className={styles.category__text}>
              <span className={styles.title}>품목</span>
              <span className={styles.title__description}>품목을 선택해주세요.</span>
            </div>
            {category}
          </div>
          <div className={styles.date}>
            <span className={styles.title}>습득 일자</span>
            {foundDate}
          </div>
          <div className={styles.location}>
            <span className={styles.title}>습득 장소</span>
            {location}
          </div>
        </div>

        <div className={`${styles.template__right} ${styles.right}`}>
          <div className={styles.image}>
            <div className={styles.image__text}>
              <span className={styles.title}>사진</span>
              <span className={styles.title__description}>습득물 사진을 업로드해주세요.</span>
            </div>
            <ul className={styles.image__list}>
              {imageFile.map((url: string) => (
                <li key={url}>
                  <img src={url} alt="분실물 이미지" />
                  <button
                    type="button"
                    aria-label="이미지 삭제"
                    onClick={() => deleteImage(url)}
                  >
                    <RemoveImageIcon />
                  </button>
                </li>
              ))}
            </ul>
            <label htmlFor="image-file" className={styles.image__upload}>
              <PhotoIcon />
              사진 등록하기
              <input
                type="file"
                ref={imgRef}
                accept="image/*"
                id="image-file"
                multiple
                onChange={saveImgFile}
              />
            </label>
          </div>
        </div>

        <div className={styles.template__bottom}>
          <span className={styles.title}>내용</span>
          <textarea
            placeholder="습득한 물건에 대한 설명을 적어주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
