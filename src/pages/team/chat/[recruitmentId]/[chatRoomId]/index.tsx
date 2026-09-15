import { Suspense } from 'react';
import type { ReactNode } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ErrorBoundary from 'components/boundary/ErrorBoundary';
import LoadingSpinner from 'components/feedback/LoadingSpinner';
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
      <main className={styles.page}>
        <h1 className={styles.page__title}>팀원모집</h1>
        <div className={styles.page__content}>
          {!!recruitmentId && !!chatRoomId && (
            <ErrorBoundary fallbackClassName={styles.error}>
              <Suspense
                fallback={
                  <div className={styles.loading} role="status" aria-label="채팅방을 불러오는 중입니다.">
                    <LoadingSpinner size="50px" />
                  </div>
                }
              >
                <TeamChatRoom
                  key={`${recruitmentId}-${chatRoomId}`}
                  recruitmentId={recruitmentId}
                  chatRoomId={chatRoomId}
                />
              </Suspense>
            </ErrorBoundary>
          )}
        </div>
      </main>
    </>
  );
}

TeamChatPage.getLayout = (page: ReactNode) => <Layout hideLayout>{page}</Layout>;
