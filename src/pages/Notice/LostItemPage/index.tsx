import AddIcon from 'assets/svg/Notice/add.svg';
import LostItemForm from 'pages/Notice/components/LostItemForm';
import { useLostItemForm } from 'pages/Notice/hooks/useLostItemForm';
import { useLocation } from 'react-router-dom';
import uuidv4 from 'utils/ts/uuidGenerater';
import usePostLostItemArticles from 'pages/Notice/hooks/usePostLostItemArticles';
import styles from './LostItemPage.module.scss';

const getyyMMdd = (date: Date) => {
  const yy = String(date.getFullYear()).slice(2);
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yy}-${MM}-${dd}`;
};

const TITLES = {
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
  const { title, subtitle } = TITLES[type];
  const { lostItems, lostItemHandler, addLostItem } = useLostItemForm();
  const { status, mutate: postLostItem } = usePostLostItemArticles();

  const handleCompleteClick = async () => {
    const articles = lostItems.map((article) => ({
      category: article.category,
      foundPlace: article.foundPlace,
      foundDate: getyyMMdd(article.foundDate),
      content: article.content,
      images: article.images,
    }));

    postLostItem({ articles });

    if (status === 'success') {
      console.log('success');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <span className={styles.header__title}>{title}</span>
          <span className={styles.header__subtitle}>{subtitle}</span>
        </div>
        <div className={styles.forms}>
          {lostItems.map((lostItem, index) => (
            <LostItemForm
              key={uuidv4()}
              type={type}
              count={index}
              lostItem={lostItem}
              lostItemHandler={lostItemHandler(index)}
            />
          ))}
        </div>
        <div className={styles.add}>
          <button
            className={styles.add__button}
            type="button"
            onClick={addLostItem}
          >
            <AddIcon />
            물품 추가
          </button>
        </div>
        <div className={styles.complete}>
          <button
            className={styles.complete__button}
            type="button"
            onClick={handleCompleteClick}
          >
            작성 완료
          </button>
        </div>
      </div>
    </div>
  );
}
