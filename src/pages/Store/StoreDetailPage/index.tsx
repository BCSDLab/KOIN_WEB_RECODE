import React, { useState } from 'react';
import getDayOfWeek from 'utils/ts/getDayOfWeek';
import ImageModal from 'components/common/Modal/ImageModal';
import { useNavigate, useParams } from 'react-router-dom';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import { cn } from '@bcsdlab/utils';
import { Portal } from 'components/common/Modal/PortalProvider';
import UpdateInfo from 'components/common/UpdateInfo/UpdateInfo';
import showToast from 'utils/ts/showToast';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import useLogger from 'utils/hooks/analytics/useLogger';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import { ReactComponent as EmptyImageIcon } from 'assets/svg/empty-thumbnail.svg';
import { useScorllLogging } from 'utils/hooks/analytics/useScrollLogging';
import Copy from 'assets/png/copy.png';
import { useHeaderButtonStore } from 'utils/zustand/headerButtonStore';
import { ReactComponent as Phone } from 'assets/svg/Review/phone.svg';
import useStoreDetail from './hooks/useStoreDetail';
import useStoreMenus from './hooks/useStoreMenus';
import MenuTable from './MenuTable';
import EventTable from './EventTable';
import styles from './StoreDetailPage.module.scss';
import ReviewPage from './Review';
import { useGetReview } from './hooks/useGetReview';

function StoreDetailPage() {
  const params = useParams();
  const isMobile = useMediaQuery();
  const navigate = useNavigate();
  const { storeDetail, storeDescription } = useStoreDetail(params.id!);
  const { data: storeMenus } = useStoreMenus(params.id!);
  const storeMenuCategories = storeMenus ? storeMenus.menu_categories : null;
  const [tapType, setTapType] = useState('메뉴');
  const portalManager = useModalPortal();
  const logger = useLogger();
  const { data } = useGetReview(Number(params.id));
  const setButtonContent = useHeaderButtonStore((state) => state.setButtonContent);
  const onClickCallNumber = () => {
    logger.click({
      title: 'store_detail_call_number',
      value: storeDetail!.phone,
    });
    logger.actionEventClick({
      actionTitle: 'BUSINESS',
      title: 'shop_call',
      value: storeDetail!.name,
    });
  };

  const onClickImage = (img: string[], index: number) => {
    logger.actionEventClick({ actionTitle: 'BUSINESS', title: 'shop_picture', value: storeDetail!.name });
    portalManager.open((portalOption: Portal) => (
      <ImageModal imageList={img} imageIndex={index} onClose={portalOption.close} />
    ));
  };
  const onClickList = () => {
    logger.actionEventClick({ actionTitle: 'BUSINESS', title: 'shop_list', value: 'shopList' });
  };
  const onClickEventList = () => {
    logger.actionEventClick({ actionTitle: 'BUSINESS', title: 'shop_detailView_event', value: `${storeDetail.name}` });
  };
  const copyAccount = async (account: string) => {
    await navigator.clipboard.writeText(account);
    showToast('info', '계좌번호가 복사되었습니다.');
  };

  useScrollToTop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => () => portalManager.close(), []); // portalManeger dependency 불필요
  useScorllLogging('shop_detailView', storeDetail);

  React.useEffect(() => {
    setButtonContent((
      // eslint-disable-next-line jsx-a11y/control-has-associated-label
      <a
        role="button"
        aria-label="상점 전화하기"
        href={`tel:${storeDetail?.phone}`}
        onClick={onClickCallNumber}
      >
        <Phone />
      </a>
    )); // 버튼 내부에 text가 없음

    return () => setButtonContent(null);
  });

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
                {storeDetail.open[getDayOfWeek()] && storeDetail?.open
                  ? `${storeDetail?.open[getDayOfWeek()].open_time} ~ ${storeDetail?.open[getDayOfWeek()].close_time
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
                {storeDetail.bank && storeDetail.account_number && (
                  <>
                    <span>계좌번호</span>
                    <div className={styles.account}>
                      {`${storeDetail.bank} ${storeDetail.account_number}`}
                      <button type="button" onClick={() => copyAccount(`${storeDetail.bank} ${storeDetail.account_number}`)}>
                        <img
                          src={Copy}
                          alt="복사하기"
                          className={styles.copy}
                        />
                      </button>
                    </div>
                    <br />
                  </>
                )}
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
                <button
                  className={cn({
                    [styles['button-wrapper__button']]: true,
                    [styles['button-wrapper__button--store-list']]: true,
                  })}
                  aria-label="상점 목록 이동"
                  type="button"
                  onClick={() => {
                    onClickList();
                    navigate('/store');
                  }}
                >
                  상점목록
                </button>
              </div>
              {isMobile && storeDetail?.updated_at && (
                <UpdateInfo date={storeDetail.updated_at} />
              )}
            </div>
          )}
          <div
            className={cn({
              [styles.image]: true,
              [styles['image--none']]: storeDetail?.image_urls.length === 0,
            })}
          >
            {storeDetail?.image_urls && storeDetail.image_urls.length > 0
              ? (storeDetail.image_urls.map((img, index) => (
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
              ))) : (
                <div className={styles['empty-image']}>
                  <div>
                    <EmptyImageIcon />
                  </div>
                </div>
              )}
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
            onClick={() => {
              onClickEventList();
              setTapType('이벤트/공지');
            }}
          >
            이벤트/공지
          </button>
          <button
            className={cn({
              [styles.tap__type]: true,
              [styles['tap__type--active']]: tapType === '리뷰',
            })}
            type="button"
            onClick={() => {
              onClickEventList();
              setTapType('리뷰');
            }}
          >
            리뷰
            {' '}
            {`(${data.pages[0].total_count})`}
          </button>
        </div>
        {tapType === '메뉴' && storeMenuCategories && storeMenuCategories.length > 0 && (
          <MenuTable storeMenuCategories={storeMenuCategories} onClickImage={onClickImage} />
        )}
        {tapType === '이벤트/공지' && <EventTable />}
        {tapType === '리뷰' && <ReviewPage id={params.id!} />}
      </div>
    </div>
  );
}

export default StoreDetailPage;
