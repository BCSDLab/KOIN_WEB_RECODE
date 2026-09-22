/* eslint-disable @next/next/no-img-element -- 이미지가 동적으로 바뀌고 크기·비율이 제각각이라 sizes/fill 설정 비용 대비 이득이 작음 */

import React, { useEffect, useRef, useState } from 'react';

import BlockIcon from 'assets/svg/Articles/block.svg';
// FIXME: svg 웹팩 로더가 쿼리와 무관하게 항상 컴포넌트를 반환해, addErrorImage의 img.src에 대입되는
// 아래 DefaultPhotoUrl은 실제로는 문자열이 아닐 수 있다 (별도 확인 필요).
// eslint-disable-next-line import/no-duplicates -- 위 FIXME 참고, 문자열 URL을 얻으려던 의도였음
import DefaultPhotoIcon from 'assets/svg/Articles/default-photo.svg';
// eslint-disable-next-line import/no-duplicates -- 위 FIXME 참고, 문자열 URL을 얻으려던 의도였음
import DefaultPhotoUrl from 'assets/svg/Articles/default-photo.svg';
import PersonIcon from 'assets/svg/Articles/person.svg';
import { useChatLogger } from 'components/Articles/hooks/useChatLogger';
import ChatHeaderMenu from 'components/Articles/LostItemChatPage/components/ChatHeaderMenu';
import DeleteModal from 'components/Articles/LostItemChatPage/components/DeleteModal';
import useChatPolling from 'components/Articles/LostItemChatPage/hooks/useChatPolling';
import {
  formatDate,
  formatISODateToFullDate,
  formatISODateToMonthAndDay,
  formatISODateToTime,
} from 'components/Articles/LostItemChatPage/utils/date';
import Layout from 'components/layout';
  ChatLayout,
  ChatMessageInput,
  ChatMessageList,
  ChatRoomList,
  type ChatMessageListGroup,
} from 'components/ui/Chat';
import ROUTES from 'static/routes';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useParamsHandler from 'utils/hooks/routing/useParamsHandler';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useMount from 'utils/hooks/state/useMount';
import useNetworkStatus from 'utils/hooks/state/useNetworkStatus';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useUser } from 'utils/hooks/state/useUser';
import useImageUpload, { UploadError } from 'utils/hooks/ui/useImageUpload';
import { formatChatDate, formatChatTime, formatChatRoomListTime } from 'utils/ts/chatTime';
import showToast from 'utils/ts/showToast';
import { useHeaderTitle } from 'utils/zustand/customTitle';
import { useHeaderButtonStore } from 'utils/zustand/headerButtonStore';

import styles from './LostItemChatPage.module.scss';

