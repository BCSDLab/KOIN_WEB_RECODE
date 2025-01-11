import { useLocation } from 'react-router-dom';
import AddIcon from 'assets/svg/Notice/add.svg';
import styles from './LostItemPage.module.scss';

const titles = {
  found: {
    title: '습득물 신고',
    subtitle: '습득한 물건을 자세히 설명해주세요!',
  },
  lost: {
    title: '분실물 신고',
    subtitle: '분실한 물건을 자세히 설명해주세요!',
  },
};

type LostItemType = 'found' | 'lost';

export default function LostItemPage() {
  const location = useLocation();
  const type: LostItemType = location.pathname.includes('/found') ? 'found' : 'lost';
  const { title, subtitle } = titles[type];

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <span className={styles.header__title}>{title}</span>
          <span className={styles.header__subtitle}>{subtitle}</span>
        </div>
        <div className={styles.add}>
          <button
            className={styles.add__button}
            type="button"
            onClick={() => {}}
          >
            <AddIcon />
            물품 추가
          </button>
        </div>
        <div className={styles.complete}>
          <button
            className={styles.complete__button}
            type="button"
            onClick={() => {}}
          >
            작성 완료
          </button>
        </div>
      </div>
    </div>
  );
}
