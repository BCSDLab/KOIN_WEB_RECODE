import { useState } from 'react';
import { useRouter } from 'next/router';
import { LostItemImageDTO } from 'api/articles/entity';
import LostItemPageTemplate from 'components/Articles/components/LostItemPageTemplate';
import { FindUserCategory } from 'components/Articles/hooks/useArticlesLogger';
import { useLostItemForm } from 'components/Articles/hooks/useLostItemForm';
import useSingleLostItemArticle from 'components/Articles/LostItemDetailPage/hooks/useSingleLostItemArticle';
import usePutLostItemArticle from 'components/Articles/LostItemEditPage/hooks/usePutLostItemArticle';
import LostItemForm from 'components/Articles/LostItemWritePage/components/LostItemForm';
import ROUTES from 'static/routes';
import { getYyyyMmDd } from 'utils/ts/calendar';

interface LostItemEditPageProps {
  articleId: number;
}

const EDIT_TITLES = {
  FOUND: {
    title: '습득물 수정',
    subtitle: '주인을 찾아요',
    description: '습득한 물건을 자세히 설명해주세요!',
  },
  LOST: {
    title: '분실물 수정',
    subtitle: '잃어버렸어요',
    description: '분실한 물건을 자세히 설명해주세요!',
  },
};

export default function LostItemEditPage({ articleId }: LostItemEditPageProps) {
  const router = useRouter();
  const { article } = useSingleLostItemArticle(articleId);
  const { status, mutateAsync: putLostItem } = usePutLostItemArticle(articleId);

  const type = article.type as 'FOUND' | 'LOST';
  const isFound = type === 'FOUND';
  const { title, subtitle, description } = EDIT_TITLES[type];

  const [originalImages] = useState<LostItemImageDTO[]>(article.images);
  const [deleteImageIds, setDeleteImageIds] = useState<number[]>([]);

  const { lostItems, lostItemHandler, validateAndUpdateItems, checkArticleFormFull } = useLostItemForm({
    defaultType: type,
    initialItems: [
      {
        type,
        category: article.category as FindUserCategory,
        foundDate: new Date(article.found_date),
        foundPlace: article.found_place,
        content: article.content,
        author: article.author,
        images: article.images.map((img) => img.image_url),
        registered_at: article.registered_at,
        updated_at: article.updated_at,
        hasDateBeenSelected: true,
        isCategorySelected: true,
        isDateSelected: true,
        isFoundPlaceSelected: true,
      },
    ],
  });

  const lostItem = lostItems[0];

  const originalSetImages = lostItemHandler(0).setImages;
  const customLostItemHandler = {
    ...lostItemHandler(0),
    setImages: (images: Array<string>) => {
      const removedUrls = lostItem.images.filter((url) => !images.includes(url));
      const newDeleteIds = originalImages.filter((img) => removedUrls.includes(img.image_url)).map((img) => img.id);
      setDeleteImageIds((prev: number[]) => Array.from(new Set([...prev, ...newDeleteIds])));
      originalSetImages(images);
    },
  };

  const handleCompleteClick = async () => {
    validateAndUpdateItems();
    if (!checkArticleFormFull()) return;

    const originalImageUrls = originalImages.map((img) => img.image_url);
    const newImages = lostItem.images.filter((url) => !originalImageUrls.includes(url));

    const data = {
      category: lostItem.category,
      found_place:
        type === 'LOST' && (!lostItem.foundPlace || lostItem.foundPlace.trim() === '')
          ? '장소 미상'
          : lostItem.foundPlace,
      found_date: getYyyyMmDd(lostItem.foundDate),
      content: lostItem.content,
      new_images: newImages,
      delete_image_ids: deleteImageIds,
    };

    await putLostItem(data);
    router.replace(ROUTES.LostItemDetail({ id: String(articleId), isLink: true }));
  };

  return (
    <LostItemPageTemplate
      title={title}
      subtitle={subtitle}
      description={description}
      isFound={isFound}
      bottomButtonText="수정 완료"
      onBottomButtonClick={handleCompleteClick}
      isBottomButtonDisabled={status === 'pending'}
    >
      <LostItemForm type={type} count={0} lostItem={lostItem} lostItemHandler={customLostItemHandler} />
    </LostItemPageTemplate>
  );
}
