import { cn } from '@bcsdlab/utils';
import useParamsHandler from 'utils/hooks/routing/useParamsHandler';
import DesktopStoreList from 'pages/Store/StorePage/components/DesktopStoreList';
import useBenefitCategory from 'pages/Store/StoreBenefitPage/hooks/useBenefitCategory';
import useStoreBenefitList from 'pages/Store/StoreBenefitPage/hooks/useStoreBenefitList';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import { STORE_PAGE } from 'static/store';
import { useEffect } from 'react';
import useLogger from 'utils/hooks/analytics/useLogger';
import EventCarousel from 'pages/Store/StorePage/components/EventCarousel';
import { getCategoryDurationTime, initializeCategoryEntryTime } from 'pages/Store/utils/durationTime';
import MobileStoreList from 'pages/Store/StorePage/components/MobileStoreList';
import styles from './StoreBenefitPage.module.scss';

export default function StoreBenefitPage() {
  const { params, searchParams, setParams } = useParamsHandler();
  const isMobile = useMediaQuery();
  const logger = useLogger();
  const { count, storeBenefitList } = useStoreBenefitList(params?.category ?? '1');
  const selectedCategory = Number(searchParams.get('category')) ?? 1;
  const { benefitCategory } = useBenefitCategory();

  useEffect(() => {
    initializeCategoryEntryTime();
  }, [selectedCategory]);

  const onClickBenefitTab = (id: number, value :string) => {
    logger.actionEventClick({
      actionTitle: 'BUSINESS',
      event_label: 'benefit_shop_categories',
      value,
      event_category: 'click',
      previous_page: (benefitCategory?.find((category) => String(category.id) === params.category)?.title || 'Unknown'),
      current_page: value,
      duration_time: getCategoryDurationTime(),
    });
    setParams('category', `${id}`, { deleteBeforeParam: true, replacePage: true });
  };

  return (
    <div className={styles.section}>
      <div className={styles.header}>전화 주문 혜택</div>
      <div className={styles.section__tabs}>
        {
          benefitCategory?.map((item) => (
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
                  {
                    selectedCategory === item.id ? (
                      <img src={benefitCategory[item.id - 1]?.on_image_url ?? ''} alt="off_img" />
                    ) : (
                      <img src={benefitCategory[item.id - 1]?.off_image_url ?? ''} alt="off_img" />
                    )
                  }
                </div>
                <div className={styles['tab__content--text']}>
                  {item.title}
                </div>
              </div>
            </button>
          ))
        }
      </div>
      <div className={styles.section__title}>
        {
          benefitCategory ? benefitCategory[selectedCategory - 1]?.detail : ''
        }
      </div>
      <div className={styles.section__content}>
        {isMobile
          ? <div className={styles['divide-bar']} />
          : (
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
        {isMobile
          ? (
            <MobileStoreList
              storeListData={storeBenefitList}
              storeType={STORE_PAGE.BENEFIT_STORE}
            />
          )
          : (
            <DesktopStoreList
              storeListData={storeBenefitList}
              storeType={STORE_PAGE.BENEFIT_STORE}
            />
          )}
      </div>
    </div>
  );
}
