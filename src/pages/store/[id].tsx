import React, { Suspense, useEffect, useRef } from 'react';
import getDayOfWeek from 'utils/ts/getDayOfWeek';
import ImageModal from 'components/modal/Modal/ImageModal';
import { useRouter } from 'next/router';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import { cn } from '@bcsdlab/utils';
import { Portal } from 'components/modal/Modal/PortalProvider';
import UpdateInfo from 'components/Store/StoreDetailPage/components/UpdateInfo/UpdateInfo';
import showToast from 'utils/ts/showToast';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import useLogger from 'utils/hooks/analytics/useLogger';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import EmptyImageIcon from 'assets/svg/empty-thumbnail.svg';
import { useScrollLogging } from 'utils/hooks/analytics/useScrollLogging';
import Copy from 'assets/svg/Store/copy.svg';
import Phone from 'assets/svg/Review/phone.svg';
import ROUTES from 'static/routes';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import * as api from 'api';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useABTestView } from 'utils/hooks/abTest/useABTestView';
import StoreErrorBoundary from 'components/boundary/StoreErrorBoundary';
import MenuTable from 'components/Store/StoreDetailPage/components/MenuTable';
import EventTable from 'components/Store/StoreDetailPage/components/EventTable';
import ReviewPage from 'components/Store/StoreDetailPage/components/Review';
import useParamsHandler from 'utils/hooks/routing/useParamsHandler';
import styles from './StoreDetailPage.module.scss';

interface Props {
  id: string | undefined;
}

