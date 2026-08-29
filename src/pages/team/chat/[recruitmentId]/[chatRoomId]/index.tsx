import type { ReactNode } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { cn } from '@bcsdlab/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { teamMutations } from 'api/team/mutations';
import { teamQueries } from 'api/team/queries';
import PeopleIcon from 'assets/svg/Team/people.svg';
import Layout from 'components/layout';
import TeamChatSendBar from 'components/Team/components/TeamChatSendBar';
import SubPageHeader from 'components/ui/SubPageHeader';
import useMount from 'utils/hooks/state/useMount';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';
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

  const { mutate: sendMessage, isPending: isSending } = useMutation({
    ...teamMutations.sendChatMessage(token ?? '', recruitmentId, chatRoomId),
    onError: () => showToast('error', '메시지를 보내지 못했어요. 다시 시도해 주세요.'),
  });

  const isReadOnly = chatRoom?.status === 'READ_ONLY';

  const handleSend = (content: string) => sendMessage({ content, is_image: false });

  // TODO: UploadDomain 에 TEAM_RECRUITMENT 를 추가하고 useUploadFile 로 연결한다.
  const handleImageSelect = () => showToast('warning', '이미지 전송은 준비 중입니다.');

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
        <TeamChatSendBar
          disabled={isReadOnly || isSending}
          placeholder={isReadOnly ? '종료된 채팅방입니다' : undefined}
          onSend={handleSend}
          onImageSelect={handleImageSelect}
        />
      </div>
    </>
  );
}

TeamChatPage.getLayout = (page: ReactNode) => <Layout hideLayout>{page}</Layout>;
