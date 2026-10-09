import React, { Suspense, useEffect, useRef } from 'react';
import type { GetServerSidePropsContext } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { cn } from '@bcsdlab/utils';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  useQueryClient,
  useSuspenseQuery,
  type DehydratedState,
} from '@tanstack/react-query';
import { storeQueries, storeQueryKeys } from 'api/store/queries';
import EmptyImageIcon from 'assets/svg/empty-thumbnail.svg';
import Phone from 'assets/svg/Review/phone.svg';
import Copy from 'assets/svg/Store/copy.svg';
import StoreErrorBoundary from 'components/boundary/StoreErrorBoundary';
import ImageModal from 'components/modal/Modal/ImageModal';
import type { Portal } from 'components/modal/Modal/PortalProvider';
import EventTable from 'components/Store/StoreDetailPage/components/EventTable';
import MenuTable from 'components/Store/StoreDetailPage/components/MenuTable';
import ReviewPage from 'components/Store/StoreDetailPage/components/Review';
import UpdateInfo from 'components/Store/StoreDetailPage/components/UpdateInfo/UpdateInfo';
import ROUTES from 'static/routes';
import { useABTestView } from 'utils/hooks/abTest/useABTestView';
import useLogger from 'utils/hooks/analytics/useLogger';
import { useScrollLogging } from 'utils/hooks/analytics/useScrollLogging';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import useParamsHandler from 'utils/hooks/routing/useParamsHandler';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import { STORE_PUBLIC_SSR_CACHE_CONTROL, withCacheControl } from 'utils/ssr/withCacheControl';
import { isomorphicSessionStorage } from 'utils/ts/env';
import getDayOfWeek from 'utils/ts/getDayOfWeek';
import getElapsedSeconds from 'utils/ts/getElapsedSeconds';
import { isNotFoundKoinError } from 'utils/ts/isr';
import showToast from 'utils/ts/showToast';

import styles from './StoreDetailPage.module.scss';

interface Props {
  id: string;
}

// 기기·로그인 여부를 서버가 알아야 모바일·데스크톱 렌더와 리뷰 쿼리 범위를 서버에서 확정할 수 있어 SSR로 렌더한다.
// (ISR은 요청을 몰라 항상 guest 범위로 프리페치했고, 캐시 상태에 따라 요청이 달라졌다)
export const getServerSideProps = withCacheControl(
  async (context: GetServerSidePropsContext<{ id: string }>, cacheControl, serverRequest) => {
    const queryClient = new QueryClient();
    const isLoggedIn = !!serverRequest?.isLoggedIn;

    const storeId = context.params?.id;
    if (!storeId) {
      return { notFound: true };
    }

    try {
      await Promise.all([
        queryClient.fetchQuery(storeQueries.detail(storeId)),
        queryClient.fetchQuery(storeQueries.detailMenu(storeId)),
        // 리뷰는 요청 쿠키가 실린다. 만료·무효 access 쿠키면 API가 401을 주는데 서버는 refresh를 못 하므로
        // 실패해도 페이지는 그리고 클라이언트가 갱신 후 다시 받게 한다(prefetchQuery는 오류를 삼킨다)
        queryClient.prefetchQuery(
          storeQueries.reviewList({
            shopId: Number(storeId),
            page: 1,
            sorter: 'LATEST',
            isLoggedIn,
          }),
        ),
      ]);
    } catch (error) {
      if (isNotFoundKoinError(error)) {
        return { notFound: true };
      }
      throw error;
    }

    try {
      // 이벤트/공지 탭 데이터는 부가 정보이므로 페이지 렌더를 막지 않도록 분리합니다.
      await queryClient.fetchQuery(storeQueries.eventList(storeId));
    } catch (error) {
      console.error(`[SSR] failed to prefetch optional store events for ${storeId}:`, error);
    }

    cacheControl.enablePublicCache(STORE_PUBLIC_SSR_CACHE_CONTROL);

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        id: storeId,
      },
    };
  },
);

