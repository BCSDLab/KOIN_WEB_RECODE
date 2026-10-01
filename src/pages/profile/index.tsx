import type { ComponentType, ReactNode, SVGProps } from 'react';
import { Suspense } from 'react';
import type { InferGetServerSidePropsType } from 'next';
import Link from 'next/link';

import { isKoinError } from '@bcsdlab/koin';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { authQueries } from 'api/auth/queries';
import type { Semester } from 'api/timetable/entity';
import { createDefaultTimetableFrameList, timetableQueries, timetableQueryKeys } from 'api/timetable/queries';
import LoginIcon from 'assets/svg/common/login-icon.svg';
import LogoutIcon from 'assets/svg/common/logout-icon.svg';
import SettingIcon from 'assets/svg/common/setting-icon.svg';
import UserIcon from 'assets/svg/common/user-2-icon.svg';
import AuthenticateUserModal from 'components/AuthenticateUserModal';
import HomeLayout from 'components/layout/HomeLayout';
import { LoggedInTimetablePreview, ProfileTimetableGrid } from 'components/ProfilePage/TimetablePreview';
import IconBox from 'components/ui/IconBox';
import ROUTES from 'static/routes';
import { TIMETABLE_SEMESTER_COOKIE_KEY } from 'static/url';
import useLogger from 'utils/hooks/analytics/useLogger';
import { useLogout } from 'utils/hooks/auth/useLogout';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { useUser } from 'utils/hooks/state/useUser';
import { isServerAuthError } from 'utils/ssr/authError';
import { withCacheControl } from 'utils/ssr/withCacheControl';
import { getRecentSemester, isSemesterInList } from 'utils/timetable/semester';
import { parseSemesterCookie } from 'utils/timetable/semesterCookie';
import { isStudentUser } from 'utils/ts/userTypeGuards';

import styles from './ProfilePage.module.scss';

// 프로필은 로그인 여부·사용자 정보·시간표가 화면의 전부다. 서버가 모르면 클라이언트가
// 비로그인 화면 → 로그인 화면 → 시간표 채움 순으로 다시 그리게 되므로 전부 서버에서 확정한다.
export const getServerSideProps = withCacheControl(async (context, cacheControl, serverRequest) => {
  const queryClient = new QueryClient();
  const { isLoggedIn, userType } = serverRequest;

  if (!isLoggedIn) {
    // 공용 캐시에 저장되는 응답이므로 학기 쿠키 같은 방문자별 값은 읽지 않는다. 비로그인은 시간표를 그리지 않는다.
    queryClient.setQueryData(authQueries.userInfo(false, userType).queryKey, null);
    cacheControl.enablePublicCache();

    return {
      props: {
        serverSemester: getRecentSemester(),
        hasSemesterCookie: false,
        dehydratedState: dehydrate(queryClient),
      },
    };
  }

  // 사용자가 시간표에서 고른 학기. 스토어(localStorage)가 원본이고 쿠키는 서버용 사본이다.
  const cookieSemester = parseSemesterCookie(context.req.cookies[TIMETABLE_SEMESTER_COOKIE_KEY]);
  let serverSemester: Semester = cookieSemester ?? getRecentSemester();

  const setDefaultTimetableFrameList = () => {
    queryClient.setQueryData(
      timetableQueryKeys.frameList(serverSemester, isLoggedIn),
      createDefaultTimetableFrameList(),
    );
  };

  const prefetchTimetable = async () => {
    try {
      // 학생이 아니면 클라이언트 훅도 내 학기 조회 없이 null을 쓴다.
      if (userType !== 'STUDENT') queryClient.setQueryData(timetableQueryKeys.mySemester(isLoggedIn), null);
      const [allSemesters, mySemester] = await Promise.all([
        queryClient.fetchQuery(timetableQueries.semesterInfo()),
        userType === 'STUDENT' ? queryClient.fetchQuery(timetableQueries.mySemester(isLoggedIn, { userType })) : null,
      ]);

      // useResetInvalidSemester와 같은 규칙: 고른 학기가 선택 가능한 목록에 없으면 목록의 첫 학기로 되돌린다.
      const semesterList = mySemester?.semesters ?? allSemesters ?? [];
      if (
        semesterList.length > 0 &&
        !isSemesterInList(
          semesterList.map((value) => ({ value })),
          serverSemester,
        )
      ) {
        [serverSemester] = semesterList;
      }

      if (userType !== 'STUDENT' || !mySemester?.semesters.length) {
        setDefaultTimetableFrameList();

        return;
      }

      const frameList = await queryClient.fetchQuery(
        timetableQueries.frameList(isLoggedIn, serverSemester, { userType }),
      );
      const mainFrameId = frameList.find((frame) => frame.is_main)?.id;
      if (typeof mainFrameId === 'number') {
        await queryClient.prefetchQuery(timetableQueries.lectureInfo(isLoggedIn, mainFrameId));
      }
    } catch (error) {
      if (!isServerAuthError(error) && !(isKoinError(error) && (error.status === 403 || error.status === 404))) {
        throw error;
      }
      // 시간표를 못 불러와도 프로필 자체는 보여준다. 빈 그리드로 확정한다.
      if (queryClient.getQueryData(timetableQueryKeys.mySemester(isLoggedIn)) === undefined) {
        queryClient.setQueryData(timetableQueryKeys.mySemester(isLoggedIn), null);
      }
      setDefaultTimetableFrameList();
    }
  };

  await Promise.all([
    // useUser는 userType으로 조회 엔드포인트를 고르므로 같은 userType으로 키를 맞춘다.
    queryClient.prefetchQuery(authQueries.userInfo(true, userType)),
    prefetchTimetable(),
  ]);

  return {
    props: {
      serverSemester,
      hasSemesterCookie: cookieSemester !== null,
      dehydratedState: dehydrate(queryClient),
    },
  };
});

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

