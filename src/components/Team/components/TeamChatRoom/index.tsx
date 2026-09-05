import { useEffect, useRef, useState } from 'react';
import { cn } from '@bcsdlab/utils';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { teamMutations } from 'api/team/mutations';
import { TEAM_CHAT_MESSAGE_LIMIT, teamQueries } from 'api/team/queries';
import ChatAvatarIcon from 'assets/svg/Team/chat-avatar.svg';
import DefaultPhotoIcon from 'assets/svg/Team/default-photo.svg';
import PeopleIcon from 'assets/svg/Team/people.svg';
import WebChatIcon from 'assets/svg/Team/web_chat.svg';
import TeamChatSendBar from 'components/Team/components/TeamChatSendBar';
import formatChatTime, { formatChatRoomListTime } from 'components/Team/utils/formatChatTime';
import groupChatMessagesByDate from 'components/Team/utils/groupChatMessagesByDate';
import { ChatMessageList, ChatRoomList } from 'components/ui/Chat';
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

interface ChatRoomSidebarListProps extends TeamChatRoomProps {
  chatRooms: TeamChatRoomListItem[];
}

const PREVIOUS_MESSAGE_LOAD_THRESHOLD = 80;
const BOTTOM_STICK_THRESHOLD = 80;

const getChatRoomPreview = (room: TeamChatRoomListItem) => {
  if (room.last_message_is_image) return '사진을 보냈습니다.';
  return room.last_message_content ?? '';
};

function ChatRoomSidebarList({ chatRooms, recruitmentId, chatRoomId }: ChatRoomSidebarListProps) {
  const items = chatRooms.map((room) => ({
    key: `${room.recruitment_id}-${room.chat_room_id}`,
    href: ROUTES.TeamChat({
      recruitmentId: String(room.recruitment_id),
      chatRoomId: String(room.chat_room_id),
    }),
    title: room.room_name,
    timeLabel: room.last_message_at ? formatChatRoomListTime(room.last_message_at) : undefined,
    preview: getChatRoomPreview(room),
    unreadCount: room.unread_message_count,
    avatar: <DefaultPhotoIcon />,
    avatarAriaHidden: true,
    isActive: room.recruitment_id === recruitmentId && room.chat_room_id === chatRoomId,
  }));

  return (
    <ChatRoomList
      items={items}
      classNames={{
        item: styles.chat__roomItem,
        activeItem: styles['chat__roomItem--active'],
        avatar: styles.chat__roomAvatar,
        content: styles.chat__roomContent,
        header: styles.chat__roomHeader,
        title: styles.chat__roomName,
        time: styles.chat__roomTime,
        previewRow: styles.chat__roomPreviewRow,
        preview: styles.chat__roomPreview,
        unreadCount: styles.chat__unreadCount,
        empty: styles.chat__empty,
      }}
      emptyContent="채팅방이 없습니다."
      contentElement="span"
      emptyElement="p"
    />
  );
}

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
  const messageGroups = groupChatMessagesByDate(mergedMessages).map((group) => ({
    key: group.date,
    dateLabel: group.label,
    messages: group.messages.map((message, index) => ({
      key: message.message_id,
      messageId: message.message_id,
      isMine: message.user_id === user?.id,
      content: message.content,
      isImage: message.is_image,
      imageAlt: '전송된 이미지',
      timeLabel: formatChatTime(message.timestamp),
      unreadCount: message.unread_count,
      showSender: index === 0 || group.messages[index - 1].user_id !== message.user_id,
      senderName: message.user_nickname,
      senderAvatar: (
        <>
          <span className={styles.chatRoom__desktopSenderIcon} aria-hidden="true">
            <WebChatIcon />
          </span>
          <span className={styles.chatRoom__mobileSenderIcon} aria-hidden="true">
            <ChatAvatarIcon />
          </span>
        </>
      ),
    })),
  }));
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
        <ChatRoomSidebarList chatRooms={chatRooms} recruitmentId={recruitmentId} chatRoomId={chatRoomId} />
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
          <ChatMessageList
            groups={messageGroups}
            classNames={{
              dateContainer: styles.chatRoom__dateChip,
              dateLabel: styles.chatRoom__dateLabel,
              mineRow: styles['chatRoom__messageRow--mine'],
              otherGroup: styles.chatRoom__messageGroup,
              otherGroupConsecutive: styles['chatRoom__messageGroup--consecutive'],
              sender: styles.chatRoom__sender,
              senderName: styles.chatRoom__senderName,
              otherRow: styles['chatRoom__messageRow--others'],
              bubbleMine: `${styles.chatRoom__bubble} ${styles['chatRoom__bubble--mine']}`,
              bubbleOthers: `${styles.chatRoom__bubble} ${styles['chatRoom__bubble--others']}`,
              imageBubble: styles.chatRoom__imageBubble,
              meta: styles.chatRoom__meta,
              metaMine: styles['chatRoom__meta--mine'],
              unreadCount: styles.chatRoom__unreadCount,
              time: styles.chatRoom__time,
            }}
            wrapGroups
            dateLabelElement="span"
            senderNameElement="span"
          />
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
