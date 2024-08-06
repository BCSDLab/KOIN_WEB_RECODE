import { useGetReview } from 'pages/Store/StoreDetailPage/hooks/useGetReview';
import { useParams } from 'react-router-dom';
import ReviewCard from 'pages/Store/StoreDetailPage/Review/components/ReviewCard/ReviewCard';
import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { Review } from 'api/store/entity';
import { ReactComponent as NoReview } from 'assets/svg/Review/no-review.svg';
import { ReactComponent as Arrow } from 'assets/svg/up-arrow-icon.svg';
import { Portal } from 'components/common/Modal/PortalProvider';
import LoginRequiredModal from 'components/common/LoginRequiredModal';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import StarList from 'pages/Store/StoreDetailPage/Review/components/StarList/StarList';
import { REVEIW_LOGIN } from 'pages/Store/StoreDetailPage/Review/components/ReviewButton/index';
import { useUser } from 'utils/hooks/state/useUser';
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
  const startReview = useRef(null);
  const reviews = data.pages.flatMap((page) => page.reviews);
  const currentReviewType = useRef<string>('최신순');
  const checkboxRef = useRef<HTMLInputElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);
  const [
    filteredReview,
    setFilteredReview] = useState([...reviews].sort((a, b) => check(b, a)));
  const [openDropdown, setOpenDropdowm] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const portalManager = useModalPortal();
  const { data: userInfo } = useUser();

  const checkUser = ():boolean => {
    if (!userInfo) {
      portalManager.open((portalOption: Portal) => (
        <LoginRequiredModal
          title={REVEIW_LOGIN[0]}
          description={REVEIW_LOGIN[1]}
          closeModal={portalOption.close}
        />
      ));
    }
    return !userInfo;
  };

  const filter = useCallback((type: string) => {
    if (!checkboxRef.current?.checked) {
      if (type === '별점높은순') {
        setFilteredReview([...reviews].sort((a, b) => b.rating - a.rating));
      }
      if (type === '별점낮은순') {
        setFilteredReview([...reviews].sort((a, b) => a.rating - b.rating));
      }
      if (type === '최신순') {
        setFilteredReview([...reviews].sort((a, b) => check(b, a)));
      }
      if (type === '오래된순') {
        setFilteredReview([...reviews].sort((a, b) => check(a, b)));
      }
    }
    currentReviewType.current = type; // 현재 정렬 타입 저장
  }, [reviews]);

  const findMyReview = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const myReviews = filteredReview.filter((review) => review.is_mine);
      if (myReviews) setFilteredReview(myReviews);
      else setFilteredReview([]);
    } else filter(currentReviewType.current); // 토글 시 기존에 정렬된 상태의 값을 사용
  };

  const getNextReview = useCallback((entries: IntersectionObserverEntry[]) => {
    if (hasNextPage && entries[0].isIntersecting) {
      fetchNextPage().then((result) => {
        const newListLength = result.data?.pages.length || 1;
        const newList = result.data?.pages[newListLength - 1].reviews || [];
        setFilteredReview((prev) => [...prev, ...newList]);
      });
    } // 다음 페이지가 있으면 패치
  }, [hasNextPage, fetchNextPage]);

  const setStickyMode = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0].boundingClientRect.top < 0) setIsSticky(true); // 옵저버가 지정한 top에 닿으면 조건부 렌더링
    else setIsSticky(false);
  }, []);

  useEffect(() => {
    const endObserver = new IntersectionObserver(getNextReview);
    const startObserver = new IntersectionObserver(setStickyMode);
    if (endOfPage.current) endObserver.observe(endOfPage.current);
    if (startReview.current) startObserver.observe(startReview.current);

    return () => {
      endObserver.disconnect();
      startObserver.disconnect();
    };
  }, [getNextReview, setStickyMode]);

  return (
    <div
      className={styles.container}
      onClick={(e) => {
        const { target } = e;
        if (target instanceof HTMLElement) {
          if (target.matches('button')) {
            if (checkUser()) return;
            setOpenDropdowm((prev) => !prev);
          } else {
            setOpenDropdowm(false);
          }
        }
      }}
      role="button"
      aria-hidden
    >
      <div ref={startReview} />
      {(filteredReview.length > 0 || checkboxRef.current?.checked)
      && (
        <div className={styles.selector} ref={selectorRef} style={{ background: isSticky ? '#fafafa' : 'white' }}>
          {
            isSticky
              ? (
                <div className={styles.point}>
                  <StarList average_rating={data.pages[0].statistics.average_rating} />
                  {`${data.pages[0].statistics.average_rating.toFixed()}점`}
                </div>
              )
              : (
                <button
                  type="button"
                  className={styles.dropdown}
                >
                  {currentReviewType.current}
                  {' '}
                  <Arrow style={{ transform: openDropdown ? '' : 'rotate(180deg)', transition: 'transform 0.15s' }} />
                  <div className={styles.wrapper}>
                    {openDropdown && (
                    <div className={styles.dropdown__list}>
                      {option.map((select) => (
                        <button
                          type="button"
                          key={select}
                          onClick={() => filter(select)}
                          className={styles['dropdown__list--item']}
                        >
                          {select}
                        </button>
                      ))}
                    </div>
                    )}
                  </div>
                </button>
              )
            }
          <label
            htmlFor="myReview"
            className={styles.selector__label}
          >
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
              ? <div className={styles['not-found']}>작성한 리뷰가 없어요 :)</div>
              : (
                <div className={styles['not-found']}>
                  <NoReview />
                </div>
              )}
          </div>
        )}
      <div ref={endOfPage} />
    </div>
  );
}