function LostItemChatPage({ token }: { token: string }) {
  const isMobile = useMediaQuery();
  const isOnline = useNetworkStatus();
  const { searchParams } = useParamsHandler();
  const { data: userInfo } = useUser();

  const { imgRef, saveImgFile } = useImageUpload({ domain: 'LOST_ITEMS' });

  const [inputValue, setInputValue] = useState('');
  const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] = useBooleanState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { logMessageListSelcetClick } = useChatLogger();

  const chatroomIdParam = searchParams.get('chatroomId');
  const showList = !isMobile || !chatroomIdParam;
  const showDetail = !isMobile || !!chatroomIdParam;

  const {
    chatroomDetail,
    chatroomList,
    messages,
    defaultChatroomId: chatroomId,
    defaultArticleId: articleId,
    sendMessage: sendChatMessage,
    sendMessageAsync: sendChatMessageAsync,
  } = useChatPolling({
    token,
    articleId: searchParams.get('articleId'),
    chatroomId: chatroomIdParam,
    isOnline,
    autoSelectFirst: showDetail,
  });

  const { setCustomTitle, resetCustomTitle } = useHeaderTitle();
  const setButtonContent = useHeaderButtonStore((state) => state.setButtonContent);

  useEffect(() => {
    setCustomTitle(showDetail && chatroomDetail ? chatroomDetail.article_title : '쪽지');
  }, [showDetail, chatroomDetail, setCustomTitle]);
  useEffect(() => resetCustomTitle, [resetCustomTitle]);

  useEffect(() => {
    if (showDetail && chatroomDetail) {
      setButtonContent(<ChatHeaderMenu onBlockClick={openDeleteModal} />);
    }
  }, [showDetail, chatroomDetail, openDeleteModal, setButtonContent]);

  const prevMessagesLengthRef = useRef(0);

  const uploadImage = async () => {
    try {
      if (userInfo === null || !chatroomDetail) {
        showToast('error', '유저정보 혹은 채팅방 정보를 불러오는데 실패했습니다.');

        return;
      }

      const imageUrlList = await saveImgFile();
      for (const imageUrl of imageUrlList) {
        try {
          await sendChatMessageAsync({ content: imageUrl, isImage: true });
        } catch {
          continue;
        }
      }
    } catch (error) {
      if (error instanceof UploadError) {
        showToast('error', error.message);
      }
    }
  };

  const sendMessage = () => {
    if (!inputValue.trim() || userInfo === null || !chatroomDetail) {
      return false;
    }

    sendChatMessage({ content: inputValue });
    setInputValue('');

    return true;
  };

  const addErrorImage = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = DefaultPhotoUrl;
  };

  useEffect(() => {
    const currentLength = messages?.length ?? 0;
    const hasNewMessages = currentLength > prevMessagesLengthRef.current;
    prevMessagesLengthRef.current = currentLength;

    if (hasNewMessages && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const chatRoomItems = (chatroomList ?? []).map(
    ({
      article_id,
      chat_room_id,
      article_title,
      last_message_at,
      lost_item_image_url,
      recent_message_content,
      unread_message_count,
    }) => ({
      key: `${chat_room_id}-${article_id}`,
      href: `${ROUTES.LostItemChat()}?chatroomId=${chat_room_id}&articleId=${article_id}`,
      title: article_title,
      timeLabel: formatChatRoomListTime(last_message_at),
      preview: recent_message_content,
      unreadCount: unread_message_count,
      avatar: lost_item_image_url ? (
        <img
          src={lost_item_image_url}
          alt="분실물 이미지"
          className={styles['chat-list--item-image']}
          onError={addErrorImage}
        />
      ) : (
        <DefaultPhotoIcon />
      ),
      isActive: article_id === Number(articleId) && chat_room_id === Number(chatroomId),
      onClick: logMessageListSelcetClick,
    }),
  );

  const messageGroups = (messages ?? []).reduce<ChatMessageListGroup[]>((groups, message, index) => {
    const dateLabel = formatChatDate(message.timestamp);
    const timeLabel = formatChatTime(message.timestamp);
    const normalizedMessage = {
      key: `${message.timestamp}-${index}`,
      isMine: message.user_id === userInfo?.id,
      content: message.content,
      isImage: message.is_image,
      timeLabel,
      senderId: message.user_id,
      senderName: message.user_nickname || '익명',
      senderAvatar: (
        <div className={styles['message-item--profile']}>
          <PersonIcon />
        </div>
      ),
    };
    const lastGroup = groups[groups.length - 1];

    if (lastGroup?.dateLabel === dateLabel) {
      lastGroup.messages.push(normalizedMessage);

      return groups;
    }

    groups.push({
      key: `${dateLabel}-${index}`,
      dateLabel,
      messages: [normalizedMessage],
    });

    return groups;
  }, []);

  return (
    <div className={styles.container}>
      {!isMobile && <h1 className={styles.title}>쪽지</h1>}

      <ChatLayout
        className={styles['chat-container']}
        sidebarClassName={styles['chat-list']}
        panelClassName={styles['chat-view']}
        sidebar={showList && <ChatRoomList items={chatRoomItems} />}
      >
        {showDetail && (
          <>
            {!(chatroomDetail && messages) && (
              <div className={styles.chat__empty}>
                선택된 채팅방이 없습니다.
                <br />
                왼쪽 리스트에서 채팅방을 선택해주세요.🙇‍♂️
              </div>
            )}
            {chatroomDetail && messages && (
              <>
                <div className={styles['chat-view--header']}>
                  <div>
                    {chatroomDetail.chat_partner_profile_image ? (
                      <img
                        src={chatroomDetail.chat_partner_profile_image}
                        alt="분실물 이미지"
                        className={styles['chat-list--item-profile']}
                        onError={addErrorImage}
                      />
                    ) : (
                      <div className={styles['chat-list--item-profile']}>
                        <DefaultPhotoIcon />
                      </div>
                    )}
                    <div className={styles['chat-view--title']}>{chatroomDetail.article_title}</div>
                  </div>
                  <button type="button" className={styles['chat-block']} onClick={openDeleteModal}>
                    <BlockIcon />
                    <div>차단하기</div>
                  </button>
                </div>

                <div className={styles['message-container']} ref={chatContainerRef}>
                  <ChatMessageList groups={messageGroups} />
                </div>
                <div className={styles['chat-input-container-wrapper']}>
                  {!isOnline && (
                    <div className={styles['offline-banner']}>오프라인 상태입니다. 저장된 메시지만 볼 수 있습니다.</div>
                  )}
                  <ChatMessageInput
                    classNames={{
                      container: styles['chat-input-container'],
                      imageControl: styles['image-button'],
                      textarea: styles['chat-input'],
                      sendButton: styles['send-button'],
                    }}
                    value={inputValue}
                    onChange={setInputValue}
                    onSend={sendMessage}
                    onImageChange={() => {
                      void uploadImage();
                    }}
                    disabled={!isOnline}
                    placeholder={isOnline ? undefined : '오프라인 상태입니다'}
                    fileInputRef={imgRef}
                    imageInputMultiple
                  />
                </div>
              </>
            )}
          </>
        )}
      </ChatLayout>

      {isDeleteModalOpen && (
        <DeleteModal
          articleId={Number(articleId)}
          chatroomId={Number(chatroomId)}
          closeDeleteModal={closeDeleteModal}
        />
      )}
    </div>
  );
}

export default function LostItemChatPageWrapper() {
  const token = useTokenState();
  const mounted = useMount();

  if (!mounted || !token) return null;

  return <LostItemChatPage token={token} />;
}

LostItemChatPageWrapper.requireAuth = true;
LostItemChatPageWrapper.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;
