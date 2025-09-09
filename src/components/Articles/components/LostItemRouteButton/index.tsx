import PencilIcon from 'assets/svg/Articles/pencil.svg';
import { useArticlesLogger } from 'components/Articles/hooks/useArticlesLogger';
import { useState } from 'react';
import { useUser } from 'utils/hooks/state/useUser';
import FoundIcon from 'assets/svg/Articles/found.svg';
import LostIcon from 'assets/svg/Articles/lost.svg';
import CloseIcon from 'assets/svg/Articles/close.svg';
import ROUTES from 'static/routes';
import LoginRequireLostItemModal from 'components/Articles/LostItemDetailPage/components/LoginRequireLostItemModal';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './LostItemRouteButton.module.scss';

export default function LostItemRouteButton() {
  const { logItemWriteClick, logFindUserWriteClick, logLostItemWriteClick } = useArticlesLogger();
  const [isWriting, setIsWriting] = useState(false);
  const router = useRouter();
  const { pathname } = router;
  const portalManager = useModalPortal();
  const { data: userInfo } = useUser();

  const handleWritingButtonClick = () => {
    if (userInfo) {
      setIsWriting((prev) => !prev);
      if (!isWriting) {
        logItemWriteClick();
      }
    } else {
      portalManager.open((portalOption) => (
        <LoginRequireLostItemModal
          actionTitle="게시글을 작성하려면"
          detailExplanation="로그인 후 분실물 주인을 찾아주세요!"
          onClose={portalOption.close}
        />
      ));
    }
  };

  return (
    <>
      {isWriting && (
      <div
        className={styles.overlay}
        role="button"
        tabIndex={0}
        aria-label="오버레이"
        onClick={() => setIsWriting(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsWriting(false);
          }
        }}
      />
      )}
      <div className={`${styles.links} ${isWriting ? styles['links--active'] : ''}`}>
        {isWriting && (
          <div className={styles['links__writing-options']}>
            <Link
              className={styles['links__option-button']}
              href={ROUTES.LostItemFound()}
              onClick={() => logFindUserWriteClick()}
            >
              <FoundIcon />
              <div className={styles['links__option-text']}>주인을 찾아요</div>
            </Link>

            <Link
              className={styles['links__option-button']}
              href={ROUTES.LostItemLost()}
              onClick={() => logLostItemWriteClick()}
            >
              <LostIcon />
              <div className={styles['links__option-text']}>잃어버렸어요</div>
            </Link>
          </div>
        )}

        {pathname.endsWith('articles') && (
          <button
            className={styles.links__write}
            type="button"
            onClick={handleWritingButtonClick}
          >
            {isWriting ? <CloseIcon /> : <PencilIcon />}
            글쓰기
          </button>
        ) }
      </div>
    </>
  );
}
