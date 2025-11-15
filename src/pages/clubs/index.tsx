import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { cn } from '@bcsdlab/utils';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { club } from 'api';
import BookIcon from 'assets/svg/Club/book-icon.svg';
import ExerciseIcon from 'assets/svg/Club/exercise-icon.svg';
import HeartFilled from 'assets/svg/Club/heart-filled-icon.svg';
import HeartOutline from 'assets/svg/Club/heart-outline-icon.svg';
import HobbyIcon from 'assets/svg/Club/hobby-icon.svg';
import MikeIcon from 'assets/svg/Club/mike-icon.svg';
import ReligionIcon from 'assets/svg/Club/religion-icon.svg';
import ClubSearchContainer from 'components/Club/ClubListPage/components/ClubSearchContainer';
import useClubCategories from 'components/Club/hooks/useClubCategories';
import useClubLike from 'components/Club/hooks/useClubLike';
import useClubList from 'components/Club/hooks/useClubList';
import { SSRLayout } from 'components/layout';
import LoginRequiredModal from 'components/modal/LoginRequiredModal';
import { Portal } from 'components/modal/Modal/PortalProvider';
import { Selector } from 'components/ui/Selector';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import useParamsHandler from 'utils/hooks/routing/useParamsHandler';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useTokenState from 'utils/hooks/state/useTokenState';
import styles from './ClubListPage.module.scss';

const DEFAULT_OPTION_INDEX = 0;

const RECRUITING_SORT_OPTIONS = [
  { label: '모집 글 생성순', value: 'RECRUITMENT_UPDATED_DESC' },
  { label: '모집 마감 순', value: 'RECRUITING_DEADLINE_ASC' },
];

const DEFAULT_SORT_OPTIONS = [
  { label: '생성순', value: 'CREATED_AT_ASC' },
  { label: '조회순', value: 'HITS_DESC' },
];

const getDDayLabel = (dday: number) => (dday === 0 ? 'D-Day' : `D-${dday}`);

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { query, req } = context;

  const clubName = query.clubName ? String(query.clubName) : '';
  const sortType = query.sortType ? String(query.sortType) : DEFAULT_SORT_OPTIONS[DEFAULT_OPTION_INDEX].value;
  const categoryId = query.categoryId ? Number(query.categoryId) : null;
  const isRecruiting = query.isRecruiting === 'true';

  const token = req.cookies['AUTH_TOKEN_KEY'] || '';

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['club-categories'],
      queryFn: () => club.getClubCategories(),
    }),
    queryClient.prefetchQuery({
      queryKey: ['club-list', categoryId, sortType, isRecruiting, clubName],
      queryFn: () => club.getClubList(token, categoryId ?? undefined, sortType, isRecruiting, clubName),
    }),
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      initialQuery: {
        clubName,
        categoryId,
        sortType,
        isRecruiting,
      },
      serverToken: token,
    },
  };
};

