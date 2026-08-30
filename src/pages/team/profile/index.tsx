import type { ReactNode } from 'react';
import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { teamRecruitmentProfileQueries } from 'api/teamRecruitmentProfile/queries';
import Layout from 'components/layout';
import TeamProfileDesktop from 'components/Team/TeamProfilePage/TeamProfileDesktop';
import TeamProfileMobile from 'components/Team/TeamProfilePage/TeamProfileMobile';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useMount from 'utils/hooks/state/useMount';
import useTokenState from 'utils/hooks/state/useTokenState';
import { redirectToLogin } from 'utils/ts/auth';

function TeamProfilePage() {
  const router = useRouter();
  const token = useTokenState();
  const mounted = useMount();
  const isMobile = useMediaQuery();
  const logger = useLogger();
  const { data: profile } = useQuery({
    ...teamRecruitmentProfileQueries.me(token),
    enabled: !!token,
  });
  const hasProfile = Boolean(profile);

  useEffect(() => {
    if (mounted && !token) {
      redirectToLogin(router.asPath);
    }
  }, [mounted, token, router.asPath]);

  if (!mounted || !token) return null;

  const handleModifyClick = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_category: 'click',
      event_label: 'team_recruitment_profile_modify',
      value: '프로필 수정하기',
    });
    router.push(ROUTES.TeamProfileEdit());
  };

  const handleCreateClick = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_category: 'click',
      event_label: 'team_recruitment_profile_create',
      value: '프로필 작성하기',
    });
    router.push(ROUTES.TeamProfileCreate());
  };

  const handleCreatedRecruitmentsClick = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_category: 'click',
      event_label: 'team_recruitment_profile_created',
      value: '내가 작성한 모집글',
    });
    router.push(ROUTES.TeamMyCreatedPosts());
  };

  const handleAppliedRecruitmentsClick = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_category: 'click',
      event_label: 'team_recruitment_profile_applied',
      value: '내가 지원한 모집글',
    });
    router.push(ROUTES.TeamMyApplications());
  };

  const viewProps = {
    profile,
    hasProfile,
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

      {isMobile ? <TeamProfileMobile {...viewProps} /> : <TeamProfileDesktop {...viewProps} />}
    </>
  );
}

TeamProfilePage.getLayout = (page: ReactNode) => <Layout hideLayout>{page}</Layout>;

export default TeamProfilePage;
