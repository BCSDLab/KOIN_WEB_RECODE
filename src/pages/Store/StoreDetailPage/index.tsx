import ImageModal from 'components/common/Modal/ImageModal';
import useModalPortal from 'utils/hooks/useModalPortal';
import { useNavigate, useParams } from 'react-router-dom';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import cn from 'utils/ts/classnames';
import useStoreDetail from './hooks/useStoreDetail';
import styles from './StoreDetailPage.module.scss';

function StoreDetailPage() {
  const params = useParams();
  const isMobile = useMediaQuery();
  const navigate = useNavigate();
  const { storeDetail, storeDescription } = useStoreDetail(params.id);
  const portalManager = useModalPortal();

  const openModal = (img: {}[]) => {
    portalManager.open((modalOpen: any) => <ImageModal image={img} onClose={modalOpen.close} />);
  };
  return (
    <div className={styles.template}>
      <div className={styles.section}>
        {!isMobile && <div className={styles.section__header}>주변 상점</div>}
        <div className={styles['section__store-info']}>
          <div className={styles['store-info']}>
            <div className={styles['store-info__name']}>{storeDetail?.name}</div>
            <div className={styles['store-info__detail']}>
              <span>전화번호</span>
              { storeDetail?.phone }
              <br />
              <span>운영시간</span>
              { storeDetail?.open_time ? `${storeDetail.open_time} ~ ${storeDetail.close_time}` : '-'}
              <br />
              <span>주소정보</span>
              { storeDetail?.address }
              <br />
              <span>배달요금</span>
              { storeDetail?.delivery_price.toLocaleString() }
              원
              <br />
              <div className={styles['store-info-etc']}>
                <span>기타정보</span>
                <div className={styles['store-info-etc__content']}>
                  { storeDescription }
                </div>
              </div>
            </div>
            <div className={styles['store-info__tag']}>
              <span>#배달가능</span>
              <span>#카드가능</span>
              <span>#계좌이체가능</span>
            </div>
            <div className={styles['store-button-wrapper']}>
              <a
                className={cn({
                  [styles['store-button-wrapper__button']]: true,
                  [styles['store-button-wrapper__button--call']]: true,
                })}
                href={`tel:${storeDetail?.phone}`}
              >
                전화하기
              </a>
              <button
                className={cn({
                  [styles['store-button-wrapper__button']]: true,
                  [styles['store-button-wrapper__button--store-list']]: true,
                })}
                type="button"
                onClick={() => navigate('/store')}
              >
                상점목록
              </button>
            </div>
          </div>
          <button className={styles['store-info-image']} type="button" onClick={() => openModal(storeDetail!.image_urls)}>
            { storeDetail?.image_urls && storeDetail.image_urls.map((img) => (
              <img
                className={styles['store-info-image__content']}
                key={`${img}`}
                src={`${img}`}
                alt="상점이미지"
              />
            ))}
          </button>
        </div>
        { !!storeDetail?.menus.length && (
          <>
            <div className={styles['menu-title']}>MENU</div>
            <div className={styles['menu-info']}>
              { storeDetail.menus.filter((menu) => menu.price_type).map(
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
