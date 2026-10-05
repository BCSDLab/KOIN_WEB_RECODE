import { useEffect } from 'react';
import { useRouter } from 'next/router';
import LostItemPageTemplate from 'components/Articles/components/LostItemPageTemplate';
import { useArticlesLogger } from 'components/Articles/hooks/useArticlesLogger';
import { useLostItemForm } from 'components/Articles/hooks/useLostItemForm';
import usePostLostItemArticles from 'components/Articles/hooks/usePostLostItemArticles';
import LostItemForm from 'components/Articles/LostItemWritePage/components/LostItemForm';
import ROUTES from 'static/routes';
import { useUser } from 'utils/hooks/state/useUser';
import { getYyyyMmDd } from 'utils/ts/calendar';
import showToast from 'utils/ts/showToast';

const MAX_ITEMS = 10;

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
  const type: LostItemType = router.asPath.includes('/found') ? 'FOUND' : 'LOST';
  const isFound = type === 'FOUND';
  const { title, subtitle, description } = TITLES[type];
  const { lostItems, lostItemHandler, addLostItem, removeLostItem, validateAndUpdateItems, checkArticleFormFull } =
    useLostItemForm({ defaultType: type });

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
      found_place:
        type === 'LOST' && (!article.foundPlace || article.foundPlace.trim() === '') ? '장소 미상' : article.foundPlace,
      found_date: getYyyyMmDd(article.foundDate),
      content: article.content,
      images: article.images,
      registered_at: article.registered_at,
      updated_at: article.updated_at,
    }));

    const id = await postLostItem({ articles });
    router.replace(ROUTES.LostItemDetail({ id: String(id) }));
  };

  return (
    <LostItemPageTemplate
      title={title}
      subtitle={subtitle}
      description={description}
      isFound={isFound}
      bottomButtonText="작성 완료"
      onBottomButtonClick={handleCompleteClick}
      isBottomButtonDisabled={status === 'pending'}
      onAddButtonClick={lostItems.length < MAX_ITEMS ? handleItemAddClick : undefined}
    >
      {lostItems.map((lostItem, index) => (
        <LostItemForm
          key={lostItem.id}
          type={type}
          count={index}
          totalCount={lostItems.length}
          lostItem={lostItem}
          lostItemHandler={lostItemHandler(index)}
          removeLostItem={removeLostItem}
        />
      ))}
    </LostItemPageTemplate>
  );
}