interface LinkProfileMenuItem {
  type: 'link';
  title: string;
  href: string;
  Icon: IconComponent;
}

interface ButtonProfileMenuItem {
  type: 'button';
  action: 'logout' | 'setting';
  title: string;
  Icon: IconComponent;
}

type ProfileMenuItem = LinkProfileMenuItem | ButtonProfileMenuItem;

const getProfileMenus = (isLoggedIn: boolean): ProfileMenuItem[] => [
  isLoggedIn
    ? {
        type: 'button',
        action: 'logout',
        title: '로그아웃',
        Icon: LogoutIcon,
      }
    : {
        type: 'link',
        title: '로그인',
        href: ROUTES.Auth(),
        Icon: LoginIcon,
      },
  isLoggedIn
    ? {
        type: 'button',
        action: 'setting',
        title: '설정',
        Icon: SettingIcon,
      }
    : {
        type: 'link',
        title: '설정',
        href: ROUTES.Auth(),
        Icon: SettingIcon,
      },
];

interface TimetablePreviewProps {
  isLoggedIn: boolean;
  serverSemester: Semester;
  hasSemesterCookie: boolean;
}

function TimetablePreview({ isLoggedIn, serverSemester, hasSemesterCookie }: TimetablePreviewProps) {
  const logger = useLogger();

  return (
    <section className={styles.timetable}>
      <Link
        href={ROUTES.Timetable()}
        className={styles.timetable__link}
        onClick={() => logger.actionEventClick({ team: 'CAMPUS', event_label: 'home_timetable', value: '내 시간표' })}
      >
        <h2 className={styles.timetable__title}>내 시간표</h2>
        <div className={styles.timetable__board}>
          {isLoggedIn ? (
            <LoggedInTimetablePreview serverSemester={serverSemester} hasSemesterCookie={hasSemesterCookie} />
          ) : (
            <ProfileTimetableGrid />
          )}
        </div>
      </Link>
    </section>
  );
}

interface ProfileMenuProps {
  title: string;
  actions: ProfileMenuItem[];
  onLogout: () => void;
  onOpenAuthModal: () => void;
  onActionClick: (action: ProfileMenuItem) => void;
  subtitle?: string;
}

