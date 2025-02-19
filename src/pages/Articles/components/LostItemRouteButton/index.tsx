import PencilIcon from 'assets/svg/Articles/pencil.svg';
import { useArticlesLogger } from 'pages/Articles/hooks/useArticlesLogger';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import FoundIcon from 'assets/svg/Articles/found.svg';
import LostIcon from 'assets/svg/Articles/lost.svg';
import CloseIcon from 'assets/svg/Articles/close.svg';
import ROUTES from 'static/routes';
import styles from './LostItemRouteButton.module.scss';

export default function LostItemRouteButton() {
  const { logItemWriteClick } = useArticlesLogger();
  const [isWriting, setIsWriting] = useState(false);

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
              to={ROUTES.LostItemFound()}
              onClick={() => logItemWriteClick()}

            >
              <FoundIcon />
              <div className={styles['links__option-text']}>주인을 찾아요</div>
            </Link>

            <Link
              className={styles['links__option-button']}
              to={ROUTES.LostItemLost()}
              onClick={() => logItemWriteClick()}

            >
              <LostIcon />
              <div className={styles['links__option-text']}>잃어버렸어요</div>
            </Link>
          </div>
        )}

        <button
          className={styles.links__write}
          type="button"
          onClick={() => setIsWriting((prev) => !prev)}
        >
          {isWriting ? <CloseIcon /> : <PencilIcon />}
          글쓰기
        </button>
      </div>
    </>
  );
}
