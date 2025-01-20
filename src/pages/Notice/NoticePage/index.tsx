import LoadingSpinner from 'components/common/LoadingSpinner';
import HotArticles from 'pages/Notice/components/HotArticle';
import PencilIcon from 'assets/svg/Notice/pencil.svg';
// import FoundIcon from 'assets/svg/Notice/found.svg';
// import LostIcon from 'assets/svg/Notice/lost.svg';
// import CloseIcon from 'assets/svg/Notice/close.svg';
import { Suspense } from 'react';
import { Link, Outlet } from 'react-router-dom';
import ROUTES from 'static/routes';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
// import useBooleanState from 'utils/hooks/state/useBooleanState';
import { useUser } from 'utils/hooks/state/useUser';
import styles from './NoticePage.module.scss';

export default function NoticePage() {
  // const [linksOpen, ,, toggleLinksOpen] = useBooleanState(false);
  useScrollToTop();
  const { data: userInfo } = useUser();
  const isCouncil = userInfo && userInfo.student_number === '2022136000';

  return (
    <div className={styles.template}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.header__title}>공지사항</h1>
          <div className={styles.links}>
            {isCouncil && (
              <>
                {/* {linksOpen && ( // 2차 스프린트
                  <>
                    <Link
                      to={ROUTES.LostItemFound()}
                      className={styles.links__button}
                    >
                      <FoundIcon />
                      주인을 찾아요
                    </Link>
                    <Link
                      to={ROUTES.LostItemLost()}
                      className={styles.links__button}
                    >
                      <LostIcon />
                      잃어버렸어요
                    </Link>
                  </>
                )}
                <button
                  className={styles.links__button}
                  type="button"
                  onClick={() => toggleLinksOpen()}
                > */}
                <Link
                  className={styles.links__button}
                  type="button"
                  to={ROUTES.LostItemFound()}
                >
                  {/* {linksOpen ? <CloseIcon /> : <PencilIcon />} */}
                  <PencilIcon />
                  글쓰기
                </Link>
              </>
            )}
          </div>
        </div>
        <Suspense fallback={<LoadingSpinner size="200px" />}>
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
