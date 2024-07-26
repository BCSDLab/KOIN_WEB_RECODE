import { useGetReview } from 'pages/Store/StoreDetailPage/hooks/useGetReview';
import { useParams } from 'react-router-dom';
import ReviewCard from 'pages/Store/StoreDetailPage/Review/components/ReviewCard/ReviewCard';
import { useCallback, useEffect, useRef } from 'react';
import styles from './ReviewList.module.scss';

export default function ReviewList() {
  const param = useParams();
  const {
    data, hasNextPage, fetchNextPage,
  } = useGetReview(Number(param.id));
  const endOfPage = useRef(null);
  const reviews = data.pages.flatMap((page) => page.reviews);

  const getNextReview = useCallback(() => {
    if (hasNextPage) fetchNextPage();
  }, [hasNextPage, fetchNextPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(getNextReview);

    if (endOfPage.current) observer.observe(endOfPage.current);

    return () => observer.disconnect();
  }, [getNextReview]);

  return (
    <div className={styles.container}>
      {reviews.map((review) => (
        param.id && (
        <ReviewCard
          key={review.review_id}
          rating={review.rating}
          nick_name={review.nick_name}
          content={review.content}
          image_urls={review.image_urls}
          menu_names={review.menu_names}
          is_mine={review.is_mine}
          is_modified={review.is_modified}
          created_at={review.created_at}
          review_id={review.review_id}
          shop_id={param.id}
        />
        )
      ))}
      <div ref={endOfPage} />
    </div>
  );
}
