import { useGetReview } from 'pages/Store/StoreDetailPage/hooks/useGetReview';
import { useParams } from 'react-router-dom';
import ReviewCard from 'pages/Store/StoreDetailPage/Review/components/ReviewCard/ReviewCard';
import {
  useCallback, useDeferredValue, useEffect, useRef, useState,
} from 'react';
import { ReactComponent as NoReview } from 'assets/svg/Review/no-review.svg';
import { ReactComponent as Arrow } from 'assets/svg/up-arrow-icon.svg';
import { Portal } from 'components/common/Modal/PortalProvider';
import LoginRequiredModal from 'components/common/LoginRequiredModal';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import StarList from 'pages/Store/StoreDetailPage/Review/components/StarList/StarList';
import { REVEIW_LOGIN } from 'pages/Store/StoreDetailPage/Review/components/ReviewButton/index';
import { useUser } from 'utils/hooks/state/useUser';
import { useGetMyReview } from 'pages/Store/StoreDetailPage/hooks/useGetMyReview';
import { useDropdown } from 'pages/Store/StoreDetailPage/hooks/useDropdown';
import styles from './ReviewList.module.scss';

const option = ['최신순', '오래된순', '별점낮은순', '별점높은순'] as const;

const sortType = {
  최신순: 'LATEST',
  오래된순: 'OLDEST',
  별점높은순: 'HIGHEST_RATING',
  별점낮은순: 'LOWEST_RATING',
};

export default function ReviewList() {
  const param = useParams();
  const endOfPage = useRef(null);
  const startReview = useRef(null);
  const currentReviewType = useRef<string>('최신순');
  const [currentSortType, setCurrentSortType] = useState(sortType.최신순);
  const previousSortType = useDeferredValue(currentSortType);
  const {
    data, hasNextPage, fetchNextPage,
  } = useGetReview(Number(param.id), previousSortType);
  const reviews = data.pages.flatMap((page) => page.reviews);
  const { data: myReview } = useGetMyReview(param.id!, previousSortType);
  const [isCheckboxClicked, setIsCheckboxClicked] = useState<boolean>(false);
  const selectorRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const portalManager = useModalPortal();
  const { data: userInfo } = useUser();
  const { openDropdown, toggleDropdown, closeDropdown } = useDropdown();

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

  const getNextReview = useCallback((entries: IntersectionObserverEntry[]) => {
    if (hasNextPage && entries[0].isIntersecting) {
      fetchNextPage();
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
            toggleDropdown('sort');
          } else {
            closeDropdown();
          }
        }
      }}
      role="button"
      aria-hidden
    >
      <div ref={startReview} />
      {(reviews.length > 0 || isCheckboxClicked)
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
                  <Arrow style={{ transform: openDropdown === 'sort' ? 'rotate(180deg)' : '', transition: 'transform 0.15s' }} />
                  <div className={styles.wrapper}>
                    {openDropdown === 'sort' && (
                    <div className={styles.dropdown__list}>
                      {option.map((select) => (
                        <button
                          type="button"
                          key={select}
                          onClick={() => {
                            setCurrentSortType(sortType[select]);
                            currentReviewType.current = select;
                          }}
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
              checked={isCheckboxClicked}
              onChange={() => {
                if (checkUser()) setIsCheckboxClicked(false);
                else setIsCheckboxClicked((prev) => !prev);
              }}
            />
            내가 작성한 리뷰
          </label>
        </div>
      )}
      {isCheckboxClicked && myReview && (
        myReview.reviews.length > 0 ? (myReview.reviews.map((mine) => (
          <ReviewCard
            review_id={mine.review_id}
            rating={mine.rating}
            nick_name={mine.nick_name}
            content={mine.content}
            image_urls={mine.image_urls}
            menu_names={mine.menu_names}
            is_mine={mine.is_mine}
            is_modified={mine.is_modified}
            created_at={mine.created_at}
            key={mine.review_id}
          />
        ))) : (
          <div className={styles['not-found']}>
            <NoReview />
          </div>
        )
      )}
      {!isCheckboxClicked
      && (reviews.length > 0 ? reviews.map((review) => (
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
        <div className={styles['not-found']}>
          <NoReview />
        </div>
      ))}
      <div ref={endOfPage} />
    </div>
  );
}
