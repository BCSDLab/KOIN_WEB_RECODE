/* eslint-disable @next/next/no-img-element */
/* eslint-disable import/no-duplicates */
// NOTE: 이 페이지는 이미지가 동적으로 바뀌고(채팅/썸네일/메시지), 크기·비율이 제각각입니다.
// next/image 도입 시 sizes/fill 등 설정·관리 비용이 커지는데 비해(특히 작은/반복 이미지) 체감 이득이 작아 <img>를 유지합니다.

import React, { useEffect, useRef, useState } from 'react';

import BlockIcon from 'assets/svg/Articles/block.svg';
import DefaultPhotoIcon from 'assets/svg/Articles/default-photo.svg';
import DefaultPhotoUrl from 'assets/svg/Articles/default-photo.svg';
import PersonIcon from 'assets/svg/Articles/person.svg';
import AddPhotoIcon from 'assets/svg/Articles/photo.svg';
import SendIcon from 'assets/svg/Articles/send.svg';

import { useChatLogger } from 'components/Articles/hooks/useChatLogger';
import DeleteModal from 'components/Articles/LostItemChatPage/components/DeleteModal';
import useChatPolling from 'components/Articles/LostItemChatPage/hooks/useChatPolling';
import {
  formatDate,
  formatISODateToKoreanDate,
  formatISODateToTime,
} from 'components/Articles/LostItemChatPage/utils/date';
import { ChatMessageList, ChatRoomList, type ChatMessageListGroup } from 'components/ui/Chat';
import ROUTES from 'static/routes';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useParamsHandler from 'utils/hooks/routing/useParamsHandler';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useMount from 'utils/hooks/state/useMount';
import useNetworkStatus from 'utils/hooks/state/useNetworkStatus';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useUser } from 'utils/hooks/state/useUser';
import useImageUpload, { UploadError } from 'utils/hooks/ui/useImageUpload';
import showToast from 'utils/ts/showToast';
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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
  } = useChatPolling({
    token,
    articleId: searchParams.get('articleId'),
    chatroomId: chatroomIdParam,
    isOnline,
    autoSelectFirst: showDetail,
  });

  const prevMessagesLengthRef = useRef(0);

  const uploadImage = async () => {
    try {
      if (userInfo === null || !chatroomDetail) {
        showToast('error', '유저정보 혹은 채팅방 정보를 불러오는데 실패했습니다.');
        return;
      }

      const imageUrlList = await saveImgFile();
      if (imageUrlList && imageUrlList.length === 1) {
        sendChatMessage({ content: imageUrlList[0], isImage: true });
      }
    } catch (error) {
      if (error instanceof UploadError) {
        showToast('error', error.message);
      }
    }
  }

  const sendMessage = () => {
    if (!inputValue.trim() || userInfo === null || !chatroomDetail) {
      return;
    }

    sendChatMessage({ content: inputValue });
    setInputValue('');
  }

  const sendMessageToEnterKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (e.nativeEvent.isComposing) return;
      e.preventDefault();
      sendMessage();
    }
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

  /**
   * @description
   * 메세지 입력창의 높이를 자동으로 조절합니다.
   */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '45px';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      textareaRef.current.style.maxHeight = '110px';
    }
  }, [inputValue]);

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
      timeLabel: formatDate(last_message_at),
      preview: recent_message_content,
      unreadCount: unread_message_count,
      avatar: lost_item_image_url ? (
        <img
          src={lost_item_image_url}
          alt="분실물 이미지"
          className={styles['chat-list--item--image']}
          onError={addErrorImage}
        />
      ) : (
        <DefaultPhotoIcon />
      ),
      onClick: logMessageListSelcetClick,
    }),
  );

  const messageGroups = (messages ?? []).reduce<ChatMessageListGroup[]>((groups, message, index, allMessages) => {
    const dateLabel = formatISODateToKoreanDate(message.timestamp);
    const timeLabel = formatISODateToTime(message.timestamp);
    const previousMessage = allMessages[index - 1];
    const showSender =
      !previousMessage ||
      message.user_id !== previousMessage.user_id ||
      timeLabel !== formatISODateToTime(previousMessage.timestamp);
    const normalizedMessage = {
      key: `${message.timestamp}-${index}`,
      isMine: message.user_id === userInfo?.id,
      content: message.content,
      isImage: message.is_image,
      imageAlt: '메세지 이미지',
      timeLabel,
      showSender,
      senderName: message.user_nickname || userInfo?.anonymous_nickname || '익명',
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

      <section className={styles['chat-container']}>
        {showList && (
          <div className={styles['chat-list']}>
            <ChatRoomList
              items={chatRoomItems}
              classNames={{
                item: styles['chat-list--item'],
                avatar: styles['chat-list--item--profile'],
                content: styles['chat-list--item--content'],
                header: styles['chat-list--item--title'],
                time: styles['chat-list--item--date'],
                previewRow: styles['chat-list--item--description'],
                preview: styles['chat-list--preview-content'],
                unreadCount: styles['chat-list--message-count'],
                empty: styles.chat__empty,
              }}
              emptyContent="채팅방이 없습니다.🧐"
            />
          </div>
        )}

        {showDetail && (
          <div className={styles['chat-view']}>
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
                        className={styles['chat-list--item--profile']}
                        onError={addErrorImage}
                      />
                    ) : (
                      <div className={styles['chat-list--item--profile']}>
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
                  <ChatMessageList
                    groups={messageGroups}
                    classNames={{
                      dateLabel: styles['message-date-header'],
                      mineRow: styles['message-item__right'],
                      otherGroup: styles['message-item-container'],
                      sender: styles['message-item--header'],
                      senderName: styles['message-item--name'],
                      otherRow: styles['message-item'],
                      bubbleMine: styles['message-item--content__right'],
                      bubbleOthers: styles['message-item--content'],
                      image: styles['message-item--content-image'],
                      time: styles['message-item--time'],
                    }}
                    bubbleElement="span"
                  />
                </div>
                <div className={styles['chat-input-container-wrapper']}>
                  {!isOnline && (
                    <div className={styles['offline-banner']}>오프라인 상태입니다. 저장된 메시지만 볼 수 있습니다.</div>
                  )}
                  <div className={styles['chat-input-container']}>
                    <div className={styles['chat-input--photo']}>
                      <label
                        htmlFor="image-file"
                        className={`${styles['message-button']} ${!isOnline ? styles['message-button--disabled'] : ''}`}
                      >
                        <AddPhotoIcon />
                        <input
                          type="file"
                          ref={imgRef}
                          accept="image/*"
                          id="image-file"
                          multiple
                          onChange={uploadImage}
                          disabled={!isOnline}
                          aria-label="사진 전송"
                        />
                      </label>
                    </div>
                    <textarea
                      ref={textareaRef}
                      className={styles['chat-input']}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={sendMessageToEnterKeyDown}
                      placeholder={isOnline ? '메세지 보내기' : '오프라인 상태입니다'}
                      disabled={!isOnline}
                    />
                    <button
                      type="button"
                      onClick={sendMessage}
                      className={`${styles['message-button']} ${!isOnline ? styles['message-button--disabled'] : ''}`}
                      disabled={!isOnline}
                      aria-label="문자 전송"
                    >
                      <SendIcon />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </section>

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