function StoreDetailPage({ id }: Props) {
  if (!id || Number.isNaN(Number(id))) throw new Error('잘못된 가게 id 입니다.');

  const isMobile = useMediaQuery();
  const enterCategoryTimeRef = useRef<number | null>(null);
  const queryClient = useQueryClient();
  const token = useTokenState();
  const router = useRouter();
  const testValue = useABTestView('business_call', token);
  const logger = useLogger();
  // waterfall 현상 막기
  const { data: paralleData } = useSuspenseQuery({
    queryKey: ['storeDetail', 'storeDetailMenu', 'review', id],
    queryFn: () =>
      Promise.all([
        queryClient.fetchQuery({
          queryKey: ['storeDetail', id],
          queryFn: () => api.store.getStoreDetailInfo(id),
        }),
        queryClient.fetchQuery({
          queryKey: ['storeDetailMenu', id],
          queryFn: () => api.store.getStoreDetailMenu(id),
        }),
        queryClient.fetchQuery({
          queryKey: ['review'],
          queryFn: () => api.store.getReviewList(Number(id), 1, 'LATEST', token),
        }),
      ]),
  });
  useEffect(() => {
    if (enterCategoryTimeRef.current === null) {
      const currentTime = new Date().getTime();
      sessionStorage.setItem('enter_storeDetail', currentTime.toString());
      enterCategoryTimeRef.current = currentTime;
    }
  }, [logger, testValue]);
  const storeDetail = paralleData[0];
  const storeDescription = storeDetail?.description ? storeDetail?.description.replace(/(?:\/)/g, '\n') : '-';
  const storeMenus = paralleData[1];
  const reviews = paralleData[2];
  const storeMenuCategories = storeMenus ? storeMenus.menu_categories : null;
  const { searchParams, setParams } = useParamsHandler();
  const tapType = searchParams.get('state') ?? '메뉴';
  const storeType = searchParams.get('type') ?? 'shop';
  const portalManager = useModalPortal();
  const onClickCallNumber = () => {
    if (searchParams.get('state') === '리뷰' && sessionStorage.getItem('enterReviewPage')) {
      logger.actionEventClick({
        team: 'BUSINESS',
        event_label: 'shop_detail_view_review_back',
        value: '',
        previous_page: '리뷰',
        current_page: '전화',
        duration_time: (new Date().getTime() - Number(sessionStorage.getItem('enterReviewPage'))) / 1000,
      });
    }
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: `${storeType}_call`,
      value: storeDetail!.name,
      duration_time: (new Date().getTime() - Number(sessionStorage.getItem('enter_storeDetail'))) / 1000,
    });
  };

  const onClickImage = (img: string[], index: number) => {
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_picture',
      value: storeDetail!.name,
      event_category: 'click',
    });
    portalManager.open((portalOption: Portal) => (
      <ImageModal imageList={img} imageIndex={index} onClose={portalOption.close} />
    ));
  };
  const onClickList = () => {
    if (searchParams.get('state') === '리뷰' && sessionStorage.getItem('enterReviewPage')) {
      logger.actionEventClick({
        team: 'BUSINESS',
        event_label: 'shop_detail_view_review_back',
        value: storeDetail.name,
        previous_page: '리뷰',
        current_page: '전체보기',
        duration_time: (new Date().getTime() - Number(sessionStorage.getItem('enterReviewPage'))) / 1000,
      });
    }
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_detail_view_back',
      value: storeDetail!.name,
      event_category: 'ShopList',
      current_page: sessionStorage.getItem('cameFrom') || '전체보기',
      duration_time: (new Date().getTime() - Number(sessionStorage.getItem('enter_storeDetail'))) / 1000,
    });
  };
  const onClickEventList = () => {
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_detail_view_event',
      value: `${storeDetail.name}`,
      event_category: 'click',
    });
  };
  const onClickReviewList = () => {
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_detail_view_review',
      value: `${storeDetail.name}`,
      event_category: 'click',
    });
  };
  const copyAccount = async (account: string) => {
    await navigator.clipboard.writeText(account);
    showToast('info', '계좌번호가 복사되었습니다.');
  };

  const detailScrollLogging = () => {
    if (searchParams.get('state') === '메뉴' || !searchParams.get('state')) {
      logger.actionEventClick({
        team: 'BUSINESS',
        event_label: 'shop_detail_view',
        value: storeDetail.name,
        event_category: 'scroll',
      });
    }
    if (searchParams.get('state') === '이벤트/공지') {
      logger.actionEventClick({
        team: 'BUSINESS',
        event_label: 'shop_detail_view_event',
        value: storeDetail.name,
        event_category: 'scroll',
      });
    }
    if (searchParams.get('state') === '리뷰') {
      logger.actionEventClick({
        team: 'BUSINESS',
        event_label: 'shop_detail_view_review',
        value: storeDetail.name,
        event_category: 'scroll',
      });
    }
  };

  useScrollToTop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => () => portalManager.close(), []); // portalManeger dependency 불필요
  useScrollLogging(detailScrollLogging);

  React.useEffect(() => {
    if (searchParams.get('state') !== '리뷰') {
      if (sessionStorage.getItem('enterReviewPage')) {
        logger.actionEventClick({
          team: 'BUSINESS',
          event_label: 'shop_detail_view_review_back',
          value: storeDetail.name,
          previous_page: '리뷰',
          current_page: searchParams.get('state') || '메뉴',
          duration_time: (new Date().getTime() - Number(sessionStorage.getItem('enterReviewPage'))) / 1000,
        });
        sessionStorage.removeItem('enterReviewPage');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, storeDetail]); // param이 바뀌어도 버튼이 적용되어야 함

  useEffect(
    () => {
      if (!sessionStorage.getItem('pushStateCalled')) {
        history.pushState(null, '', '');
        sessionStorage.setItem('pushStateCalled', 'true');
      }
      const handlePopState = () => {
        logger.actionEventClick({
          team: 'BUSINESS',
          event_label: 'shop_detail_view_back',
          value: storeDetail.name,
          event_category: 'swipe',
          current_page: sessionStorage.getItem('cameFrom') || '전체보기',
          duration_time: (new Date().getTime() - Number(sessionStorage.getItem('enter_storeDetail'))) / 1000,
        });
        router.back();
      };
      window.addEventListener('popstate', handlePopState);
      return () => {
        sessionStorage.removeItem('enterReviewPage');
        window.removeEventListener('popstate', handlePopState);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <div className={styles.template}>
      <div className={styles.section}>
        {!isMobile && (
          <div className={styles.section__header}>
            <button
              className={styles['section__header--button']}
              aria-label="주변 상점 리스트 이동"
              type="button"
              onClick={() => router.push(ROUTES.Store())}
            >
              주변 상점
            </button>
            {storeDetail?.updated_at && <UpdateInfo date={storeDetail.updated_at} />}
          </div>
        )}
        <div className={styles['section__store-info']}>
          {storeDetail && (
            <div className={styles.store}>
              <div className={styles.store__name}>{storeDetail?.name}</div>
              <div className={styles.store__detail}>
                <span>전화번호</span>
                {isMobile && (testValue === 'call_number' || testValue === 'default') ? (
                  <a
                    role="button"
                    aria-label="상점 전화하기"
                    href={`tel:${storeDetail?.phone}`}
                    onClick={onClickCallNumber}
                    className={styles['store__detail--phone']}
                  >
                    <div className={styles['store__detail--number']}>
                      {storeDetail?.phone}{' '}
                      <div>
                        <Phone />
                      </div>
                    </div>
                  </a>
                ) : (
                  storeDetail?.phone
                )}
                <br />
                <span>운영시간</span>
                {storeDetail.open[getDayOfWeek()] && storeDetail?.open
                  ? `${storeDetail?.open[getDayOfWeek()].open_time} ~ ${storeDetail?.open[getDayOfWeek()].close_time}`
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
                      <button
                        type="button"
                        onClick={() => copyAccount(`${storeDetail.bank} ${storeDetail.account_number}`)}
                        aria-label="계좌번호 복사"
                      >
                        <Copy />
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
                <span
                  className={cn({
                    [styles.store__tags]: true,
                    [styles['store__tags--active']]: storeDetail?.delivery,
                  })}
                >
                  #배달가능
                </span>
                <span
                  className={cn({
                    [styles.store__tags]: true,
                    [styles['store__tags--active']]: storeDetail?.pay_card,
                  })}
                >
                  #카드가능
                </span>
                <span
                  className={cn({
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
                    router.push(ROUTES.Store());
                  }}
                >
                  상점목록
                </button>
              </div>
              {isMobile && storeDetail?.updated_at && <UpdateInfo date={storeDetail.updated_at} />}
            </div>
          )}
          <div
            className={cn({
              [styles.image]: true,
              [styles['image--none']]: storeDetail?.image_urls.length === 0,
            })}
          >
            {storeDetail?.image_urls && storeDetail.image_urls.length > 0 ? (
              storeDetail.image_urls.map((img, index) => (
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
            ) : (
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
            onClick={() => {
              setParams({ state: '메뉴' }, { replacePage: true });
              logger.actionEventClick({
                team: 'BUSINESS',
                event_label: 'shop_detail_view',
                value: storeDetail!.name,
              });
            }}
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
              setParams({ state: '이벤트/공지' }, { replacePage: true });
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
              onClickReviewList();
              setParams({ state: '리뷰' }, { replacePage: true });
            }}
          >
            리뷰 {`(${reviews.total_count})`}
          </button>
        </div>
        {tapType === '메뉴' && storeMenuCategories && storeMenuCategories.length > 0 && (
          <MenuTable storeMenuCategories={storeMenuCategories} onClickImage={onClickImage} />
        )}
        {tapType === '이벤트/공지' && <EventTable id={id} />}
        {tapType === '리뷰' && <ReviewPage id={id} />}
      </div>
      {testValue === 'call_floating' && (
        <a
          role="button"
          aria-label="상점 전화하기"
          href={`tel:${storeDetail?.phone}`}
          onClick={onClickCallNumber}
          className={styles['phone-button--floating']}
        >
          <Phone />
        </a>
      )}
    </div>
  );
}

function StoreDetail() {
  const router = useRouter();
  const { id } = router.query;

  const pageId = Array.isArray(id) ? id[0] : id;
  if (!pageId) return null;

  return (
    <StoreErrorBoundary onErrorClick={() => router.push('/store')}>
      <Suspense fallback={<div />}>
        <StoreDetailPage id={pageId} />
      </Suspense>
    </StoreErrorBoundary>
  );
}

export default StoreDetail;