function ProfileMenu({ title, actions, onLogout, onOpenAuthModal, onActionClick, subtitle }: ProfileMenuProps) {
  const getButtonAction = (action: ButtonProfileMenuItem) => {
    if (action.action === 'setting') return onOpenAuthModal;

    return onLogout;
  };

  return (
    <section className={styles['profile-menu']}>
      <div className={styles['profile-menu__user']}>
        <div className={styles['profile-menu__userIcon']}>
          <UserIcon />
        </div>
        {/* sentry-mask: Session Replay에서 이름/학번·아이디를 가리기 위한 Sentry 기본 마스킹 클래스 */}
        <div className={`${styles['profile-menu__userText']} sentry-mask`}>
          <h1 className={styles['profile-menu__title']}>{title}</h1>
          {subtitle && <p className={styles['profile-menu__userMeta']}>{subtitle}</p>}
        </div>
      </div>
      <ul className={styles['profile-menu__actions']}>
        {actions.map((action) => {
          const Icon = action.Icon;

          return (
            <li key={action.title}>
              {action.type === 'link' ? (
                <Link
                  href={action.href}
                  className={styles['profile-menu__action']}
                  onClick={() => onActionClick(action)}
                >
                  <IconBox>
                    <Icon />
                  </IconBox>
                  <span className={styles['profile-menu__actionLabel']}>{action.title}</span>
                </Link>
              ) : (
                <button
                  type="button"
                  className={styles['profile-menu__action']}
                  onClick={() => {
                    onActionClick(action);
                    getButtonAction(action)();
                  }}
                >
                  <IconBox>
                    <Icon />
                  </IconBox>
                  <span className={styles['profile-menu__actionLabel']}>{action.title}</span>
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function ProfilePageContent({ serverSemester, hasSemesterCookie }: Omit<TimetablePreviewProps, 'isLoggedIn'>) {
  const { data: userInfo } = useUser();
  const logout = useLogout();
  const logger = useLogger();

  const [isModalOpen, openModal, closeModal] = useBooleanState(false);

  const isLoggedIn = !!userInfo;
  const isStudent = isStudentUser(userInfo);
  const userName = userInfo?.nickname?.trim() || userInfo?.name?.trim();
  const title = isLoggedIn ? userName || '정보를 입력해주세요.' : '로그인을 해주세요.';
  const subtitle = isStudent ? userInfo.student_number || '학번 정보 없음' : userInfo?.login_id;
  const actions = getProfileMenus(isLoggedIn);
  const getProfileMenuEventLabel = (actionTitle: string) => {
    if (actionTitle === '로그인') return 'home_login';
    if (actionTitle === '로그아웃') return 'home_logout';

    return 'home_settings';
  };

  const handleProfileMenuActionClick = (action: ProfileMenuItem) => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: getProfileMenuEventLabel(action.title),
      value: action.title,
    });
  };

  return (
    <>
      <main className={styles.profile}>
        <ProfileMenu
          title={title}
          actions={actions}
          onLogout={logout}
          onOpenAuthModal={openModal}
          onActionClick={handleProfileMenuActionClick}
          subtitle={isLoggedIn ? subtitle : undefined}
        />
        <TimetablePreview
          isLoggedIn={isLoggedIn}
          serverSemester={serverSemester}
          hasSemesterCookie={hasSemesterCookie}
        />
      </main>
      {isModalOpen && <AuthenticateUserModal onClose={closeModal} />}
    </>
  );
}

function ProfilePage({ serverSemester, hasSemesterCookie }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // 사용자 정보는 서버가 프리페치하므로 SSR에서도 바로 그려진다. Suspense는 프리페치 실패 대비용.
  return (
    <Suspense fallback={null}>
      <ProfilePageContent serverSemester={serverSemester} hasSemesterCookie={hasSemesterCookie} />
    </Suspense>
  );
}

ProfilePage.getLayout = (page: ReactNode) => <HomeLayout>{page}</HomeLayout>;

export default ProfilePage;
