import useStoreDetail from 'pages/Store/StoreDetailPage/hooks/useStoreDetail';
import { ReactComponent as StarIcon } from 'assets/svg/empty-star.svg';
import { ReactComponent as AddImageIcon } from 'assets/svg/add-image.svg';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './StoreReviewPage.module.scss';

function StoreReviewPage() {
  const params = useParams();
  const { storeDetail } = useStoreDetail(params.id!);
  const [rate, setRate] = useState(0);

  const handleRate = (num: number) => {
    if (num === rate) {
      setRate(0);
    } else {
      setRate(num);
    }
  };

  return (
    <form className={styles.form}>
      <div className={styles.form__name}>
        <div>
          {storeDetail?.name}
        </div>
        <div>
          리뷰를 남겨주시면 사자님과 다른 분들에게 도움이 됩니다.
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
          <span>0/3</span>
        </div>
        <div className={styles.template__description}>리뷰와 관련된 사진을 업로드해주세요.</div>
        <button type="button" className={styles.template__button}>
          사진 등록하기
          <AddImageIcon />
        </button>
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
        <button type="button" className={styles.template__button}>메뉴 추가하기</button>
      </div>
      <button type="submit" className={styles.form__button}>작성하기</button>
    </form>
  );
}

export default StoreReviewPage;
