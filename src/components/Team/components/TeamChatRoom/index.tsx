import { useEffect, useRef } from 'react';
import { cn } from '@bcsdlab/utils';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { teamMutations } from 'api/team/mutations';
import { teamQueries } from 'api/team/queries';
import ChatAvatarIcon from 'assets/svg/Team/chat-avatar.svg';
import PeopleIcon from 'assets/svg/Team/people.svg';
import TeamChatSendBar from 'components/Team/components/TeamChatSendBar';
import formatChatTime from 'components/Team/utils/formatChatTime';
import groupChatMessagesByDate from 'components/Team/utils/groupChatMessagesByDate';
import SubPageHeader from 'components/ui/SubPageHeader';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useUser } from 'utils/hooks/state/useUser';
import showToast from 'utils/ts/showToast';
import styles from './TeamChatRoom.module.scss';

interface TeamChatRoomProps {
  recruitmentId: number;
  chatRoomId: number;
}

export default function TeamChatRoom({ recruitmentId, chatRoomId }: TeamChatRoomProps) {
  const token = useTokenState();
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const { data: chatRoom } = useSuspenseQuery(teamQueries.chatRoom(token, recruitmentId, chatRoomId));
  const { data: messages } = useSuspenseQuery(teamQueries.chatMessages(token, recruitmentId, chatRoomId));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { mutate: sendMessage, isPending: isSending } = useMutation({
    ...teamMutations.sendChatMessage(queryClient, token, recruitmentId, chatRoomId),
    onError: () => showToast('error', '메시지를 보내지 못했어요. 다시 시도해 주세요.'),
  });
  const lastMessageId = messages[messages.length - 1]?.message_id;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [lastMessageId]);

  const isReadOnly = chatRoom.status === 'READ_ONLY';
  const isTeamRoom = chatRoom.room_type === 'TEAM';
  const messageGroups = groupChatMessagesByDate(messages);

  const handleSend = (content: string) => sendMessage({ content, is_image: false });

  // TODO: UploadDomain 에 TEAM_RECRUITMENT 를 추가하고 useUploadFile 로 연결한다.
  const handleImageSelect = () => showToast('warning', '이미지 전송은 준비 중입니다.');

  return (
    <div className={styles.chatRoom}>
      <SubPageHeader
        title={chatRoom.room_name}
        size="medium"
        rightAction={
          isTeamRoom ? (
            <span
              className={cn({
                [styles.chatRoom__memberCount]: true,
                [styles['chatRoom__memberCount--full']]: chatRoom.member_count >= chatRoom.max_member_count,
              })}
            >
              <PeopleIcon />
              {chatRoom.member_count}/{chatRoom.max_member_count}
            </span>
          ) : undefined
        }
      />
      <div className={styles.chatRoom__messages}>
        {messages.length === 0 && <p className={styles.chatRoom__empty}>아직 대화가 없습니다.</p>}
        {messageGroups.map((group) => (
          <div key={group.date}>
            <div className={styles.chatRoom__dateChip}>
              <span
                className={cn({
                  [styles.chatRoom__dateLabel]: true,
                  [styles['chatRoom__dateLabel--today']]: group.isToday,
                })}
              >
                {group.label}
              </span>
            </div>
            {group.messages.map((message, index) => {
              const isMine = message.user_id === user?.id;
              const isFirstOfSender = index === 0 || group.messages[index - 1].user_id !== message.user_id;

              const bubble = message.is_image ? (
                <div className={styles.chatRoom__imageBubble}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={message.content} alt="전송된 이미지" />
                </div>
              ) : (
                <div className={styles.chatRoom__bubble}>{message.content}</div>
              );

              const meta = (
                <div
                  className={cn({
                    [styles.chatRoom__meta]: true,
                    [styles['chatRoom__meta--mine']]: isMine,
                  })}
                >
                  {message.unread_count > 0 && (
                    <span className={styles.chatRoom__unreadCount}>{message.unread_count}</span>
                  )}
                  <span className={styles.chatRoom__time}>{formatChatTime(message.timestamp)}</span>
                </div>
              );

              if (isMine) {
                return (
                  <div key={message.message_id} className={styles['chatRoom__messageRow--mine']}>
                    {meta}
                    {bubble}
                  </div>
                );
              }

              return (
                <div
                  key={message.message_id}
                  className={cn({
                    [styles.chatRoom__messageGroup]: true,
                    [styles['chatRoom__messageGroup--consecutive']]: !isFirstOfSender,
                  })}
                >
                  {isFirstOfSender && (
                    <div className={styles.chatRoom__sender}>
                      <ChatAvatarIcon />
                      <span className={styles.chatRoom__senderName}>{message.user_nickname}</span>
                    </div>
                  )}
                  <div className={styles['chatRoom__messageRow--others']}>
                    {bubble}
                    {meta}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <TeamChatSendBar
        disabled={isReadOnly || isSending}
        placeholder={isReadOnly ? '종료된 채팅방입니다' : undefined}
        onSend={handleSend}
        onImageSelect={handleImageSelect}
      />
    </div>
  );
}
