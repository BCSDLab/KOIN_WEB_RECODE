import { Suspense } from 'react';
import type { ReactNode } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ErrorBoundary from 'components/boundary/ErrorBoundary';
import Layout from 'components/layout';
import TeamChatRoom from 'components/Team/components/TeamChatRoom';
import styles from './TeamChatPage.module.scss';

export default function TeamChatPage() {
  const router = useRouter();
  const recruitmentId = Number(router.query.recruitmentId);
  const chatRoomId = Number(router.query.chatRoomId);

  return (
    <>
      <Head>
        <title>팀원 모집 채팅 | KOIN</title>
      </Head>
      {!!recruitmentId && !!chatRoomId && (
        <ErrorBoundary fallbackClassName={styles.error}>
          <Suspense fallback={null}>
            <TeamChatRoom
              key={`${recruitmentId}-${chatRoomId}`}
              recruitmentId={recruitmentId}
              chatRoomId={chatRoomId}
            />
          </Suspense>
        </ErrorBoundary>
      )}
    </>
  );
}

TeamChatPage.getLayout = (page: ReactNode) => <Layout hideLayout>{page}</Layout>;
