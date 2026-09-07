import type { ReactNode } from 'react';
import type { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';
import { teamRecruitmentProfileQueries } from 'api/teamRecruitmentProfile/queries';
import Layout from 'components/layout';
import TeamProfileDesktop from 'components/Team/TeamProfilePage/TeamProfileDesktop';
import TeamProfileMobile from 'components/Team/TeamProfilePage/TeamProfileMobile';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useTokenState from 'utils/hooks/state/useTokenState';
import { parseServerSideParams } from 'utils/ts/parseServerSideParams';
import { withCacheControl } from 'utils/ts/withCacheControl';
import styles from './TeamProfilePage.module.scss';

// 로그인은 middleware.ts가 보장하므로 여기선 토큰이 항상 존재한다고 가정해도 된다.
// 프로필 조회를 서버에서 미리 끝내(prefetch) 클라이언트로 내려주므로, 클라이언트는 로딩 상태 자체를
// 겪지 않고 처음부터 확정된 데이터로 렌더한다 — "프로필 없음"이 잠깐 보이는 깜빡임이 구조적으로 불가능해진다.
export const getServerSideProps = withCacheControl<{
  dehydratedState: ReturnType<typeof dehydrate>;
}>(async (context: GetServerSidePropsContext) => {
  const queryClient = new QueryClient();
  const { token } = parseServerSideParams(context);

  if (token) {
    await queryClient.prefetchQuery(teamRecruitmentProfileQueries.me(token));
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
});

function TeamProfilePage() {
  const router = useRouter();
  const token = useTokenState();
  const logger = useLogger();
  // _app.tsx의 QueryClient는 SSR 중 모든 쿼리를 기본적으로 enabled:false로 끈다(전역 기본값).
  // useSuspenseQuery는 enabled를 지원하지 않아 이 기본값을 개별적으로 못 덮어써서 서버에서 빈 데이터로
  // 취급되므로, enabled를 명시할 수 있는 일반 useQuery를 쓴다. 위 getServerSideProps가 이미 이 쿼리를
  // prefetch+dehydrate해뒀으므로, 서버·클라이언트 모두 첫 렌더부터 캐시에서 동기적으로 값을 읽는다.
  const { data: profile } = useQuery({
    ...teamRecruitmentProfileQueries.me(token),
    enabled: !!token,
  });

  const handleModifyClick = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'team_recruitment_profile_modify',
      value: '프로필 수정하기',
    });
    router.push(ROUTES.TeamProfileEdit());
  };

  const handleCreateClick = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'team_recruitment_profile_create',
      value: '프로필 작성하기',
    });
    router.push(ROUTES.TeamProfileCreate());
  };

  const handleCreatedRecruitmentsClick = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'team_recruitment_profile_created',
      value: '내가 작성한 모집글',
    });
    router.push(ROUTES.TeamMyCreatedPosts());
  };

  const handleAppliedRecruitmentsClick = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'team_recruitment_profile_applied',
      value: '내가 지원한 모집글',
    });
    router.push(ROUTES.TeamMyApplications());
  };

  const viewProps = {
    profile,
    hasProfile: Boolean(profile),
    onModifyClick: handleModifyClick,
    onCreateClick: handleCreateClick,
    onCreatedRecruitmentsClick: handleCreatedRecruitmentsClick,
    onAppliedRecruitmentsClick: handleAppliedRecruitmentsClick,
  };

  return (
    <>
      <Head>
        <title>팀원 모집 프로필 | KOIN</title>
        <meta name="description" content="팀원 모집 프로필을 확인하고 관리할 수 있습니다." />
      </Head>

      <div className={styles.desktopOnly}>
        <TeamProfileDesktop {...viewProps} />
      </div>
      <div className={styles.mobileOnly}>
        <TeamProfileMobile {...viewProps} />
      </div>
    </>
  );
}

TeamProfilePage.getLayout = (page: ReactNode) => <Layout hideLayout>{page}</Layout>;

export default TeamProfilePage;
