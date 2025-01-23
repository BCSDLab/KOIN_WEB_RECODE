import AddIcon from 'assets/svg/Articles/add.svg';
import LostItemForm from 'pages/Articles/components/LostItemForm';
import { useLostItemForm } from 'pages/Articles/hooks/useLostItemForm';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import FoundIcon from 'assets/svg/Articles/found.svg';
import LostIcon from 'assets/svg/Articles/lost.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import uuidv4 from 'utils/ts/uuidGenerater';
import usePostLostItemArticles from 'pages/Articles/hooks/usePostLostItemArticles';
import ROUTES from 'static/routes';
import { useArticlesLogger } from 'pages/Articles/hooks/useArticlesLogger';
import styles from './LostItemPage.module.scss';

const getyyyyMMdd = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const TITLES = {
  found: {
    title: '습득물 신고',
    subtitle: '주인을 찾아요',
    description: '습득한 물건을 자세히 설명해주세요!',
  },
  lost: {
    title: '분실물 신고',
    subtitle: '잃어버렸어요',
    description: '분실한 물건을 자세히 설명해주세요!',
  },
};

type LostItemType = 'found' | 'lost';

export default function LostItemPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery();
  const type: LostItemType = location.pathname.includes('/found') ? 'found' : 'lost';
  const isFound = type === 'found';
  const { title, subtitle, description } = TITLES[type];
  const {
    lostItems,
    lostItemHandler,
    addLostItem,
    removeLostItem,
    validateAndUpdateItems,
    checkArticleFormFull,
  } = useLostItemForm();
  const { mutateAsync: postLostItem } = usePostLostItemArticles();
  const { logFindUserAddItemClick, logFindUserWriteConfirmClick } = useArticlesLogger();

  const handleItemAddClick = () => {
    logFindUserAddItemClick();
    addLostItem();
  };

  const handleCompleteClick = async () => {
    logFindUserWriteConfirmClick();
    validateAndUpdateItems();

    if (!checkArticleFormFull()) return;

    const articles = lostItems.map((article) => ({
      category: article.category,
      foundPlace: article.foundPlace,
      foundDate: getyyyyMMdd(article.foundDate),
      content: article.content,
      images: article.images,
    }));

    const id = await postLostItem({ articles });
    navigate(ROUTES.LostItemDetail({ id: String(id), isLink: true }), { replace: true });
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <span className={styles.header__title}>
            {isMobile ? subtitle : title}
            {isMobile && (
              <span>
                {isFound ? <FoundIcon /> : <LostIcon />}
              </span>
            )}
          </span>
          <span className={styles.header__description}>{description}</span>
        </div>
        <div className={styles.forms}>
          {lostItems.map((lostItem, index) => (
            <LostItemForm
              key={uuidv4()}
              type={type}
              count={index}
              lostItem={lostItem}
              lostItemHandler={lostItemHandler(index)}
              removeLostItem={removeLostItem}
            />
          ))}
        </div>
        <div className={styles.add}>
          <button
            className={styles.add__button}
            type="button"
            onClick={() => handleItemAddClick()}
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
