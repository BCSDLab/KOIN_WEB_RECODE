import { useLocation, useNavigate } from 'react-router-dom';
import StarIcon from 'assets/svg/empty-star.svg';
import DeleteMenuIcon from 'assets/svg/trash-can-icon.svg';
import DeleteImageIcon from 'assets/svg/delete-icon.svg';
import { useEffect, useState } from 'react';
import { cn } from '@bcsdlab/utils';
import uuidv4 from 'utils/ts/uuidGenerater';
import useImageUpload from 'utils/hooks/ui/useImageUpload';
import { StoreDetailResponse } from 'api/store/entity';
import { UseMutateFunction } from '@tanstack/react-query';
import { ReviewRequest } from 'api/review/entity';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import useLogger from 'utils/hooks/analytics/useLogger';
import ROUTES from 'static/routes';
import { uploadShopFile } from 'api/uploadFile';
import styles from './ReviewForm.module.scss';

const MAX_IMAGE_LENGTH = 3;

interface Props {
  storeDetail: StoreDetailResponse;
  mutate: UseMutateFunction<ReviewRequest, unknown, ReviewRequest, unknown>;
  initialData: Partial<ReviewRequest>;
}

function ReviewForm({ storeDetail, mutate, initialData = {} }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const logger = useLogger();

  useScrollToTop();

  const [rate, setRate] = useState(initialData.rating || 0);

  const [reviewText, setReviewText] = useState(initialData?.content ?? '');
  const [menuList, setMenuList] = useState<{ id: string, name: string }[]>(
    initialData.menu_names ? initialData.menu_names.map((name) => ({ id: uuidv4(), name })) : [],
  );

  const {
    imageFile, imgRef, saveImgFile, setImageFile,
  } = useImageUpload({
    maxLength: MAX_IMAGE_LENGTH,
    uploadFn: uploadShopFile,
  });

  useEffect(() => {
    if (initialData?.image_urls) {
      setImageFile(initialData.image_urls);
    }
    if (initialData.rating) {
      setRate(initialData.rating);
    }
  }, [initialData, setImageFile]);

  const addMenu = () => {
    setMenuList([...menuList, { id: uuidv4(), name: '' }]);
  };

  const deleteMenu = (id: string) => {
    setMenuList(menuList.filter((menu) => menu.id !== id));
  };

  const handleMenuChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const newMenuList = menuList.map((menu) => (
      menu.id === id ? { ...menu, name: e.target.value } : menu));

    setMenuList(newMenuList);
  };

  const deleteImage = (url: string) => {
    setImageFile(imageFile.filter((image: string) => image !== url));
  };

  const reviewSuccessLogging = () => {
    const getReviewDurationTime = (new Date().getTime() - Number(sessionStorage.getItem('enterReview'))) / 1000;
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_detail_view_review_write_done',
      value: storeDetail.name,
      duration_time: getReviewDurationTime,
    });
  };

  const handleSumbit = (e: React.FormEvent) => {
    e.preventDefault();
    const reviewData = {
      rating: rate,
      content: reviewText,
      image_urls: imageFile,
      menu_names: menuList.map((menu) => menu.name).filter((name) => name.trim() !== ''),
    };

    if (rate) {
      mutate(reviewData);
      reviewSuccessLogging();
      navigate(`${ROUTES.StoreDetail({ id: String(storeDetail.id), isLink: true })}?state=리뷰`, { replace: true });
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSumbit}>
      <div className={styles.form__name}>
        <div>
          {storeDetail?.name}
        </div>
        <div>
          리뷰를 남겨주시면 사장님과 다른 분들에게 도움이 됩니다.
          <br />
          또한, 악의적인 리뷰는 관리자에 의해 삭제될 수 있습니다.
        </div>
      </div>
      <div className={styles.form__rate}>
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => setRate(num)}
            aria-label="별점 주기"
          >
            <div className={cn({
              [styles['star--empty']]: true,
              [styles['star--fill']]: rate >= num,
            })}
            >
              <StarIcon
                key={num}
              />
            </div>
          </button>
        ))}
        {rate}
      </div>
      <div className={styles.form__description}>더 많은 정보를 작성해 보세요!</div>
      <div className={styles.template}>
        <div className={styles.template__title}>
          <span>사진</span>
          <span className={cn({
            [styles.template__title__count]: true,
            [styles['template__title__count--active']]: imageFile.length === MAX_IMAGE_LENGTH,
          })}
          >
            {imageFile.length}
            /
            {MAX_IMAGE_LENGTH}
          </span>
        </div>
        <div className={styles.template__description}>리뷰와 관련된 사진을 업로드해주세요.</div>
        <ul className={styles.template__images}>
          {imageFile.map((url: string) => (
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
      <div className={styles.template}>
        <div className={styles.template__title}>
          <span>내용</span>
          <span className={cn({
            [styles.template__title__count]: true,
            [styles['template__title__count--active']]: reviewText.length === 500,
          })}
          >
            {reviewText.length}
            /500
          </span>
        </div>
        <textarea
          value={reviewText}
          maxLength={500}
          className={styles.template__textarea}
          onChange={(e) => {
            if (e.target.value.length <= 500) {
              setReviewText(e.target.value);
            }
          }}
        />
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
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
        {location.pathname.includes('/edit') ? '수정하기' : '작성하기'}
      </button>
    </form>
  );
}

export default ReviewForm;
