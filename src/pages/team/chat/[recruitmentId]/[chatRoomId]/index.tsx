import type { ReactNode } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { cn } from '@bcsdlab/utils';
import { useQuery } from '@tanstack/react-query';
import { teamQueries } from 'api/team/queries';
import PeopleIcon from 'assets/svg/Team/people.svg';
import Layout from 'components/layout';
import SubPageHeader from 'components/ui/SubPageHeader';
import useMount from 'utils/hooks/state/useMount';
import useTokenState from 'utils/hooks/state/useTokenState';
import styles from './TeamChatPage.module.scss';

export default function TeamChatPage() {
  const router = useRouter();
  const token = useTokenState();
  const isMounted = useMount();
  const recruitmentId = Number(router.query.recruitmentId);
  const chatRoomId = Number(router.query.chatRoomId);

  const {
    data: chatRoom,
    isLoading,
    isError,
  } = useQuery({
    ...teamQueries.chatRoom(token ?? '', recruitmentId, chatRoomId),
    enabled: !!token && !!recruitmentId && !!chatRoomId,
  });

  return (
    <>
      <Head>
        <title>팀원 모집 채팅 | KOIN</title>
      </Head>
      <div className={styles.page}>
        <SubPageHeader
          title={chatRoom?.room_name ?? ''}
          size="medium"
          rightAction={
            chatRoom && chatRoom.room_type === 'TEAM' ? (
              <span
                className={cn({
                  [styles.memberCount]: true,
                  [styles['memberCount--full']]: chatRoom.member_count >= chatRoom.max_member_count,
                })}
              >
                <PeopleIcon />
                {chatRoom.member_count}/{chatRoom.max_member_count}
              </span>
            ) : undefined
          }
        />
        <div className={styles.messages}>
          {isMounted && isLoading && <p className={styles.status}>채팅방을 불러오는 중입니다.</p>}
          {isMounted && isError && <p className={styles.status}>채팅방을 불러오지 못했어요.</p>}
        </div>
      </div>
    </>
  );
}

TeamChatPage.getLayout = (page: ReactNode) => <Layout hideLayout>{page}</Layout>;
