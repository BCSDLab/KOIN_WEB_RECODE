import type { FunctionComponent, ReactNode, SVGProps } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { teamRecruitmentProfileQueries } from 'api/teamRecruitmentProfile/queries';
import SleepMascotIcon from 'assets/svg/common/sleep-bbico.svg';
import ChevronRightIcon from 'assets/svg/Team/chevron-right-icon.svg';
import ListEndIcon from 'assets/svg/Team/list-end-icon.svg';
import NoteIcon from 'assets/svg/Team/note-icon.svg';
import UserIcon from 'assets/svg/Team/profile-avatar-icon.svg';
import Layout from 'components/layout';
import SubPageHeader from 'components/ui/SubPageHeader';
import ROUTES from 'static/routes';
import useTokenState from 'utils/hooks/state/useTokenState';
import styles from './TeamProfilePage.module.scss';

interface MenuCardProps {
  icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  onCardClick?: () => void;
}

function MenuCard({ icon: Icon, title, description, onCardClick }: MenuCardProps) {
  return (
    <button type="button" className={styles.menuCard} onClick={onCardClick}>
      <span className={styles.menuCard__icon}>
        <Icon aria-hidden />
      </span>
      <span className={styles.menuCard__body}>
        <span className={styles.menuCard__title}>{title}</span>
        <span className={styles.menuCard__description}>{description}</span>
      </span>
      <ChevronRightIcon aria-hidden className={styles.menuCard__chevron} />
    </button>
  );
}

function TeamProfilePage() {
  const router = useRouter();
  const token = useTokenState();
  const { data: profile } = useQuery({
    ...teamRecruitmentProfileQueries.me(token),
    enabled: !!token,
  });
  const hasProfile = Boolean(profile);

  return (
    <>
      <Head>
        <title>팀원 모집 프로필 | KOIN</title>
        <meta name="description" content="팀원 모집 프로필을 확인하고 관리할 수 있습니다." />
      </Head>

      <div className={styles.page}>
        <SubPageHeader title="팀원 모집 프로필" />

        <div className={styles.page__content}>
          {profile ? (
            <div className={styles.summaryCard}>
              <span className={styles.summaryCard__avatar}>
                <UserIcon aria-hidden />
              </span>
              <div className={styles.summaryCard__body}>
                <p className={styles.summaryCard__nickname}>{profile.profile_nickname}</p>
                <ul className={styles.summaryCard__meta}>
                  <li>{profile.department}</li>
                  <li>{profile.student_number}</li>
                </ul>
                <button
                  type="button"
                  className={styles.summaryCard__button}
                  onClick={() => router.push(ROUTES.TeamProfileEdit())}
                >
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
              <button
                type="button"
                className={styles.emptyCard__button}
                onClick={() => router.push(ROUTES.TeamProfileCreate())}
              >
                프로필 작성하기
              </button>
            </div>
          )}

          <div className={styles.menuList}>
            <MenuCard
              icon={NoteIcon}
              title={hasProfile ? '내가 작성한 모집글' : '내가 작성한 모집글 모아보기'}
              description="작성자 모집글과 지원자를 한눈에 확인할 수 있어요."
            />
            <MenuCard
              icon={ListEndIcon}
              title={hasProfile ? '내가 지원한 모집글' : '내가 지원한 모집글 모아보기'}
              description="지원한 모집글과 지원 상태를 확인할 수 있어요."
              onCardClick={() => router.push(ROUTES.TeamMyApplications())}
            />
          </div>
        </div>
      </div>
    </>
  );
}

TeamProfilePage.getLayout = (page: ReactNode) => <Layout hideLayout>{page}</Layout>;

export default TeamProfilePage;
