import useParamsHandler from 'utils/hooks/routing/useParamsHandler';
import DesktopStoreList from 'pages/Store/StorePage/components/DesktopStoreList';
import useStoreBenefitList from 'pages/Store/StoreBenefitPage/hooks/useStoreBenefitList';
import styles from './StoreBenefitPage.module.scss';

const BENEFIT_LIST = [
  {
    id: 1,
    logo: 'realkk',
    text: '배달비 할인',
  },
  {
    id: 2,
    logo: 'realkk',
    text: '최소주문금액 0원',
  },
  {
    id: 3,
    logo: 'realkk',
    text: '서비스 증정',
  },
  {
    id: 4,
    logo: 'realkk',
    text: '픽업 서비스',
  },
];

function StoreBenefitPage() {
  const { params, setParams } = useParamsHandler();
  const { count, storeBenefitList } = useStoreBenefitList(params?.category ?? '1');

  const onClickBenefitTab = (id: number) => {
    setParams('category', `${id}`, { deleteBeforeParam: false, replacePage: false });
  };
  return (
    <div className={styles.section}>
      <div className={styles.header}>전화 주문 헤택</div>
      <div className={styles.section__tabs}>
        {
          BENEFIT_LIST.map((item) => (
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
                  {item.text}
                </div>
              </div>
            </button>
          ))
        }
      </div>
      <div className={styles.section__title}>
        계좌이체하면 배달비가 무료(할인)인 상점들을 모아뒀어요.
      </div>
      <div className={styles.section__content}>
        <div className={styles.option}>
          <div className={styles.option__count}>
            총
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
