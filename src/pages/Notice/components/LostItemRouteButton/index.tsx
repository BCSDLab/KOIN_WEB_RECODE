import PencilIcon from 'assets/svg/Notice/pencil.svg';
import { Link } from 'react-router-dom';
// import FoundIcon from 'assets/svg/Notice/found.svg';
// import LostIcon from 'assets/svg/Notice/lost.svg';
// import CloseIcon from 'assets/svg/Notice/close.svg';
// import useBooleanState from 'utils/hooks/state/useBooleanState';
import ROUTES from 'static/routes';
import styles from './LostItemRouteButton.module.scss';

export default function LostItemRouteButton() {
  return (
    <div className={styles.links}>
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
    </div>
  );
}
