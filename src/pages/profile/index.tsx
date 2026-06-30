import type { ComponentType, ReactNode, SVGProps } from 'react';
import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { isValidTimetableFrameId } from 'api/timetable/queries';
import LoginIcon from 'assets/svg/common/login-icon.svg';
import LogoutIcon from 'assets/svg/common/logout-icon.svg';
import SettingIcon from 'assets/svg/common/setting-icon.svg';
import UserIcon from 'assets/svg/common/user-2-icon.svg';
import HomeLayout from 'components/layout/HomeLayout';
import useMyLectures from 'components/TimetablePage/hooks/useMyLectures';
import useSemesterOptionList from 'components/TimetablePage/hooks/useSemesterOptionList';
import useTimetableFrameList from 'components/TimetablePage/hooks/useTimetableFrameList';
import IconBox from 'components/ui/IconBox';
import ROUTES from 'static/routes';
import { BACKGROUND_COLOR, BORDER_TOP_COLOR } from 'static/timetable';
import { useLogout } from 'utils/hooks/auth/useLogout';
import useMount from 'utils/hooks/state/useMount';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useUser } from 'utils/hooks/state/useUser';
import { isStudentUser } from 'utils/ts/userTypeGuards';
import { useSemester, useSemesterAction } from 'utils/zustand/semester';
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

const timetableDays = ['월', '화', '수', '목', '금'];
const timetableHours = ['9', '10', '11', '12', '13', '14', '15', '16', '17', '18'];

function ProfileTimetableGrid({ children }: { children?: ReactNode }) {
  return (
    <div className={styles.timetable__gridBoard}>
      <div className={styles.timetable__corner} />
      {timetableDays.map((day) => (
        <div key={day} className={styles.timetable__day}>
          {day}
        </div>
      ))}
      <div className={styles.timetable__hours}>
        {timetableHours.map((hour) => (
          <span key={hour}>{hour}</span>
        ))}
      </div>
      <div className={styles.timetable__grid}>{children}</div>
    </div>
  );
}

function FilledTimetableGrid({ timetableFrameId }: { timetableFrameId: number }) {
  const { myLectures } = useMyLectures(timetableFrameId);

  return (
    <ProfileTimetableGrid>
      {myLectures?.map((lecture, lectureIndex) =>
        lecture.lecture_infos.map((info) => {
          const colorIndex = lectureIndex % BACKGROUND_COLOR.length;
          const title = 'name' in lecture ? lecture.name : lecture.class_title;

          return (
            <div
              key={`${lecture.id}-${info.day}-${info.start_time}`}
              className={styles.timetable__block}
              style={{
                gridColumn: info.day + 1,
                gridRow: `${(info.start_time % 100) + 1} / span ${(info.end_time % 100) - (info.start_time % 100) + 1}`,
                background: BACKGROUND_COLOR[colorIndex],
                borderTop: `2px solid ${BORDER_TOP_COLOR[colorIndex]}`,
              }}
            >
              <span>{title}</span>
              <small>{info.place}</small>
            </div>
          );
        }),
      )}
    </ProfileTimetableGrid>
  );
}

function LoggedInTimetablePreview() {
  const { updateSemester } = useSemesterAction();
  const semesterOptionList = useSemesterOptionList();
  const semester = useSemester();
  const token = useTokenState();
  const { data: timetableFrameList } = useTimetableFrameList(token, semester);
  const currentFrameId = timetableFrameList?.find((frame) => frame.is_main)?.id;
  const isClient = useMount();

  useEffect(() => {
    if (semesterOptionList.length > 0) updateSemester(semesterOptionList[0].value);
  }, [semesterOptionList, updateSemester]);

  if (!isClient || !isValidTimetableFrameId(currentFrameId)) {
    return <ProfileTimetableGrid />;
  }

  return <FilledTimetableGrid timetableFrameId={currentFrameId} />;
}

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
