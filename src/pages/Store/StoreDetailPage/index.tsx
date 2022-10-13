import React from 'react';
import ImageModal from 'components/common/Modal/ImageModal';
import { useNavigate, useParams } from 'react-router-dom';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import cn from 'utils/ts/classnames';
import ModalProvider from 'components/common/Modal/ModalProvider';
import useStoreDetail from './hooks/useStoreDetail';
import styles from './StoreDetailPage.module.scss';

function StoreDetailPage() {
  const params = useParams();
  const isMobile = useMediaQuery();
  const navigate = useNavigate();
  const { storeDetail, storeDescription } = useStoreDetail(params.id);
  const [modalOpen, setModalOpen] = React.useState(false);

  const onClickCloseModal = () => {
    setModalOpen(false);
  };

  const onClickOpenModal = () => {
    setModalOpen(true);
  };

  return (
    <div className={styles.template}>
      <div className={styles.section}>
        {!isMobile && <div className={styles.section__header}>주변 상점</div>}
        <div className={styles['section__store-info']}>
          <div className={styles.store}>
            <div className={styles.store__name}>{storeDetail?.name}</div>
            <div className={styles.store__detail}>
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
              <div className={styles.etc}>
                <span>기타정보</span>
                <div className={styles.etc__content}>
                  { storeDescription }
                </div>
              </div>
            </div>
            <div className={styles.store__tag}>
              { storeDetail?.delivery && <span>#배달가능</span> }
              { storeDetail?.pay_card && <span>#카드가능</span> }
              { storeDetail?.pay_bank && <span>#계좌이체가능</span> }
            </div>
            <div className={styles['button-wrapper']}>
              <a
                className={cn({
                  [styles['button-wrapper__button']]: true,
                  [styles['button-wrapper__button--call']]: true,
                })}
                href={`tel:${storeDetail?.phone}`}
              >
                전화하기
              </a>
              <button
                className={cn({
                  [styles['button-wrapper__button']]: true,
                  [styles['button-wrapper__button--store-list']]: true,
                })}
                type="button"
                onClick={() => navigate('/store')}
              >
                상점목록
              </button>
            </div>
          </div>
          <div className={styles.image}>
            { storeDetail?.image_urls && storeDetail.image_urls.map((img, index, imageObject) => (
              <div key={`${img}`} className={styles.image__content}>
                <button
                  className={styles.image__button}
                  type="button"
                  onClick={() => onClickOpenModal()}
                >
                  <img
                    className={styles.image__poster}
                    src={`${img}`}
                    alt="상점이미지"
                  />
                </button>
                {
                  modalOpen && (
                    <ModalProvider>
                      <ImageModal
                        image={imageObject}
                        nowImage={index}
                        onClose={onClickCloseModal}
                      />
                    </ModalProvider>
                  )
                }
              </div>
            ))}
          </div>
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
