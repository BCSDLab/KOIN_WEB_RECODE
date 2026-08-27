import type { ReactNode } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ArrowBackIcon from 'assets/svg/arrow-back.svg';
import SleepMascotIcon from 'assets/svg/common/sleep-bbico.svg';
import ListEndIcon from 'assets/svg/Team/list-end-icon.svg';
import NoteIcon from 'assets/svg/Team/note-icon.svg';
import UserIcon from 'assets/svg/Team/profile-avatar-icon.svg';
import Layout from 'components/layout';
import ProfileMenuCard from 'components/Team/components/ProfileMenuCard';
import styles from './TeamProfilePage.module.scss';

interface TeamRecruitmentProfileSummary {
  nickname: string;
  department: string;
  studentNumber: string;
}

// TODO: /team-recruitment-profiles/me API 연동 후 React Query로 교체
const MOCK_HAS_PROFILE = true;
const MOCK_PROFILE: TeamRecruitmentProfileSummary = {
  nickname: 'BCSD',
  department: '컴퓨터공학부',
  studentNumber: '2023100000',
};

function TeamProfilePage() {
  const router = useRouter();
  const hasProfile = MOCK_HAS_PROFILE;
  const profile = MOCK_PROFILE;

  return (
    <>
      <Head>
        <title>팀원 모집 프로필 | KOIN</title>
        <meta name="description" content="팀원 모집 프로필을 확인하고 관리할 수 있습니다." />
      </Head>

      <div className={styles.page}>
        <div className={styles.page__header}>
          <button
            type="button"
            className={styles['page__back-button']}
            onClick={() => router.back()}
            aria-label="뒤로가기"
          >
            <ArrowBackIcon />
          </button>
          <h1 className={styles.page__title}>팀원 모집 프로필</h1>
          <div className={styles['page__spacer']} />
        </div>

        <div className={styles.page__content}>
          {hasProfile ? (
            <div className={styles.summaryCard}>
              <span className={styles.summaryCard__avatar}>
                <UserIcon aria-hidden />
              </span>
              <div className={styles.summaryCard__body}>
                <p className={styles.summaryCard__nickname}>{profile.nickname}</p>
                <ul className={styles.summaryCard__meta}>
                  <li>{profile.department}</li>
                  <li>{profile.studentNumber}</li>
                </ul>
                <button type="button" className={styles.summaryCard__button}>
                  프로필 수정하기
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.emptyCard}>
              <SleepMascotIcon aria-hidden className={styles.emptyCard__mascot} />
              <p className={styles.emptyCard__title}>아직 팀원 모집 프로필을 작성하지 않았어요.</p>
              <p className={styles.emptyCard__description}>
                프로필을 작성하면 지원 시 더 빠르고 편리하게 활동할 수 있어요.
              </p>
              <button type="button" className={styles.emptyCard__button}>
                프로필 작성하기
              </button>
            </div>
          )}

          <div className={styles.menuList}>
            <ProfileMenuCard
              icon={NoteIcon}
              title={hasProfile ? '내가 작성한 모집글' : '내가 작성한 모집글 모아보기'}
              description="작성자 모집글과 지원자를 한눈에 확인할 수 있어요."
            />
            <ProfileMenuCard
              icon={ListEndIcon}
              title={hasProfile ? '내가 지원한 모집글' : '내가 지원한 모집글 모아보기'}
              description="지원한 모집글과 지원 상태를 확인할 수 있어요."
            />
          </div>
        </div>
      </div>
    </>
  );
}

TeamProfilePage.getLayout = (page: ReactNode) => <Layout hideLayout>{page}</Layout>;

export default TeamProfilePage;
