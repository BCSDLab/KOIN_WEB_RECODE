import { cn } from '@bcsdlab/utils';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import { Portal } from 'components/modal/Modal/PortalProvider';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useClubCategories from 'pages/Club/hooks/useClubCategories';
import useClubList from 'pages/Club/hooks/useClubList';
import useClubLike from 'pages/Club/hooks/useClubLike';
import { Selector } from 'components/ui/Selector';
import HeartOutline from 'assets/svg/Club/heart-outline-icon.svg';
import HeartFilled from 'assets/svg/Club/heart-filled-icon.svg';
import MikeIcon from 'assets/svg/Club/mike-icon.svg';
import ExerciseIcon from 'assets/svg/Club/exercise-icon.svg';
import HobbyIcon from 'assets/svg/Club/hobby-icon.svg';
import ReligionIcon from 'assets/svg/Club/religion-icon.svg';
import BookIcon from 'assets/svg/Club/book-icon.svg';
import ClubAuthModal from 'pages/Club/components/ClubAuthModal';
import styles from './ClubListPage.module.scss';

const DEFAULT_OPTION_INDEX = 0;

const SORT_OPTIONS = [
  { label: '생성순', value: 'NONE' },
  { label: '조회순', value: 'HITS_DESC' },
];

function ClubListPage() {
  const logger = useLogger();
  const portalManager = useModalPortal();
  const isMobile = useMediaQuery();
  const token = useTokenState();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const sortValue = searchParams.get('sort') ?? SORT_OPTIONS[DEFAULT_OPTION_INDEX].value;
  const selectedCategoryId = searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined;
  const clubCategories = useClubCategories();
  const clubList = useClubList({ token, categoryId: selectedCategoryId, hitSort: sortValue });
  const totalCount = clubList.length;
  const { mutate: clubLikeMutate } = useClubLike();

  const handleCreateClubClick = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_category: 'click',
      event_label: 'club_main_create',
      value: '생성하기',
    });
    navigate('/clubs/new');
  };

  const onChangeSort = (e: { target: { value: string } }) => {
    const changedSort = e.target.value;
    searchParams.set('sort', changedSort);
    setSearchParams(searchParams);
  };

  const handleCategoryClick = (name: string, id: number) => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_category: 'click',
      event_label: 'club_main_category',
      value: `${name}`,
    });
    const isSelected = selectedCategoryId === id;
    if (isSelected) {
      searchParams.delete('categoryId');
    } else {
      searchParams.set('categoryId', String(id));
    }
    setSearchParams(searchParams);
  };

  const handleCardClick = (name: string, id: number) => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_category: 'click',
      event_label: 'club_main_select',
      value: `${name}`,
    });
    navigate(`/clubs/${id}`);
  };

  const handleLikeClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    isLiked: boolean,
    clubId: number,
  ) => {
    e.stopPropagation();
    if (!token) {
      portalManager.open((portalOption: Portal) => (
        <ClubAuthModal
          closeModal={portalOption.close}
        />
      ));
      return;
    }
    clubLikeMutate({
      token,
      isLiked,
      clubId,
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.header__title}>동아리 목록</p>
          <button
            type="button"
            className={styles['header__add-button']}
            onClick={() => handleCreateClubClick()}
          >
            동아리 생성하기
          </button>
        </div>
        <main>
          <div className={styles.categories}>
            {!isMobile && <p className={styles.categories__label}>Category</p>}
            {clubCategories.map((category) => (
              <button
                className={cn({
                  [styles.categories__button]: true,
                  [styles['categories__button--selected']]: category.id === selectedCategoryId,
                })}
                key={category.id}
                type="button"
                onClick={() => handleCategoryClick(category.name, category.id)}
              >
                <div
                  className={cn({
                    [styles['categories__button-icon']]: true,
                    [styles['categories__button-icon--selected']]: category.id === selectedCategoryId,
                  })}
                >
                  {category.id === 1 && <MikeIcon />}
                  {category.id === 2 && <ExerciseIcon />}
                  {category.id === 3 && <HobbyIcon />}
                  {category.id === 4 && <ReligionIcon />}
                  {category.id === 5 && <BookIcon />}
                </div>
                {category.name}
              </button>
            ))}
          </div>
          <div className={styles.description}>
            <div className={styles.description__message}>
              총
              <strong>
                {' '}
                {totalCount}
                개
              </strong>
              의 동아리가 있습니다.
            </div>
            <div className={styles.description__dropdown}>
              <Selector
                isWhiteBackground={false}
                options={SORT_OPTIONS}
                value={sortValue}
                onChange={onChangeSort}
              />
            </div>
          </div>
          <div className={styles.card__list}>
            {clubList.map((club) => (
              <button
                type="button"
                key={club.id}
                className={styles.card}
                onClick={() => handleCardClick(club.name, club.id)}
              >
                <div className={styles.card__info}>
                  <div className={styles['card__info-header']}>
                    <p className={styles['card__info-title']}>{club.name}</p>
                    <p className={styles['card__info-category']}>{club.category}</p>
                  </div>
                  <div className={styles['card__info-likes']}>
                    <button
                      type="button"
                      onClick={(e) => handleLikeClick(e, club.isLiked, club.id)}
                    >
                      {club.isLiked ? <HeartFilled /> : <HeartOutline />}
                    </button>
                    <p>{club.likes}</p>
                  </div>
                </div>
                <img
                  className={styles.card__logo}
                  src={club.imageUrl}
                  alt={club.name}
                />
              </button>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default ClubListPage;
