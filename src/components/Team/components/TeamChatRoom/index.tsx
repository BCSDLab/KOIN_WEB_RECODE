import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { cn } from '@bcsdlab/utils';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { teamMutations } from 'api/team/mutations';
import { TEAM_CHAT_MESSAGE_LIMIT, teamQueries } from 'api/team/queries';
import DefaultPhotoIcon from 'assets/svg/Articles/default-photo.svg';
import ChatAvatarIcon from 'assets/svg/Team/chat-avatar.svg';
import PeopleIcon from 'assets/svg/Team/people.svg';
import WebChatIcon from 'assets/svg/Team/web_chat.svg';
import TeamChatSendBar from 'components/Team/components/TeamChatSendBar';
import formatChatTime, { formatChatRoomListTime } from 'components/Team/utils/formatChatTime';
import groupChatMessagesByDate from 'components/Team/utils/groupChatMessagesByDate';
import SubPageHeader from 'components/ui/SubPageHeader';
import ROUTES from 'static/routes';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useUser } from 'utils/hooks/state/useUser';
import useUploadFile from 'utils/hooks/uploadFile/useUploadFile';
import showToast from 'utils/ts/showToast';
import mergeChatMessages from 'utils/ts/teamChatMessages';
import type { TeamChatMessage, TeamChatRoomListItem } from 'api/team/entity';
import styles from './TeamChatRoom.module.scss';

interface TeamChatRoomProps {
  recruitmentId: number;
  chatRoomId: number;
}

const PREVIOUS_MESSAGE_LOAD_THRESHOLD = 80;
const BOTTOM_STICK_THRESHOLD = 80;

const getChatRoomPreview = (room: TeamChatRoomListItem) => {
  if (!room.last_message_id) return '아직 대화가 없습니다.';
  if (room.last_message_is_image) return '사진을 보냈습니다.';
  return room.last_message_content ?? '';
};

