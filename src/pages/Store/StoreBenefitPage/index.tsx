import useParamsHandler from 'utils/hooks/routing/useParamsHandler';
import DesktopStoreList from 'pages/Store/StorePage/components/DesktopStoreList';
import useBenefitCategory from 'pages/Store/StoreBenefitPage/hooks/useBenefitCategory';
import useStoreBenefitList from 'pages/Store/StoreBenefitPage/hooks/useStoreBenefitList';
import styles from './StoreBenefitPage.module.scss';

function StoreBenefitPage() {
  const { params, setParams } = useParamsHandler();
  const { count, storeBenefitList } = useStoreBenefitList(params?.category ?? '1');
  const { benefitCategory } = useBenefitCategory();
  const onClickBenefitTab = (id: number) => {
    setParams('category', `${id}`, { deleteBeforeParam: false, replacePage: false });
  };

  return (
    <div className={styles.section}>
      <div className={styles.header}>전화 주문 헤택</div>
      <div className={styles.section__tabs}>
        {
          benefitCategory?.map((item) => (
            <button
              type="button"
              className={styles.tab}
              key={item.id}
              onClick={() => onClickBenefitTab(item.id)}
            >
              <div className={styles.tab__content}>
                <div className={styles['tab__content--logo']}>
                  로고
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

        }
      </div>
      <div className={styles.section__content}>
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
        <DesktopStoreList storeListData={storeBenefitList} />
      </div>
    </div>
  );
}

export default StoreBenefitPage;
