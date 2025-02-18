import PencilIcon from 'assets/svg/Articles/pencil.svg';
import { useArticlesLogger } from 'pages/Articles/hooks/useArticlesLogger';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import FoundIcon from 'assets/svg/Articles/found.svg';
import LostIcon from 'assets/svg/Articles/lost.svg';
import CloseIcon from 'assets/svg/Articles/close.svg';
// import useBooleanState from 'utils/hooks/state/useBooleanState';
import ROUTES from 'static/routes';
import styles from './LostItemRouteButton.module.scss';

export default function LostItemRouteButton() {
  const { logItemWriteClick } = useArticlesLogger();
  const [isWriting, setIsWriting] = useState(false);

  return (
    <div className={styles.links}>
      {isWriting && (
      <div className={styles['links__writing-options']}>
        <Link
          className={styles['links__option-button']}
          type="button"
          to={ROUTES.LostItemFound()}
          onClick={() => logItemWriteClick()}
        >
          <FoundIcon />
          <div className={styles['links__option-text']}>
            주인을 찾아요
          </div>
        </Link>

        <Link
          className={styles['links__option-button']}
          type="button"
          to={ROUTES.LostItemLost()} // 이 링크 아님 이거 임시임.
          onClick={() => logItemWriteClick()}
        >
          <LostIcon />
          <div className={styles['links__option-text']}>
            잃어버렸어요
          </div>
        </Link>
      </div>
      )}
      <button
        className={styles.links__write}
        type="button"
        onClick={() => setIsWriting((prev) => !prev)}
      >
        {/* {linksOpen ? <CloseIcon /> : <PencilIcon />} */}
        {isWriting ? <CloseIcon /> : <PencilIcon />}
        글쓰기
      </button>
    </div>
  );
}
