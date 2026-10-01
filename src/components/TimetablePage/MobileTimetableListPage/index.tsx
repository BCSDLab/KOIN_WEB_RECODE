import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useSuspenseQueries } from '@tanstack/react-query';
import type { Semester, TimetableFrameInfo } from 'api/timetable/entity';
import { createDefaultTimetableFrameList, timetableQueries } from 'api/timetable/queries';
import TimetableEmptyIllustration from 'assets/svg/timetable-empty-illustration.svg';
import BookmarkIcon from 'assets/svg/timetable-list-bookmark-icon.svg';
import PlusIcon from 'assets/svg/timetable-list-plus-icon.svg';
import SettingIcon from 'assets/svg/timetable-list-setting-icon.svg';
import type { Portal } from 'components/modal/Modal/PortalProvider';
import InducingLoginModal from 'components/TimetablePage/components/InducingLoginModal';
import useAddTimetableFrame from 'components/TimetablePage/hooks/useAddTimetableFrame';
import useSemesterCheck from 'components/TimetablePage/hooks/useMySemester';
import { useAllSemesters } from 'components/TimetablePage/hooks/useSemesterOptionList';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';
import { sortSemestersNewestFirst } from 'utils/timetable/semester';
import { useTokenStore } from 'utils/zustand/auth';
import { useSemesterAction } from 'utils/zustand/semester';

import styles from './MobileTimetableListPage.module.scss';

type RequireLogin = (actionTitle: string) => void;

interface SemesterSectionProps {
  semester: Semester;
  frames: TimetableFrameInfo[];
  isMember: boolean;
  onRequireLogin: RequireLogin;
}

function SemesterSection({ semester, frames, isMember, onRequireLogin }: SemesterSectionProps) {
  const router = useRouter();
  const logger = useLogger();
  const { updateSemester } = useSemesterAction();
  const { mutate: addTimetableFrame } = useAddTimetableFrame(isMember, semester);
  const semesterLabel = `${semester.year} ${semester.term}`;

  const handleAddClick = () => {
    if (!isMember) {
      onRequireLogin('시간표 추가');

      return;
    }
    addTimetableFrame(semester);
  };

  const handleFrameClick = (frame: TimetableFrameInfo) => {
    logger.actionEventClick({
      team: 'USER',
      event_label: 'timetable',
      value: `click_semester_${semester.year}${semester.term}`,
    });
    updateSemester(semester);
    router.push({
      pathname: ROUTES.Timetable(),
      query: {
        year: semester.year,
        term: semester.term,
        ...(frame.id ? { timetableFrameId: frame.id } : {}),
      },
    });
  };

  return (
    <section className={styles.semester}>
      <div className={styles.semester__header}>
        <h2 className={styles.semester__title}>{semesterLabel}</h2>
        <button
          type="button"
          className={styles['icon-button']}
          aria-label={`${semesterLabel} 시간표 추가`}
          onClick={handleAddClick}
        >
          <PlusIcon />
        </button>
      </div>
      <ul className={styles.semester__frames}>
        {frames.map((frame) => (
          <li key={frame.id ?? 'default'} className={styles.frame}>
            <button type="button" className={styles.frame__select} onClick={() => handleFrameClick(frame)}>
              {frame.name}
              {frame.is_main && isMember && <BookmarkIcon />}
            </button>
            {isMember && (
              <button
                type="button"
                className={`${styles['icon-button']} ${styles.frame__setting}`}
                aria-label={`${frame.name} 설정`}
              >
                <SettingIcon />
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function MemberList({ semesters, onRequireLogin }: { semesters: Semester[]; onRequireLogin: RequireLogin }) {
  const { userType } = useTokenStore();
  const results = useSuspenseQueries({
    queries: semesters.map((semester) =>
      timetableQueries.frameList(true, semester, { fallbackOnError: true, hasUserSemester: true, userType }),
    ),
  });

  return (
    <div className={styles.card}>
      {semesters.map((semester, index) => (
        <SemesterSection
          key={`${semester.year}${semester.term}`}
          semester={semester}
          frames={results[index].data}
          isMember
          onRequireLogin={onRequireLogin}
        />
      ))}
    </div>
  );
}

function GuestList({ isLoggedIn, onRequireLogin }: { isLoggedIn: boolean; onRequireLogin: RequireLogin }) {
  const semesters = sortSemestersNewestFirst(useAllSemesters());
  const frames = createDefaultTimetableFrameList();

  return (
    <>
      {!isLoggedIn && (
        <div className={styles.notice}>
          <p className={styles.notice__text}>
            <Link href={ROUTES.Auth()} className={styles.notice__login}>
              로그인
            </Link>
            을 통해 학기를 편집하고 계절학기와 예비 시간표를 작성할 수 있어요.
          </p>
        </div>
      )}
      <div className={styles.card}>
        {semesters.map((semester) => (
          <SemesterSection
            key={`${semester.year}${semester.term}`}
            semester={semester}
            frames={frames}
            isMember={false}
            onRequireLogin={onRequireLogin}
          />
        ))}
      </div>
    </>
  );
}

function EmptyState() {
  return (
    <div className={styles.empty}>
      <TimetableEmptyIllustration />
      <p className={styles.empty__text}>
        등록된 시간표가 없어요.
        <br />
        우측 상단 버튼을 눌러 시간표를 추가해보세요.
      </p>
    </div>
  );
}

export default function MobileTimetableListPage() {
  const portalManager = useModalPortal();
  const isLoggedIn = useIsLoggedIn();
  const { data: mySemester } = useSemesterCheck();

  const handleRequireLogin: RequireLogin = (actionTitle) => {
    portalManager.open((portalOption: Portal) => (
      <InducingLoginModal
        actionTitle={actionTitle}
        detailExplanation={`${actionTitle}는 회원만 사용 가능합니다. 회원가입 또는 로그인 후 이용해주세요 :-)`}
        onClose={portalOption.close}
      />
    ));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps -- 언마운트 시 1회만 정리
  useEffect(() => () => portalManager.close(), []);

  if (mySemester) {
    const semesters = sortSemestersNewestFirst(mySemester.semesters);

    return (
      <div className={styles.page}>
        {semesters.length === 0 ? (
          <EmptyState />
        ) : (
          <MemberList semesters={semesters} onRequireLogin={handleRequireLogin} />
        )}
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <GuestList isLoggedIn={isLoggedIn} onRequireLogin={handleRequireLogin} />
    </div>
  );
}
