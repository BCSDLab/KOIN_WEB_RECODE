import type { ComponentType, ReactNode, SVGProps } from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import LoginIcon from 'assets/svg/common/login-icon.svg';
import LogoutIcon from 'assets/svg/common/logout-icon.svg';
import SettingIcon from 'assets/svg/common/setting-icon.svg';
import UserIcon from 'assets/svg/common/user-2-icon.svg';
import HomeLayout from 'components/layout/HomeLayout';
import {
  LoggedInTimetablePreview,
  ProfileTimetableGrid,
} from 'components/ProfilePage/TimetablePreview';
import IconBox from 'components/ui/IconBox';
import ROUTES from 'static/routes';
import { useLogout } from 'utils/hooks/auth/useLogout';
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
  title: string;
  Icon: IconComponent;
};

type ProfileMenuItem = LinkProfileMenuItem | ButtonProfileMenuItem;

const getProfileMenus = (isLoggedIn: boolean): ProfileMenuItem[] => [
  isLoggedIn
    ? {
        type: 'button',
        title: '로그아웃',
        Icon: LogoutIcon,
      }
    : {
        type: 'link',
        title: '로그인',
        href: ROUTES.Auth(),
        Icon: LoginIcon,
      },
  {
    type: 'link',
    title: '설정',
    href: isLoggedIn ? ROUTES.AuthModifyInfo() : ROUTES.Auth(),
    Icon: SettingIcon,
  },
];

function TimetablePreview({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section className={styles.timetable}>
      <Link href={ROUTES.Timetable()} className={styles.timetable__link}>
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
  subtitle?: string;
}

function ProfileMenu({ title, actions, onLogout, subtitle }: ProfileMenuProps) {
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
                <Link href={action.href} className={styles.profileMenu__action}>
                  <IconBox>
                    <Icon />
                  </IconBox>
                  <span className={styles.profileMenu__actionLabel}>{action.title}</span>
                </Link>
              ) : (
                <button type="button" className={styles.profileMenu__action} onClick={onLogout}>
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
  const isLoggedIn = !!userInfo;
  const isStudent = isStudentUser(userInfo);
  const title = userInfo?.nickname?.trim() || userInfo?.name?.trim() || '로그인해주세요.';
  const subtitle = isStudent ? userInfo.student_number || '학번 정보 없음' : userInfo?.login_id;
  const actions = getProfileMenus(isLoggedIn);

  return (
    <main className={styles.profile}>
      <ProfileMenu title={title} actions={actions} onLogout={logout} subtitle={isLoggedIn ? subtitle : undefined} />
      <TimetablePreview isLoggedIn={isLoggedIn} />
    </main>
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
