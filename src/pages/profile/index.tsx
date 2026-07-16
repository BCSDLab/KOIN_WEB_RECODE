import type { ComponentType, ReactNode, SVGProps } from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import LoginIcon from 'assets/svg/common/login-icon.svg';
import LogoutIcon from 'assets/svg/common/logout-icon.svg';
import SettingIcon from 'assets/svg/common/setting-icon.svg';
import UserIcon from 'assets/svg/common/user-2-icon.svg';
import AuthenticateUserModal from 'components/AuthenticateUserModal';
import HomeLayout from 'components/layout/HomeLayout';
import { LoggedInTimetablePreview, ProfileTimetableGrid } from 'components/ProfilePage/TimetablePreview';
import IconBox from 'components/ui/IconBox';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import { useLogout } from 'utils/hooks/auth/useLogout';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { useUser } from 'utils/hooks/state/useUser';
import { isStudentUser } from 'utils/ts/userTypeGuards';
import styles from './ProfilePage.module.scss';

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type LinkProfileMenuItem = {
  type: 'link';
  title: string;
  href: string;
  Icon: IconComponent;
};

type ButtonProfileMenuItem = {
  type: 'button';
  action: 'logout' | 'setting';
  title: string;
  Icon: IconComponent;
};

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

function TimetablePreview({ isLoggedIn }: { isLoggedIn: boolean }) {
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
          {isLoggedIn ? <LoggedInTimetablePreview /> : <ProfileTimetableGrid />}
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
    <section className={styles.profileMenu}>
      <div className={styles.profileMenu__user}>
        <div className={styles.profileMenu__userIcon}>
          <UserIcon />
        </div>
        <div className={styles.profileMenu__userText}>
          <h1 className={styles.profileMenu__title}>{title}</h1>
          {subtitle && <p className={styles.profileMenu__userMeta}>{subtitle}</p>}
        </div>
      </div>
      <ul className={styles.profileMenu__actions}>
        {actions.map((action) => {
          const Icon = action.Icon;

          return (
            <li key={action.title}>
              {action.type === 'link' ? (
                <Link href={action.href} className={styles.profileMenu__action} onClick={() => onActionClick(action)}>
                  <IconBox>
                    <Icon />
                  </IconBox>
                  <span className={styles.profileMenu__actionLabel}>{action.title}</span>
                </Link>
              ) : (
                <button
                  type="button"
                  className={styles.profileMenu__action}
                  onClick={() => {
                    onActionClick(action);
                    getButtonAction(action)();
                  }}
                >
                  <IconBox>
                    <Icon />
                  </IconBox>
                  <span className={styles.profileMenu__actionLabel}>{action.title}</span>
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function ProfilePageContent() {
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
  const handleProfileMenuActionClick = (action: ProfileMenuItem) => {
    const eventLabel =
      action.title === '로그인' ? 'home_login' : action.title === '로그아웃' ? 'home_logout' : 'home_settings';

    logger.actionEventClick({ team: 'CAMPUS', event_label: eventLabel, value: action.title });
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
        <TimetablePreview isLoggedIn={isLoggedIn} />
      </main>
      {isModalOpen && <AuthenticateUserModal onClose={closeModal} />}
    </>
  );
}

function ProfilePage() {
  return (
    <Suspense fallback={null}>
      <ProfilePageContent />
    </Suspense>
  );
}

ProfilePage.getLayout = (page: ReactNode) => <HomeLayout>{page}</HomeLayout>;

export default ProfilePage;
