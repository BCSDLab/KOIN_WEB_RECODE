import type { ReactNode } from 'react';
import type { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { teamRecruitmentProfileQueries } from 'api/teamRecruitmentProfile/queries';
import Layout from 'components/layout';
import TeamProfileForm from 'components/Team/ProfilePage';
import { parseServerSideParams } from 'utils/ts/parseServerSideParams';
import { withCacheControl } from 'utils/ts/withCacheControl';

// 로그인은 middleware.ts가 보장한다. 기존 프로필을 서버에서 미리 prefetch해 내려줘야
// 폼이 "빈 값으로 시작했다가 나중에 채워지는" 하이드레이션 불일치 없이 처음부터 채워진 채로 렌더된다.
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

function TeamProfileEditPage() {
  return (
    <>
      <Head>
        <title>팀원 모집 프로필 수정 | KOIN</title>
        <meta name="description" content="팀원 모집 프로필을 수정할 수 있습니다." />
      </Head>

      <TeamProfileForm mode="edit" />
    </>
  );
}

TeamProfileEditPage.getLayout = (page: ReactNode) => <Layout hideLayout>{page}</Layout>;

export default TeamProfileEditPage;
