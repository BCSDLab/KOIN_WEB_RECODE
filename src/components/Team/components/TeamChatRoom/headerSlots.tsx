import { useRouter } from 'next/router';

import { cn } from '@bcsdlab/utils';
import { useQuery } from '@tanstack/react-query';
import type { TeamChatRoomResponse } from 'api/team/entity';
import { teamQueries } from 'api/team/queries';
import PeopleIcon from 'assets/svg/Team/people.svg';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';

import styles from './TeamChatRoom.module.scss';

export function ChatRoomMemberCount({ chatRoom }: { chatRoom: TeamChatRoomResponse }) {
  if (chatRoom.room_type !== 'TEAM') return null;

  return (
    <span
      className={cn({
        [styles['chat-room__memberCount']]: true,
        [styles['chat-room__memberCount--full']]: chatRoom.member_count >= chatRoom.max_member_count,
      })}
    >
      <PeopleIcon />
      {chatRoom.member_count}/{chatRoom.max_member_count}
    </span>
  );
}

// 헤더는 페이지의 Suspense 경계 밖이라 suspend하면 헤더 전체가 사라진다. 페이지가 채운 캐시를 useQuery로 읽는다
function useCurrentChatRoom() {
  const router = useRouter();
  const isLoggedIn = useIsLoggedIn();
  const recruitmentId = Number(router.query.recruitmentId);
  const chatRoomId = Number(router.query.chatRoomId);
  const { data } = useQuery({
    ...teamQueries.chatRoom(isLoggedIn, recruitmentId, chatRoomId),
    enabled: !!recruitmentId && !!chatRoomId,
  });

  return data;
}

export function TeamChatRoomTitle() {
  return <>{useCurrentChatRoom()?.room_name}</>;
}

export function TeamChatRoomMemberCount() {
  const chatRoom = useCurrentChatRoom();

  return chatRoom ? <ChatRoomMemberCount chatRoom={chatRoom} /> : null;
}
