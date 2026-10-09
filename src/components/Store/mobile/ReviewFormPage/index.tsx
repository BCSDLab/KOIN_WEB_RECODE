import { useEffect } from 'react';

import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { storeMobileQueries, storeMobileQueryKeys } from 'api/storeMobile/queries';
import { getLoggingTime, setStartLoggingTime } from 'components/Store/mobile/common/utils/loggingTime';
import ReviewForm from 'components/Store/mobile/ReviewFormPage/components/ReviewForm';
import useReviewFormBase from 'components/Store/mobile/ReviewFormPage/hooks/useReviewFormBase';
import useReviewImages from 'components/Store/mobile/ReviewFormPage/hooks/useReviewImages';
import { useAddStoreReview } from 'components/Store/StoreReviewPage/hooks/useAddStoreReview';
import useLogger from 'utils/hooks/analytics/useLogger';
import useGoBack from 'utils/hooks/routing/useGoBack';
import showToast from 'utils/ts/showToast';

// KOIN_ORDER_WEBVIEW pages/Shop/shopReview/components/ReviewCreateForm 이전(모바일 리뷰 작성)
interface ReviewCreatePageProps {
  id: string;
}

export default function ReviewCreatePage({ id }: ReviewCreatePageProps) {
  const { data: shopDetail } = useSuspenseQuery(storeMobileQueries.detail(id));
  const shopName = shopDetail.name;

  const queryClient = useQueryClient();
  const logger = useLogger();
  const goBack = useGoBack();
  const form = useReviewFormBase();
  const { imageUrls, imgRef, handleChangeImage, removeImage } = useReviewImages();
  // 등록 요청·실패 토스트(isKoinError → showToast)는 데스크톱 훅을 그대로 쓴다
  const { mutate } = useAddStoreReview(id);

  useEffect(() => {
    setStartLoggingTime('enteredReviewCreatePage');
  }, []);

  const handleSubmit = () => {
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_detail_view_review_write_done',
      value: shopName,
      duration_time: getLoggingTime('enteredReviewCreatePage'),
    });

    if (!form.isFormValid) return;

    mutate(
      {
        rating: form.rating,
        content: form.content,
        image_urls: imageUrls,
        menu_names: form.menus,
      },
      {
        onSuccess: () => {
          // 모바일 리뷰 목록·내 리뷰는 같은 접두사(reviews) 아래에 있다
          queryClient.invalidateQueries({ queryKey: [...storeMobileQueryKeys.all, 'reviews'] });
          showToast('success', '리뷰가 작성되었어요');
          goBack();
        },
      },
    );
  };

  return (
    <ReviewForm
      shopName={shopName}
      form={form}
      imageUrls={imageUrls}
      imgRef={imgRef}
      onChangeImage={handleChangeImage}
      onRemoveImage={removeImage}
      submitLabel="작성하기"
      onSubmit={handleSubmit}
    />
  );
}
