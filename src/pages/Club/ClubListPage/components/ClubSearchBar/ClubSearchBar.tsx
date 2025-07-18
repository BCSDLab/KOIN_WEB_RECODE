import { useScrollLock } from 'utils/hooks/ui/useScrollLock';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useParamsHandler from 'utils/hooks/routing/useParamsHandler';
import ClubSearchBarModal from 'pages/Club/ClubListPage/components/ClubSearchBarModal/ClubSearchBarModal';
import MobileSearchIcon from 'assets/svg/mobile-store-search-icon.svg';
import styles from './ClubSearchBar.module.scss';

export default function ClubSearchBar() {
  const { searchParams } = useParamsHandler();
  const isMobile = useMediaQuery();
  const [isModalOpen, openModal, closeModal] = useBooleanState(false);
  const { lock, unlock } = useScrollLock(false);

  const handleOpenModal = () => {
    lock();
    openModal();
  };

  const handleCloseModal = () => {
    unlock();
    closeModal();
  };

  return (
    <div className={styles.search_bar}>
      <button
        className={styles.search_bar__input}
        type="button"
        onClick={() => {
          handleOpenModal();
        }}
      >
        {searchParams.get('clubName') || '검색어를 입력하세요'}
      </button>

      <button
        className={styles.search_bar__icon}
        type="button"
        onClick={handleOpenModal}
      >
        {isMobile ? (
          <div className={styles['search-icon']}>
            <MobileSearchIcon />
          </div>
        ) : (
          <img
            className={styles['search-icon']}
            src="https://static.koreatech.in/assets/img/search.png"
            alt="store_icon"
          />
        )}
      </button>
      {isModalOpen
      && <ClubSearchBarModal onClose={handleCloseModal} />}
    </div>
  );
}
