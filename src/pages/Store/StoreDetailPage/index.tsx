import { useParams } from 'react-router-dom';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import styles from './StoreDetailPage.module.scss';

function StoreDetailPage() {
  const params = useParams();
  const isMobile = useMediaQuery();

  console.log(params.id);
  return (
    <div className={styles.template}>
      <div className={styles.section}>
        {!isMobile && <div className={styles.section__header}>주변 상점</div>}
        <div className={styles['section__store-info']}>
          <div className={styles['store-info']}>
            <div className={styles['store-info__name']}>상점 이름</div>
            <div className={styles['store-info__detail']}>
              <span>전화번호</span>
              <br />
              <span>운영시간</span>
              <br />
              <span>주소정보</span>
              <br />
              <span>배달요금</span>
              <div className={styles['store-info__etc']}>
                <span>기타정보</span>
              </div>
              <div className={styles['store-info__tag']}>
                <span>#배달가능</span>
                <span>#카드가능</span>
                <span>#계좌이체가능</span>
              </div>
              <div className={styles['store-info-button']}>
                <div className={styles['store-info-button__call']}>전화하기</div>
                <div className={styles['store-info-button__store-list']}>상점목록</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoreDetailPage;
