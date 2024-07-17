import useStoreDetail from 'pages/Store/StoreDetailPage/hooks/useStoreDetail';
import { ReactComponent as StarIcon } from 'assets/svg/empty-star.svg';
import { ReactComponent as AddImageIcon } from 'assets/svg/add-image.svg';
import { ReactComponent as DeleteMenuIcon } from 'assets/svg/trash-can-icon.svg';
import { ReactComponent as DeleteImageIcon } from 'assets/svg/delete-icon.svg';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { cn } from '@bcsdlab/utils';
import uuidv4 from 'utils/ts/uuidGenerater';
import styles from './StoreReviewPage.module.scss';

function StoreReviewPage() {
  const params = useParams();
  const { storeDetail } = useStoreDetail(params.id!);
  const [rate, setRate] = useState(0);
  const [imageList, setImageList] = useState<string[]>([]);
  const [menuList, setMenuList] = useState<{ id: string, name: string }[]>([]);

  const handleRate = (num: number) => {
    if (num === rate) {
      setRate(0);
    } else {
      setRate(num);
    }
  };

  const addMenu = () => {
    setMenuList([...menuList, { id: uuidv4(), name: '' }]);
  };

  const deleteMenu = (id: string) => {
    setMenuList(menuList.filter((menu) => menu.id !== id));
  };

  const handleMenuChange = (e:React.ChangeEvent<HTMLInputElement>, id: string) => {
    const newMenuList = menuList.map((menu) => (
      menu.id === id ? { ...menu, name: e.target.value } : menu));

    setMenuList(newMenuList);
  };

  const addImage = (e:React.ChangeEvent<HTMLInputElement>) => {
    const uploadImages = e.target.files!;
    const newImageList = [...imageList];
    for (let i = 0; i < uploadImages.length; i += 1) {
      const currentImageUrl = URL.createObjectURL(uploadImages[i]);
      newImageList.push(currentImageUrl);
    }

    setImageList(newImageList);
  };

  const deleteImage = (url: string) => {
    setImageList(imageList.filter((image) => image !== url));
  };

  return (
    <form className={styles.form}>
      <div className={styles.form__name}>
        <div>
          {storeDetail?.name}
        </div>
        <div>
          리뷰를 남겨주시면 사자님과 다른 분들에게 도움이 됩니다.
          <br />
          또한, 악의적인 리뷰는 관리자에 의해 삭제될 수 있습니다.
        </div>
      </div>
      <div className={styles.form__rate}>
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => handleRate(num)}
            aria-label="별점 주기"
          >
            <StarIcon
              key={num}
              fill={rate >= num ? '#FFC62B' : '#CACACA'}
            />
          </button>
        ))}
        {rate}
      </div>
      <div className={styles.form__description}>더 많은 정보를 작성해 보세요!</div>
      <div className={styles.template}>
        <div className={styles.template__title}>
          <span>사진</span>
          <span>
            {imageList.length}
            /3
          </span>
        </div>
        <div className={styles.template__description}>리뷰와 관련된 사진을 업로드해주세요.</div>
        <ul className={styles.template__images}>
          {imageList.map((url) => (
            <li key={url}>
              <img src={url} alt="리뷰 이미지" />
              <button
                type="button"
                aria-label="이미지 삭제"
                onClick={() => deleteImage(url)}
              >
                <DeleteImageIcon />
              </button>
            </li>
          ))}
        </ul>
        <label htmlFor="image-file" className={styles['template__upload-image']}>
          사진 등록하기
          <AddImageIcon />
          <input type="file" id="image-file" multiple onChange={addImage} />
        </label>
      </div>
      <div className={styles.template}>
        <div className={styles.template__title}>
          <span>내용</span>
          <span>0/500</span>
        </div>
        <textarea className={styles.template__textarea} />
      </div>
      <div className={styles.template}>
        <div className={styles.template__title}>메뉴</div>
        <button type="button" className={styles.template__button} onClick={addMenu}>메뉴 추가하기</button>
        <ul className={styles.template__list}>
          {menuList.map((menu) => (
            <li key={menu.id}>
              <input
                type="text"
                placeholder="메뉴를 직접 입력해주세요."
                value={menu.name}
                onChange={(e) => handleMenuChange(e, menu.id)}
              />
              <button
                type="button"
                aria-label="메뉴 삭제"
                onClick={() => deleteMenu(menu.id)}
              >
                <DeleteMenuIcon />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <button
        type="submit"
        disabled={rate === 0}
        className={cn({
          [styles.form__button]: true,
          [styles['form__button--active']]: rate !== 0,
        })}
      >
        작성하기
      </button>
    </form>
  );
}

export default StoreReviewPage;
