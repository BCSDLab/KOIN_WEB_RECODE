import AddIcon from 'assets/svg/Articles/add.svg';
import LostItemForm from 'components/Articles/LostItemWritePage/components/LostItemForm';
import { useLostItemForm } from 'components/Articles/hooks/useLostItemForm';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import FoundIcon from 'assets/svg/Articles/found.svg';
import LostIcon from 'assets/svg/Articles/lost.svg';
import uuidv4 from 'utils/ts/uuidGenerater';
import usePostLostItemArticles from 'components/Articles/hooks/usePostLostItemArticles';
import ROUTES from 'static/routes';
import { useArticlesLogger } from 'components/Articles/hooks/useArticlesLogger';
import { useUser } from 'utils/hooks/state/useUser';
import { useEffect } from 'react';
import showToast from 'utils/ts/showToast';
import { useRouter } from 'next/router';
import styles from './LostItemWritePage.module.scss';

const getyyyyMMdd = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const TITLES = {
  FOUND: {
    title: '습득물 신고',
    subtitle: '주인을 찾아요',
    description: '습득한 물건을 자세히 설명해주세요!',
  },
  LOST: {
    title: '분실물 신고',
    subtitle: '잃어버렸어요',
    description: '분실한 물건을 자세히 설명해주세요!',
  },
};

type LostItemType = 'FOUND' | 'LOST';

export default function LostItemWritePage() {
  const { data: user } = useUser();
  const router = useRouter();
  const isMobile = useMediaQuery();
  const type: LostItemType = router.asPath.includes('/found') ? 'FOUND' : 'LOST';
  const isFound = type === 'FOUND';
  const { title, subtitle, description } = TITLES[type];
  const {
    lostItems,
    lostItemHandler,
    addLostItem,
    removeLostItem,
    validateAndUpdateItems,
    checkArticleFormFull,
  } = useLostItemForm(type);

  useEffect(() => {
    if (user?.name) {
      lostItems.forEach((lostItem, index) => {
        if (lostItem.author === '') {
          lostItemHandler(index).setAuthor(user.name);
        }
      });
    }
  }, [user?.name, lostItems, lostItemHandler]);

  const { status, mutateAsync: postLostItem } = usePostLostItemArticles();
  const {
    logFindUserAddItemClick,
    logLostItemAddItemClick,
    logFindUserWriteConfirmClick,
    logLostItemWriteConfirmClick,
  } = useArticlesLogger();

  const handleItemAddClick = () => {
    if (type === 'FOUND') {
      logFindUserAddItemClick();
    } else {
      logLostItemAddItemClick();
    }
    addLostItem();
  };

  const handleCompleteClick = async () => {
    if (type === 'FOUND') {
      logFindUserWriteConfirmClick();
    } else {
      logLostItemWriteConfirmClick();
    }
    validateAndUpdateItems();

    if (lostItems.length === 0) {
      showToast('error', '물품을 추가해주세요.');
      return;
    }

    if (!checkArticleFormFull()) return;

    const articles = lostItems.map((article) => ({
      type,
      category: article.category,
      foundPlace:
        type === 'LOST' && (!article.foundPlace || article.foundPlace.trim() === '')
          ? '장소 미상'
          : article.foundPlace,
      foundDate: getyyyyMMdd(article.foundDate),
      content: article.content,
      images: article.images,
      registered_at: article.registered_at,
      updated_at: article.updated_at,
    }));

    const id = await postLostItem({ articles });
    router.replace(ROUTES.LostItemDetail({ id: String(id), isLink: true }));
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
            onClick={handleItemAddClick}
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
            disabled={status === 'pending'}
          >
            작성 완료
          </button>
        </div>
      </div>
    </div>
  );
}
