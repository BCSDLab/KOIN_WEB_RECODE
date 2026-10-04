import { Suspense } from 'react';

import { cn } from '@bcsdlab/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { TeamChatRoomListItem } from 'api/team/entity';
import { teamQueries } from 'api/team/queries';
import DefaultPhotoIcon from 'assets/svg/Team/default-photo.svg';
import ErrorBoundary from 'components/boundary/ErrorBoundary';
import LoadingSpinner from 'components/feedback/LoadingSpinner';
import TeamChatRoom from 'components/Team/components/TeamChatRoom';
import { ChatLayout, ChatRoomList } from 'components/ui/Chat';
import ROUTES from 'static/routes';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';
import { formatChatRoomListTime } from 'utils/ts/chatTime';

import styles from './TeamChat.module.scss';

interface TeamChatProps {
  selectedRoom?: { recruitmentId: number; chatRoomId: number };
}

const getChatRoomPreview = (room: TeamChatRoomListItem) => {
  if (room.last_message_is_image) return '사진을 보냈습니다.';

  return room.last_message_content ?? '';
};

export default function TeamChat({ selectedRoom }: TeamChatProps) {
  const isLoggedIn = useIsLoggedIn();
  const { data: chatRooms } = useSuspenseQuery(teamQueries.chatRoomList(isLoggedIn));
  const { recruitmentId, chatRoomId } = selectedRoom ?? {};

  const sidebarItems = chatRooms.map((room) => ({
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
    <ChatLayout
      className={cn({ [styles.chat]: true, [styles['chat--selected']]: !!selectedRoom })}
      sidebarClassName={styles.chat__sidebar}
      panelClassName={styles.chat__panel}
      sidebar={<ChatRoomList items={sidebarItems} />}
    >
      {selectedRoom ? (
        <ErrorBoundary
          key={`${selectedRoom.recruitmentId}-${selectedRoom.chatRoomId}`}
          fallbackClassName={styles.chat__status}
        >
          <Suspense
            fallback={
              <div className={styles.chat__status} role="status" aria-label="채팅방을 불러오는 중입니다.">
                <LoadingSpinner size="50px" />
              </div>
            }
          >
            <TeamChatRoom recruitmentId={selectedRoom.recruitmentId} chatRoomId={selectedRoom.chatRoomId} />
          </Suspense>
        </ErrorBoundary>
      ) : (
        <div className={styles.chat__status}>채팅방을 선택해 주세요.</div>
      )}
    </ChatLayout>
  );
}
