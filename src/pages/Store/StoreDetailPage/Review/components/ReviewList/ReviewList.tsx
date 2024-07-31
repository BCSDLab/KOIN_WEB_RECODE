import { useGetReview } from 'pages/Store/StoreDetailPage/hooks/useGetReview';
import { useParams } from 'react-router-dom';
import ReviewCard from 'pages/Store/StoreDetailPage/Review/components/ReviewCard/ReviewCard';
import {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { Review } from 'api/store/entity';
import { ReactComponent as NoReview } from 'assets/svg/Review/no-review.svg';
import styles from './ReviewList.module.scss';

const option = ['최신순', '오래된순', '별점낮은순', '별점높은순'] as const;

const check = (one: Review, two: Review) => {
  const oneDate = new Date(one.created_at);
  const twoDate = new Date(two.created_at);

  return oneDate >= twoDate ? 1 : -1;
};

export default function ReviewList() {
  const param = useParams();
  const {
    data, hasNextPage, fetchNextPage,
  } = useGetReview(Number(param.id));
  const endOfPage = useRef(null);
  const reviews = data.pages.flatMap((page) => page.reviews);
  const currentReviewType = useRef<string>('최신순');
  const checkboxRef = useRef<HTMLInputElement>(null);
  const [filteredReview, setFilteredReview] = useState(reviews.sort((a, b) => check(b, a)));

  // 정렬 후 메모된 값을 사용
  const memoHighest = useMemo(() => [...reviews].sort((a, b) => b.rating - a.rating), [reviews]);
  const memoLowest = useMemo(() => [...reviews].sort((a, b) => a.rating - b.rating), [reviews]);
  const memoRecent = useMemo(() => [...reviews].sort((a, b) => check(b, a)), [reviews]);
  const memoOld = useMemo(() => [...reviews].sort((a, b) => check(a, b)), [reviews]);
  // reviews 배열 복사 후 정렬, sort는 원본을 바꿈

  const filter = (type: string) => {
    if (!checkboxRef.current?.checked) {
      if (type === '별점높은순') {
        setFilteredReview(memoHighest);
      }
      if (type === '별점낮은순') {
        setFilteredReview(memoLowest);
      }
      if (type === '최신순') {
        setFilteredReview(memoRecent);
      }
      if (type === '오래된순') {
        setFilteredReview(memoOld);
      }
    }
    currentReviewType.current = type; // 현재 정렬 타입 저장
  };

  const findMyReview = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const myReviews = filteredReview.filter((review) => review.is_mine);
      if (myReviews) setFilteredReview(myReviews);
      else setFilteredReview([]);
    } else filter(currentReviewType.current); // 토글 시 기존에 정렬된 상태의 값을 사용
  };

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
      {(filteredReview.length > 0 || checkboxRef.current?.checked)
      && (
      <div className={styles.selector}>
        <select
          onChange={(e) => filter(e.target.value)}
        >
          {option.map((select) => (
            <option
              key={select}
            >
              {select}
            </option>
          ))}
        </select>
        <label htmlFor="myReview">
          <input
            type="checkbox"
            id="myReview"
            onChange={findMyReview}
            ref={checkboxRef}
          />
          내가 리뷰 작성한 리뷰
        </label>
      </div>
      )}
      {filteredReview.length > 0
        ? filteredReview.map((review) => (
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
          />
        )) : (
          <div>
            {checkboxRef.current?.checked
              ? <div>작성한 리뷰가 없어요</div>
              : <NoReview />}
          </div>
        )}
      <div ref={endOfPage} />
    </div>
  );
}
