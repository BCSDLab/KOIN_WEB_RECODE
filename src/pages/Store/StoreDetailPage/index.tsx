import { useParams } from 'react-router-dom';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import { useQuery } from 'react-query';
import cn from 'utils/ts/classnames';
import * as api from 'api';
import styles from './StoreDetailPage.module.scss';

const useStoreDetail = (params: any) => {
  const { data: storeDetail } = useQuery(
    ['storeDetail', params],
    ({ queryKey }) => api.store.getStoreDetailInfo(queryKey[1]),
    { retry: 0 },
  );

  return storeDetail;
};

function StoreDetailPage() {
  const params = useParams();
  const isMobile = useMediaQuery();
  const storeDetailInfo = useStoreDetail(params.id);
  console.log(storeDetailInfo);
  return (
    <div className={styles.template}>
      <div className={styles.section}>
        {!isMobile && <div className={styles.section__header}>주변 상점</div>}
        <div className={styles['section__store-info']}>
          <div className={styles['store-info']}>
            <div className={styles['store-info__name']}>{params.id}</div>
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
              <div className={styles['store-button-wrapper']}>
                <div className={cn({
                  [styles['store-button-wrapper__button']]: true,
                  [styles['store-button-wrapper__button--call']]: true,
                })}
                >
                  전화하기
                </div>
                <div className={cn({
                  [styles['store-button-wrapper__button']]: true,
                  [styles['store-button-wrapper__button--store-list']]: true,
                })}
                >
                  상점목록
                </div>
              </div>
            </div>
          </div>
          <div className={styles['store-info-image']}>
            { storeDetailInfo?.image_urls && storeDetailInfo.image_urls.map((img) => (
              <img
                className={styles['store-info-image__content']}
                key={`${img}`}
                src={`${img}`}
                alt="상점이미지"
              />
            ))}
          </div>
        </div>
        { storeDetailInfo?.menus.length && (
          <>
            <div className={styles['menu-title']}>MENU</div>
            <div className={styles['menu-info']}>
              { storeDetailInfo.menus.filter((menu) => menu.price_type).map(
                (menu) => menu.price_type.map((price) => ({
                  ...price,
                  name: menu.name,
                })),
              ).flat(1)
                .map((menu) => (
                  <div className={styles['menu-card']} key={menu.name + menu.size}>
                    { menu.name }
                    { menu.size !== '기본' && menu.size}
                    <span>{ !!menu.price && menu.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }</span>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StoreDetailPage;
