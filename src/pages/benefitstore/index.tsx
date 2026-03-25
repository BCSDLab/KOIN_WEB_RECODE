import { Suspense, useEffect } from 'react';
import { GetServerSidePropsContext } from 'next';
import { cn } from '@bcsdlab/utils';
import { dehydrate, HydrationBoundary, QueryClient, useSuspenseQuery, type DehydratedState } from '@tanstack/react-query';
import { storeQueries } from 'api/store/queries';
import DesktopStoreList from 'components/Store/StorePage/components/DesktopStoreList';
import EventCarousel from 'components/Store/StorePage/components/EventCarousel';
import MobileStoreList from 'components/Store/StorePage/components/MobileStoreList';
import { getCategoryDurationTime, initializeCategoryEntryTime } from 'components/Store/utils/durationTime';
import { STORE_PAGE } from 'static/store';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useParamsHandler from 'utils/hooks/routing/useParamsHandler';
import styles from './StoreBenefitPage.module.scss';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = new QueryClient();
  const { category } = context.query;
  const categoryId = Array.isArray(category) ? category[0] : category;

  if (!categoryId) {
    return {
      notFound: true,
    };
  }

  await queryClient.prefetchQuery(storeQueries.benefitCategory());

  await queryClient.prefetchQuery(storeQueries.benefitList(categoryId));

  // StoreList 페이지에서 사용하는 API
  await queryClient.prefetchQuery(storeQueries.categories());

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

function StoreBenefit() {
  const { params, searchParams, setParams } = useParamsHandler();
  const isMobile = useMediaQuery();
  const logger = useLogger();
  const { data } = useSuspenseQuery({
    ...storeQueries.benefitList(params?.category ?? '1'),
    select: (benefitListData) => ({
      storeBenefitList: benefitListData.shops,
      count: benefitListData.count,
    }),
  });
  const { count, storeBenefitList } = data;
  const selectedCategory = Number(searchParams.get('category')) ?? 1;
  const { data: benefitCategory } = useSuspenseQuery({
    ...storeQueries.benefitCategory(),
    select: (benefitCategoryData) => benefitCategoryData.benefits,
  });

  useEffect(() => {
    initializeCategoryEntryTime();
  }, [selectedCategory]);

  const onClickBenefitTab = (id: number, value: string) => {
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'benefit_shop_categories',
      value,
      previous_page: benefitCategory?.find((category) => String(category.id) === params.category)?.title || 'Unknown',
      current_page: value,
      duration_time: getCategoryDurationTime(),
    });
    setParams({ category: `${id}` }, { deleteBeforeParam: true, replacePage: true });
  };

  return (
    <div className={styles.section}>
      <div className={styles.header}>전화 주문 혜택</div>
      <div className={styles.section__tabs}>
        {benefitCategory?.map((item) => (
          <button
            type="button"
            className={cn({
              [styles.tab]: true,
              [styles['tab--selected']]: item.id === selectedCategory,
            })}
            key={item.id}
            onClick={() => onClickBenefitTab(item.id, item.title)}
          >
            <div className={styles.tab__content}>
              <div className={styles['tab__content--logo']}>
                {/* 이미지 크기가 작고 개별 크기가 모두 다르기에 img 태그 유지 */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    selectedCategory === item.id
                      ? (benefitCategory[item.id - 1]?.on_image_url ?? '')
                      : (benefitCategory[item.id - 1]?.off_image_url ?? '')
                  }
                  alt={`${item.title} 아이콘`}
                />
              </div>
              <div className={styles['tab__content--text']}>{item.title}</div>
            </div>
          </button>
        ))}
      </div>
      <div className={styles.section__title}>
        {benefitCategory ? benefitCategory[selectedCategory - 1]?.detail : ''}
      </div>
      <div className={styles.section__content}>
        {isMobile ? (
          <div className={styles['divide-bar']} />
        ) : (
          <div className={styles.option}>
            <div className={styles.option__count}>
              총&nbsp;
              <strong>
                {count}
                개의 업체가
              </strong>
              있습니다.
            </div>
          </div>
        )}
        {isMobile && <EventCarousel />}
        {isMobile ? (
          <MobileStoreList storeListData={storeBenefitList} storeType={STORE_PAGE.BENEFIT_STORE} />
        ) : (
          <DesktopStoreList storeListData={storeBenefitList} storeType={STORE_PAGE.BENEFIT_STORE} />
        )}
      </div>
    </div>
  );
}

export default function StoreBenefitPage({ dehydratedState }: { dehydratedState: DehydratedState }) {
  return (
    <HydrationBoundary state={dehydratedState}>
      {/* TODO: Loading 디자인 추가 요청 */}
      <Suspense fallback={null}>
        <StoreBenefit />
      </Suspense>
    </HydrationBoundary>
  );
}