function StoreDetailPage({ id }: Props) {
  const isMobile = useMediaQuery();
  const enterCategoryTimeRef = useRef<number | null>(null);
  const queryClient = useQueryClient();
  const isLoggedIn = useIsLoggedIn();
  const router = useRouter();
  const testValue = useABTestView('business_call');
  const logger = useLogger();
  // waterfall 현상 막기
  const { data: parallelData } = useSuspenseQuery({
    queryKey: storeQueryKeys.detailPage(id, isLoggedIn),
    queryFn: () =>
      Promise.all([
        queryClient.fetchQuery(storeQueries.detail(id)),
        queryClient.fetchQuery(storeQueries.detailMenu(id)),
        queryClient.fetchQuery(
          storeQueries.reviewList({
            shopId: Number(id),
            page: 1,
            sorter: 'LATEST',
            isLoggedIn,
          }),
        ),
      ]),
  });

  useEffect(() => {
    if (enterCategoryTimeRef.current === null) {
      const currentTime = new Date().getTime();
      isomorphicSessionStorage.setItem('enter_storeDetail', currentTime.toString());
      enterCategoryTimeRef.current = currentTime;
    }
  }, [logger, testValue]);
  const storeDetail = parallelData[0];
  const storeDescription = storeDetail?.description ? storeDetail?.description.replace(/(?:\/)/g, '\n') : '-';
  const storeMenus = parallelData[1];
  const reviews = parallelData[2];
  const storeMenuCategories = storeMenus ? storeMenus.menu_categories : null;
  const { searchParams, setParams } = useParamsHandler();
  const tapType = searchParams.get('state') ?? '메뉴';
  const storeType = searchParams.get('type') ?? 'shop';
  const portalManager = useModalPortal();
  const onClickCallNumber = () => {
    if (searchParams.get('state') === '리뷰' && isomorphicSessionStorage.getItem('enterReviewPage')) {
      logger.actionEventClick({
        team: 'BUSINESS',
        event_label: 'shop_detail_view_review_back',
        value: '',
        previous_page: '리뷰',
        current_page: '전화',
        duration_time: getElapsedSeconds('enterReviewPage'),
      });
    }
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: `${storeType}_call`,
      value: storeDetail.name,
      duration_time: getElapsedSeconds('enter_storeDetail'),
    });
  };

  const onClickImage = (img: string[], index: number) => {
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_picture',
      value: storeDetail.name,
    });
    portalManager.open((portalOption: Portal) => (
      <ImageModal imageList={img} imageIndex={index} onClose={portalOption.close} />
    ));
  };
  const onClickList = () => {
    if (searchParams.get('state') === '리뷰' && isomorphicSessionStorage.getItem('enterReviewPage')) {
      logger.actionEventClick({
        team: 'BUSINESS',
        event_label: 'shop_detail_view_review_back',
        value: storeDetail.name,
        previous_page: '리뷰',
        current_page: '전체보기',
        duration_time: getElapsedSeconds('enterReviewPage'),
      });
    }
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_detail_view_back',
      value: storeDetail.name,
      event_category: 'ShopList',
      current_page: isomorphicSessionStorage.getItem('cameFrom') || '전체보기',
      duration_time: getElapsedSeconds('enter_storeDetail'),
    });
  };
  const onClickEventList = () => {
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_detail_view_event',
      value: `${storeDetail.name}`,
    });
  };
  const onClickReviewList = () => {
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_detail_view_review',
      value: `${storeDetail.name}`,
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
  // eslint-disable-next-line react-hooks/exhaustive-deps -- 언마운트 시 1회만 정리 (portalManager 참조 변경은 무시)
  React.useEffect(() => () => portalManager.close(), []);
  useScrollLogging(detailScrollLogging);

  React.useEffect(() => {
    if (searchParams.get('state') !== '리뷰') {
      if (isomorphicSessionStorage.getItem('enterReviewPage')) {
        logger.actionEventClick({
          team: 'BUSINESS',
          event_label: 'shop_detail_view_review_back',
          value: storeDetail.name,
          previous_page: '리뷰',
          current_page: searchParams.get('state') || '메뉴',
          duration_time: getElapsedSeconds('enterReviewPage'),
        });
        isomorphicSessionStorage.removeItem('enterReviewPage');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- param이 바뀌어도 버튼이 적용되어야 함 (logger는 안정적)
  }, [searchParams, storeDetail]);

  useEffect(
    () => {
      const handlePopState = () => {
        logger.actionEventClick({
          team: 'BUSINESS',
          event_label: 'shop_detail_view_back',
          value: storeDetail.name,
          event_category: 'swipe',
          current_page: isomorphicSessionStorage.getItem('cameFrom') || '전체보기',
          duration_time: getElapsedSeconds('enter_storeDetail'),
        });
      };
      window.addEventListener('popstate', handlePopState);

      return () => {
        isomorphicSessionStorage.removeItem('enterReviewPage');
        window.removeEventListener('popstate', handlePopState);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 마운트 시 1회만 리스너 등록
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
                <div key={img} className={styles.image__content}>
                  <button
                    className={styles.image__button}
                    aria-label="이미지 확대"
                    type="button"
                    onClick={() => onClickImage(storeDetail.image_urls, index)}
                  >
                    <Image
                      className={styles.image__poster}
                      src={img}
                      alt="상점이미지"
                      width={320}
                      height={360}
                      priority
                    />
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
                value: storeDetail.name,
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

function StoreDetail({ dehydratedState, id }: { dehydratedState: DehydratedState; id: string }) {
  const router = useRouter();

  return (
    <StoreErrorBoundary onErrorClick={() => router.push(ROUTES.Store())}>
      <HydrationBoundary state={dehydratedState}>
        <Suspense fallback={<div />}>
          <StoreDetailPage id={id} />
        </Suspense>
      </HydrationBoundary>
    </StoreErrorBoundary>
  );
}

export default StoreDetail;