export default function TeamChatRoom({ recruitmentId, chatRoomId }: TeamChatRoomProps) {
  const token = useTokenState();
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const { data: chatRooms } = useSuspenseQuery(teamQueries.chatRoomList(token));
  const { data: chatRoom } = useSuspenseQuery(teamQueries.chatRoom(token, recruitmentId, chatRoomId));
  const { data: messages } = useSuspenseQuery(teamQueries.chatMessages(token, recruitmentId, chatRoomId));
  const { uploadFile, isPending: isUploading } = useUploadFile();
  const [previousMessages, setPreviousMessages] = useState<TeamChatMessage[]>([]);
  const [hasPreviousMessages, setHasPreviousMessages] = useState(messages.length >= TEAM_CHAT_MESSAGE_LIMIT);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isFetchingPreviousMessagesRef = useRef(false);
  const shouldStickToBottomRef = useRef(true);
  const hasInitialScrollRef = useRef(false);

  const { mutate: sendMessage, isPending: isSending } = useMutation({
    ...teamMutations.sendChatMessage(queryClient, token, recruitmentId, chatRoomId),
    onError: () => showToast('error', '메시지를 보내지 못했어요. 다시 시도해 주세요.'),
  });
  const mergedMessages = mergeChatMessages(previousMessages, messages);
  const oldestMessageId = mergedMessages[0]?.message_id;
  const lastMessageId = mergedMessages[mergedMessages.length - 1]?.message_id;

  useEffect(() => {
    if (!hasInitialScrollRef.current || shouldStickToBottomRef.current) {
      const container = messagesContainerRef.current;
      if (container) container.scrollTop = container.scrollHeight;
      hasInitialScrollRef.current = true;
    }
  }, [lastMessageId]);

  const isReadOnly = chatRoom.status === 'READ_ONLY';
  const isTeamRoom = chatRoom.room_type === 'TEAM';
  const messageGroups = groupChatMessagesByDate(mergedMessages);
  const memberCount = isTeamRoom ? (
    <span
      className={cn({
        [styles.chatRoom__memberCount]: true,
        [styles['chatRoom__memberCount--full']]: chatRoom.member_count >= chatRoom.max_member_count,
      })}
    >
      <PeopleIcon />
      {chatRoom.member_count}/{chatRoom.max_member_count}
    </span>
  ) : undefined;

  const loadPreviousMessages = async () => {
    const container = messagesContainerRef.current;
    if (!container || !oldestMessageId || !hasPreviousMessages || isFetchingPreviousMessagesRef.current) return;

    isFetchingPreviousMessagesRef.current = true;
    const anchorMessage = container.querySelector<HTMLElement>('[data-message-id]');
    const anchorMessageId = anchorMessage?.dataset.messageId;
    const anchorTop = anchorMessage?.getBoundingClientRect().top;

    try {
      const fetchedMessages = await queryClient.fetchQuery(
        teamQueries.chatMessages(token, recruitmentId, chatRoomId, {
          beforeMessageId: oldestMessageId,
          limit: TEAM_CHAT_MESSAGE_LIMIT,
        }),
      );
      const existingMessageIds = new Set(mergedMessages.map((message) => message.message_id));
      const newMessages = fetchedMessages.filter((message) => !existingMessageIds.has(message.message_id));

      if (fetchedMessages.length < TEAM_CHAT_MESSAGE_LIMIT || newMessages.length === 0) {
        setHasPreviousMessages(false);
      }

      if (newMessages.length > 0) {
        setPreviousMessages((current) => mergeChatMessages(current, newMessages));

        requestAnimationFrame(() => {
          if (!anchorMessageId || anchorTop === undefined) return;

          const restoredAnchor = container.querySelector<HTMLElement>(`[data-message-id="${anchorMessageId}"]`);
          if (restoredAnchor) {
            container.scrollTop += restoredAnchor.getBoundingClientRect().top - anchorTop;
          }
        });
      }
    } catch {
      showToast('error', '이전 메시지를 불러오지 못했어요. 다시 시도해 주세요.');
    } finally {
      isFetchingPreviousMessagesRef.current = false;
    }
  };

  const handleMessagesScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    shouldStickToBottomRef.current = distanceFromBottom <= BOTTOM_STICK_THRESHOLD;

    if (container.scrollTop <= PREVIOUS_MESSAGE_LOAD_THRESHOLD) {
      void loadPreviousMessages();
    }
  };

  const handleSend = (content: string) => sendMessage({ content, is_image: false });

  const handleImageSelect = async (file: File) => {
    try {
      const { file_url } = await uploadFile({ domain: 'TEAM_RECRUITMENT', file });
      if (file_url) {
        sendMessage({ content: file_url, is_image: true });
      }
    } catch {}
  };

  return (
    <div className={styles.chat}>
      <aside className={styles.chat__sidebar} aria-label="채팅방 목록">
        {chatRooms.length === 0 && <p className={styles.chat__empty}>채팅방이 없습니다.</p>}
        {chatRooms.map((room) => {
          const isCurrentRoom = room.recruitment_id === recruitmentId && room.chat_room_id === chatRoomId;
          const preview = getChatRoomPreview(room);

          return (
            <Link
              key={`${room.recruitment_id}-${room.chat_room_id}`}
              href={ROUTES.TeamChat({
                recruitmentId: String(room.recruitment_id),
                chatRoomId: String(room.chat_room_id),
              })}
              className={cn({
                [styles.chat__roomItem]: true,
                [styles['chat__roomItem--active']]: isCurrentRoom,
              })}
              aria-current={isCurrentRoom ? 'page' : undefined}
            >
              <span className={styles.chat__roomAvatar} aria-hidden="true">
                <DefaultPhotoIcon />
              </span>
              <span className={styles.chat__roomContent}>
                <span className={styles.chat__roomHeader}>
                  <span className={styles.chat__roomName}>{room.room_name}</span>
                  {room.last_message_at && (
                    <span className={styles.chat__roomTime}>{formatChatRoomListTime(room.last_message_at)}</span>
                  )}
                </span>
                <span className={styles.chat__roomPreviewRow}>
                  <span className={styles.chat__roomPreview}>{preview}</span>
                  {room.unread_message_count > 0 && (
                    <span className={styles.chat__unreadCount}>{room.unread_message_count}</span>
                  )}
                </span>
              </span>
            </Link>
          );
        })}
      </aside>

      <section className={styles.chatRoom}>
        <div className={styles.chatRoom__mobileHeader}>
          <SubPageHeader title={chatRoom.room_name} size="medium" rightAction={memberCount} />
        </div>
        <div className={styles.chatRoom__desktopHeader}>
          <h2>{chatRoom.room_name}</h2>
          {memberCount}
        </div>
        <div ref={messagesContainerRef} className={styles.chatRoom__messages} onScroll={handleMessagesScroll}>
          {mergedMessages.length === 0 && <p className={styles.chatRoom__empty}>아직 대화가 없습니다.</p>}
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
                  <div
                    className={cn({
                      [styles.chatRoom__bubble]: true,
                      [styles['chatRoom__bubble--mine']]: isMine,
                      [styles['chatRoom__bubble--others']]: !isMine,
                    })}
                  >
                    {message.content}
                  </div>
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
                    <div
                      key={message.message_id}
                      className={styles['chatRoom__messageRow--mine']}
                      data-message-id={message.message_id}
                    >
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
                    data-message-id={message.message_id}
                  >
                    {isFirstOfSender && (
                      <div className={styles.chatRoom__sender}>
                        <span className={styles.chatRoom__desktopSenderIcon} aria-hidden="true">
                          <WebChatIcon />
                        </span>
                        <span className={styles.chatRoom__mobileSenderIcon} aria-hidden="true">
                          <ChatAvatarIcon />
                        </span>
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
        </div>
        <TeamChatSendBar
          disabled={isReadOnly || isSending || isUploading}
          placeholder={isReadOnly ? '종료된 채팅방입니다' : undefined}
          onSend={handleSend}
          onImageSelect={handleImageSelect}
        />
      </section>
    </div>
  );
}