function ClubListPage({ initialQuery, serverToken }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const logger = useLogger();
  const clientToken = useTokenState();
  const router = useRouter();
  const navigate = (path: string) => {
    router.push(path);
  };
  const isMobile = useMediaQuery();
  const portalManager = useModalPortal();

  const token = clientToken ?? serverToken ?? null;

  const { searchParams, setParams: setSearchParams } = useParamsHandler();

  const clubName = searchParams.get('clubName') ?? initialQuery.clubName ?? '';
  const isRecruitingParam = searchParams.get('isRecruiting') === 'true' ? true : initialQuery.isRecruiting;
  const sortValue =
    searchParams.get('sortType') ?? initialQuery.sortType ?? DEFAULT_SORT_OPTIONS[DEFAULT_OPTION_INDEX].value;
  const selectedCategoryId = searchParams.get('categoryId')
    ? Number(searchParams.get('categoryId'))
    : (initialQuery.categoryId ?? undefined);

  const clubCategories = useClubCategories();
  const { mutate: clubLikeMutate } = useClubLike();
  const clubList = useClubList({
    token,
    categoryId: selectedCategoryId,
    sortType: sortValue,
    isRecruiting: isRecruitingParam,
    clubName: clubName,
  });

  const totalCount = clubList.length;
  const [isAuthModalOpen, openAuthModal, closeAuthModal] = useBooleanState(false);

  const handleCreateClubClick = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'club_main_create',
      value: '생성하기',
    });
    if (!token) {
      openAuthModal();
    } else {
      navigate('/clubs/new');
    }
  };

  const onChangeSort = (e: { target: { value: string } }) => {
    const changedSort = e.target.value;

    if (changedSort === 'RECRUITMENT_UPDATED_DESC' || changedSort === 'RECRUITING_DEADLINE_ASC') {
      searchParams.set('isRecruiting', 'true');
    }

    setSearchParams({ sortType: changedSort }, { replacePage: true });
  };

  const handleRecruitmentFilterToggle = () => {
    const next = !isRecruitingParam;

    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'club_main_recruiting_toggle',
      value: next ? 'on' : 'off',
    });
    if (!next && (sortValue === 'RECRUITMENT_UPDATED_DESC' || sortValue === 'RECRUITING_DEADLINE_ASC')) {
      setSearchParams({ sortType: 'CREATED_AT_ASC' });
    }

    if (next) {
      setSearchParams({ isRecruiting: 'true', sortType: 'RECRUITMENT_UPDATED_DESC' });
    } else {
      setSearchParams({ isRecruiting: undefined, sortType: 'CREATED_AT_ASC' });
    }
  };

  const handleCategoryClick = (name: string, id: number) => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'club_main_category',
      value: `${name}`,
    });
    const isSelected = selectedCategoryId === id;

    if (isSelected) {
      setSearchParams({ categoryId: '' });
    } else {
      setSearchParams({ categoryId: String(id) });
    }
  };

  const handleCardClick = (name: string, id: number) => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'club_main_select',
      value: `${name}`,
    });
    navigate(`/clubs/${id}`);
  };

  const handleLikeClick = (e: React.MouseEvent<HTMLButtonElement>, isLiked: boolean, clubId: number, name: string) => {
    e.stopPropagation();
    if (!token) {
      portalManager.open((portalOption: Portal) => (
        <LoginRequiredModal
          title="좋아요 기능을 사용하기"
          description="동아리 좋아요 기능은 로그인이 필요한 서비스입니다."
          onClose={portalOption.close}
        />
      ));
      return;
    }
    if (isLiked) {
      logger.actionEventClick({
        team: 'CAMPUS',
        event_label: 'club_main_like_cancel',
        value: name,
      });
    } else {
      logger.actionEventClick({
        team: 'CAMPUS',
        event_label: 'club_main_like',
        value: name,
      });
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
          <button type="button" className={styles['header__add-button']} onClick={() => handleCreateClubClick()}>
            동아리 생성하기
          </button>
        </div>
        <main className={styles.main}>
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
                  {category.name === '공연' && <MikeIcon />}
                  {category.name === '운동' && <ExerciseIcon />}
                  {category.name === '종교' && <ReligionIcon />}
                  {category.name === '취미' && <HobbyIcon />}
                  {category.name === '학술' && <BookIcon />}
                </div>
                {category.name}
              </button>
            ))}
          </div>
          <ClubSearchContainer />
          <div className={styles.description}>
            <div className={styles.description__message}>
              총<strong> {totalCount}개</strong>의 동아리가 있습니다.
            </div>
            <div className={styles.description__filter}>
              {!isMobile && (
                <div className={styles.filter}>
                  모집 중인 동아리
                  <button
                    type="button"
                    className={cn({
                      [styles.filter__button]: true,
                      [styles['filter__button--active']]: isRecruitingParam,
                    })}
                    onClick={handleRecruitmentFilterToggle}
                    aria-label={isRecruitingParam ? '모집 중인 동아리 필터 해제' : '모집 중인 동아리 필터 적용'}
                  />
                </div>
              )}
              <div className={styles.description__dropdown}>
                <Selector
                  isWhiteBackground={false}
                  options={isRecruitingParam ? RECRUITING_SORT_OPTIONS : DEFAULT_SORT_OPTIONS}
                  value={sortValue}
                  onChange={onChangeSort}
                />
              </div>
            </div>
          </div>
          <div className={styles.filter__container}>
            {isMobile && (
              <div className={styles.filter}>
                모집 중인 동아리
                <button
                  type="button"
                  className={cn({
                    [styles.filter__button]: true,
                    [styles['filter__button--active']]: isRecruitingParam,
                  })}
                  onClick={handleRecruitmentFilterToggle}
                  aria-label={isRecruitingParam ? '모집 중인 동아리 필터 해제' : '모집 중인 동아리 필터 적용'}
                />
              </div>
            )}
          </div>
          <div className={styles.card__list}>
            {clubList.map((club) => (
              <div
                role="button"
                tabIndex={0}
                key={club.id}
                className={styles.card}
                onKeyDown={() => handleCardClick(club.name, club.id)}
                onClick={() => handleCardClick(club.name, club.id)}
              >
                <div className={styles.card__info}>
                  <div className={styles['card__info-header']}>
                    <div className={styles['card__info-header__title-box']}>
                      <p className={styles['card__info-title']}>{club.name}</p>
                      {!(club.recruitment_info.status === 'NONE') && (
                        <div className={styles['card__info-recruitment']}>
                          {club.recruitment_info.status === 'RECRUITING' && (
                            <span className={styles['card__info-recruitment--recruiting']}>
                              {getDDayLabel(club.recruitment_info.dday)}
                            </span>
                          )}
                          {club.recruitment_info.status === 'ALWAYS' && (
                            <span className={styles['card__info-recruitment--always']}>상시 모집</span>
                          )}
                          {club.recruitment_info.status === 'BEFORE' && (
                            <span className={styles['card__info-recruitment--before']}>모집 예정</span>
                          )}
                          {club.recruitment_info.status === 'CLOSED' && (
                            <span className={styles['card__info-recruitment--closed']}>마감</span>
                          )}
                        </div>
                      )}
                    </div>
                    <p className={styles['card__info-category']}>{club.category}</p>
                  </div>
                  <div className={styles['card__info-likes']}>
                    <button type="button" onClick={(e) => handleLikeClick(e, club.is_liked, club.id, club.name)}>
                      {club.is_liked ? <HeartFilled /> : <HeartOutline />}
                    </button>
                    <p>{!club.is_like_hidden && club.likes}</p>
                  </div>
                </div>
                <Image className={styles.card__logo} src={club.image_url} alt={club.name} width={160} height={160} />
              </div>
            ))}
          </div>
        </main>
      </div>
      {isAuthModalOpen && (
        <LoginRequiredModal title="동아리를 생성하기" description="로그인 후 이용해주세요." onClose={closeAuthModal} />
      )}
    </div>
  );
}

export default ClubListPage;

ClubListPage.getLayout = (page: React.ReactElement) => <SSRLayout>{page}</SSRLayout>;
