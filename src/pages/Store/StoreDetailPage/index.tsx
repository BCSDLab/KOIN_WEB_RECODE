import React, { useState } from 'react';
import getDayOfWeek from 'utils/ts/getDayOfWeek';
// import { Menu, MenuCategory } from 'api/store/entity';
import ImageModal from 'components/common/Modal/ImageModal';
import { useNavigate, useParams } from 'react-router-dom';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import cn from 'utils/ts/classnames';
import { Portal } from 'components/common/Modal/PortalProvider';
import UpdateInfo from 'components/common/UpdateInfo/UpdateInfo';
import useModalPortal from 'utils/hooks/useModalPortal';
import useScrollToTop from 'utils/hooks/useScrollToTop';
import useStoreDetail from './hooks/useStoreDetail';
import useStoreMenus from './hooks/useStoreMenus';
import styles from './StoreDetailPage.module.scss';

function StoreDetailPage() {
  const params = useParams();
  const isMobile = useMediaQuery();
  const navigate = useNavigate();
  const { storeDetail, storeDescription } = useStoreDetail(params.id!);
  const { storeMenus } = useStoreMenus(params.id!);
  const storeMenuCategories = storeMenus ? storeMenus.menu_categories : null;
  const [tapType, setTapType] = useState('메뉴');
  console.log(storeMenuCategories);

  const portalManager = useModalPortal();

  const onClickImage = (img: string[], index: number) => {
    portalManager.open((portalOption: Portal) => (
      <ImageModal imageList={img} imageIndex={index} onClose={portalOption.close} />
    ));
  };

  useScrollToTop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => () => portalManager.close(), []); // portalManeger dependency 불필요
  return (
    <div className={styles.template}>
      <div className={styles.section}>
        {!isMobile && (
          <div className={styles.section__header}>
            <button
              className={styles['section__header--button']}
              aria-label="주변 상점 리스트 이동"
              type="button"
              onClick={() => navigate('/store')}
            >
              주변 상점
            </button>
            {storeDetail?.updated_at && (
              <UpdateInfo date={storeDetail.updated_at} />
            )}
          </div>
        )}
        <div className={styles['section__store-info']}>
          {storeDetail && (
            <div className={styles.store}>
              <div className={styles.store__name}>{storeDetail?.name}</div>
              <div className={styles.store__detail}>
                <span>전화번호</span>
                {storeDetail?.phone}
                <br />
                <span>운영시간</span>
                {storeDetail?.open
                  ? `${storeDetail?.open[getDayOfWeek()].open_time} ~ ${
                    storeDetail?.open[getDayOfWeek()].close_time
                  }`
                  : '-'}
                <br />
                <span>주소정보</span>
                {storeDetail?.address}
                <br />
                <span>배달요금</span>
                {storeDetail?.delivery_price.toLocaleString()}
                원
                <br />
                <div className={styles.etc}>
                  <span>기타정보</span>
                  <div className={styles.etc__content}>{storeDescription}</div>
                </div>
              </div>
              <div>
                <span className={cn({
                  [styles.store__tags]: true,
                  [styles['store__tags--active']]: storeDetail?.delivery,
                })}
                >
                  #배달가능
                </span>
                <span className={cn({
                  [styles.store__tags]: true,
                  [styles['store__tags--active']]: storeDetail?.pay_card,
                })}
                >
                  #카드가능
                </span>
                <span className={cn({
                  [styles.store__tags]: true,
                  [styles['store__tags--active']]: storeDetail?.pay_bank,
                })}
                >
                  #계좌이체가능
                </span>
              </div>
              <div className={styles['button-wrapper']}>
                <a
                  className={cn({
                    [styles['button-wrapper__button']]: true,
                    [styles['button-wrapper__button--call']]: true,
                  })}
                  role="button"
                  aria-label="상점 전화하기"
                  href={`tel:${storeDetail?.phone}`}
                >
                  전화하기
                </a>
                <button
                  className={cn({
                    [styles['button-wrapper__button']]: true,
                    [styles['button-wrapper__button--store-list']]: true,
                  })}
                  aria-label="상점 목록 이동"
                  type="button"
                  onClick={() => navigate('/store')}
                >
                  상점목록
                </button>
              </div>
            </div>
          )}
          <div
            className={cn({
              [styles.image]: true,
              [styles['image--none']]: storeDetail?.image_urls.length === 0,
            })}
          >
            {
              storeDetail?.image_urls && storeDetail.image_urls.map((img, index) => (
                <div key={`${img}`} className={styles.image__content}>
                  <button
                    className={styles.image__button}
                    aria-label="이미지 확대"
                    type="button"
                    onClick={() => onClickImage(storeDetail!.image_urls, index)}
                  >
                    <img className={styles.image__poster} src={`${img}`} alt="상점이미지" />
                  </button>
                </div>
              ))
            }
          </div>
        </div>
        <div className={styles.tap}>
          <button
            className={cn({
              [styles.tap__type]: true,
              [styles['tap__type--active']]: tapType === '메뉴',
            })}
            type="button"
            onClick={() => setTapType('메뉴')}
          >
            메뉴
          </button>
          <button
            className={cn({
              [styles.tap__type]: true,
              [styles['tap__type--active']]: tapType === '이벤트/공지',
            })}
            type="button"
            onClick={() => setTapType('이벤트/공지')}
          >
            이벤트/공지
          </button>
        </div>
        {tapType === '메뉴' && (<div>메뉴</div>)}
        {tapType === '이벤트/공지' && (<div>이벤트/공지</div>)}
        {/* {storeMenuCategories && storeMenuCategories.length > 0 && (
          <>
            <div className={styles['menu-title__container']}>
              <div className={styles['menu-title']}>MENU</div>
              {storeMenus && <UpdateInfo date={storeMenus.updated_at} />}
            </div>
            <div className={styles['menu-info']}>
              {storeMenuCategories.map((menuCategories: MenuCategory) => (
                menuCategories.menus.map((menu: Menu) => (
                  menu.option_prices === null ? (
                    <div className={styles['menu-card']} key={menu.id}>
                      {menu.name}
                      <span>
                        {
                          !!menu.single_price && (
                            menu.single_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                          )
                        }
                      </span>
                    </div>
                  ) : (
                    menu.option_prices.map((item) => (
                      <div className={styles['menu-card']} key={menu.id + item.option}>
                        {`${menu.name} - ${item.option}`}
                        <span>
                          {
                            item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                          }
                        </span>
                      </div>
                    ))
                  )
                ))))}
            </div>
          </>
        )} */}
      </div>
    </div>
  );
}

export default StoreDetailPage;
