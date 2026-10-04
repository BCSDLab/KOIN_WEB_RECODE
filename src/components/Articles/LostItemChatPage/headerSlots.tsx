import { useQuery } from '@tanstack/react-query';
import { articleQueries } from 'api/articles/queries';
import ChatHeaderMenu from 'components/Articles/LostItemChatPage/components/ChatHeaderMenu';
import DeleteModal from 'components/Articles/LostItemChatPage/components/DeleteModal';
import type { Portal } from 'components/modal/Modal/PortalProvider';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import useParamsHandler from 'utils/hooks/routing/useParamsHandler';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';

// 모바일은 chatroomId가 있을 때만 대화 화면이다. 페이지가 채운 캐시를 useQuery로 읽는다
function useOpenedChatroom() {
  const isLoggedIn = useIsLoggedIn();
  const { searchParams } = useParamsHandler();
  const chatroomId = searchParams.get('chatroomId');
  const { data: chatroomList } = useQuery({
    ...articleQueries.lostItemChatroomList(isLoggedIn),
    enabled: isLoggedIn && !!chatroomId,
  });
  const articleId =
    searchParams.get('articleId') ??
    chatroomList?.find((room) => room.chat_room_id === Number(chatroomId))?.article_id ??
    null;
  const { data: chatroomDetail } = useQuery({
    ...articleQueries.lostItemChatroomDetail(isLoggedIn, Number(articleId), Number(chatroomId)),
    enabled: isLoggedIn && !!chatroomId && articleId != null,
  });

  if (!chatroomId || articleId == null || !chatroomDetail) return null;

  return { chatroomId: Number(chatroomId), articleId: Number(articleId), chatroomDetail };
}

export function LostItemChatTitle() {
  return <>{useOpenedChatroom()?.chatroomDetail.article_title ?? '쪽지'}</>;
}

export function LostItemChatMenu() {
  const portalManager = useModalPortal();
  const chatroom = useOpenedChatroom();

  if (!chatroom) return null;

  const openBlockModal = () =>
    portalManager.open((portalOption: Portal) => (
      <DeleteModal
        articleId={chatroom.articleId}
        chatroomId={chatroom.chatroomId}
        closeDeleteModal={portalOption.close}
      />
    ));

  return <ChatHeaderMenu onBlockClick={openBlockModal} />;
}
