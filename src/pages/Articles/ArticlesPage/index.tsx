import LoadingSpinner from 'components/common/LoadingSpinner';
import HotArticles from 'pages/Articles/components/HotArticle';
import { useState, Suspense } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import { useUser } from 'utils/hooks/state/useUser';
import LostItemRouteButton from 'pages/Articles/components/LostItemRouteButton';
import ROUTES from 'static/routes';
import WriteIcon from 'assets/svg/Articles/write.svg';
import CloseIcon from 'assets/svg/Articles/close.svg';
import Found from 'assets/svg/Articles/found.svg';
import Lost from 'assets/svg/Articles/lost.svg';
import styles from './ArticlesPage.module.scss';

export default function ArticlesPage() {
  useScrollToTop();
  const { pathname } = useLocation();
  const isBoard = pathname.endsWith(ROUTES.Articles());
  const { data: userInfo } = useUser();
  const isCouncil = userInfo && userInfo.student_number === '2022136000';

  const [isWriting, setIsWriting] = useState(false);

  return (
    <div className={styles.template}>
      <div className={styles.content}>
        <div className={styles.header}>
          <Link to={ROUTES.Articles()}>
            <h1 className={styles.header__title}>공지사항</h1>
          </Link>
          <div />

          <div className={styles.header__container}>
            {isWriting && (
              <div className={styles['header__writing-options']}>
                <button
                  className={styles['header__option-button']}
                  type="button"
                  aria-label="주인을 찾아요 버튼"
                  onClick={() => alert('주인을 찾아요 페이지로 이동')}
                >
                  <Found />
                  <div className={styles['header__option-text']}>주인을 찾아요</div>
                </button>
                <button
                  className={styles['header__option-button']}
                  type="button"
                  aria-label="잃어버렸어요 버튼"
                  onClick={() => alert('잃어버렸어요 페이지로 이동')}
                >
                  <Lost />
                  <div className={styles['header__option-text']}>
                    잃어버렸어요
                  </div>
                </button>
              </div>
            )}

            <button
              className={styles['header__button-container']}
              type="button"
              aria-label="글쓰기 버튼"
              onClick={() => setIsWriting((prev) => !prev)}
            >
              {isWriting ? <CloseIcon /> : <WriteIcon />}
              <div className={styles['header__button-context']}>글쓰기</div>
            </button>
          </div>

          {isBoard && isCouncil && <LostItemRouteButton />}
        </div>
        <Suspense fallback={<LoadingSpinner size="150px" />}>
          <Outlet />
        </Suspense>
      </div>
      <div className={styles.aside}>
        <Suspense fallback={<LoadingSpinner size="80px" />}>
          <HotArticles />
        </Suspense>
      </div>
    </div>
  );
}
