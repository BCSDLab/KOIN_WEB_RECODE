/* eslint-disable import/no-duplicates */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import { skipToken, useQuery, useSuspenseQuery } from '@tanstack/react-query';

import {
  getLostItemChatroomDetail,
  getLostItemChatroomDetailMessages,
  getLostItemChatroomList,
} from 'api/articles';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useTokenState from 'utils/hooks/state/useTokenState';
import useImageUpload from 'utils/hooks/ui/useImageUpload';
import { useUser } from 'utils/hooks/state/useUser';
import showToast from 'utils/ts/showToast';
import ROUTES from 'static/routes';
import { uploadLostItemFile } from 'api/uploadFile';

import DefaultPhotoUrl from 'assets/svg/Articles/default-photo.svg?url';
import DefaultPhotoIcon from 'assets/svg/Articles/default-photo.svg';
import SendIcon from 'assets/svg/Articles/send.svg';
import AddPhotoIcon from 'assets/svg/Articles/photo.svg';
import BlockIcon from 'assets/svg/Articles/block.svg';
import PersonIcon from 'assets/svg/Articles/person.svg';

import type { LostItemChatroomDetailMessage } from 'api/articles/entity';
import DeleteModal from './DeleteModal';
import formatDate from './formatDate';
import styles from './LostItemChatPage.module.scss';

const formatDate2 = (timestamp: string): string => {
  const date = new Date(timestamp);
  return `${(date.getMonth() + 1).toString().padStart(2, '0')}월 ${date
    .getDate()
    .toString()
    .padStart(2, '0')}일`;
};

const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  return `${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
};

function LostItemChatPage() {
  const token = useTokenState();
  const { data: user } = useUser();
  const { articleId } = useParams<{ articleId: string }>();
  const [searchParams] = useSearchParams();
  const [client, setClient] = useState<Client | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [currentMessageList, setCurrentMessageList] = useState<LostItemChatroomDetailMessage[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] = useBooleanState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: chatroomList } = useSuspenseQuery({
    queryKey: ['chatroom', 'lost-item'],
    queryFn: () => getLostItemChatroomList(token),
  });

  const chatroomId = searchParams.get('chatroomId') || chatroomList[0].chat_room_id;

  const { data: chatroomDetail } = useQuery({
    queryKey: ['chatroom', 'lost-item', articleId, chatroomId],
    queryFn: (articleId && chatroomId)
      ? () => getLostItemChatroomDetail(token, Number(articleId), Number(chatroomId)) : skipToken,
  });
  const { data: messages } = useQuery({
    queryKey: ['chatroom', 'lost-item', articleId, chatroomId, 'messages'],
    queryFn: (articleId && chatroomId)
      ? () => getLostItemChatroomDetailMessages(token, Number(articleId), Number(chatroomId))
      : skipToken,
  });

  const isCouncil = user && user.student_number === '2022136000';

  const { imgRef, saveImgFile } = useImageUpload({ uploadFn: uploadLostItemFile });

  const uploadImage = async () => {
    try {
      const imageUrlList = await saveImgFile();

      if (user === null || !chatroomDetail) {
        return;
      }

      if (imageUrlList && imageUrlList.length === 1) {
        const date = new Date();
        date.setHours(date.getHours() + 9);
        const newMessage = {
          user_nickname: user.nickname || user.anonymous_nickname,
          user_id: chatroomDetail.user_id,
          content: imageUrlList[0],
          timestamp: date.toISOString(),
          is_image: true,
          isSentByMe: true,
        };

        client?.publish({
          destination: `/app/chat/${articleId}/${chatroomId}`,
          body: JSON.stringify(newMessage),
        });
      }
    } catch (error) {
      showToast('error', '이미지 업로드에 실패했습니다.');
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  const handleSearch = () => {
    if (!inputValue.trim() || user === null || !chatroomDetail) {
      return;
    }

    const date = new Date();
    date.setHours(date.getHours() + 9);

    const newMessage = {
      user_nickname: user.nickname || user.anonymous_nickname,
      user_id: chatroomDetail.user_id,
      content: inputValue,
      timestamp: date.toISOString(),
      is_image: false,
      isSentByMe: true,
    };

    client?.publish({
      destination: `/app/chat/${articleId}/${chatroomId}`,
      body: JSON.stringify(newMessage),
    });

    setInputValue('');
  };

  const connect = () => {
    if (client) {
      client.deactivate();
    }

    const stompClient = new Client({
      brokerURL: `${import.meta.env.VITE_API_PATH}/ws-stomp`,
      connectHeaders: { Authorization: token },
      reconnectDelay: 1000000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        stompClient.subscribe(
          `/topic/chat/${articleId}/${chatroomId}`,
          (message) => {
            const receivedMessage = JSON.parse(message.body);
            setCurrentMessageList((prev) => [...prev, receivedMessage]);
          },
        );
      },
      onStompError: () => {
        showToast('error', '채팅 서버와 연결 중 오류가 발생했습니다.');
      },
    });

    stompClient.activate();
    setClient(stompClient);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (e.nativeEvent.isComposing) return;
      e.preventDefault();
      handleSearch();
    }
  };

  const disconnect = () => {
    if (client) {
      client.deactivate();
    }

    setClient(null);
  };

  const addErrorImage = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = DefaultPhotoUrl;
  };

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [chatroomId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [currentMessageList]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '45px';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      textareaRef.current.style.maxHeight = '110px';
    }
  }, [inputValue]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>쪽지</h1>

      <section className={styles['chat-container']}>
        <div className={styles['chat-list']}>
          {chatroomList?.map(({
            article_id,
            chat_room_id,
            article_title,
            last_message_at,
            lost_item_image_url,
            recent_message_content,
            unread_message_count,
          }) => (
            <Link
              key={`${chat_room_id}${article_id}`}
              to={`${ROUTES.LostItemChat({ articleId: String(article_id), isLink: true })}?chatroomId=${chat_room_id}`}
              className={styles['chat-list--item']}
            >
              {lost_item_image_url
                ? <div className={styles['chat-list--item--profile']}><img src={lost_item_image_url} alt="분실물 이미지" className={styles['chat-list--item--image']} onError={addErrorImage} /></div>
                : <div className={styles['chat-list--item--profile']}><DefaultPhotoIcon /></div>}
              <div className={styles['chat-list--item--content']}>
                <div className={styles['chat-list--item--title']}>
                  <div>{article_title}</div>
                  <div>{formatDate(last_message_at)}</div>
                </div>
                <div className={styles['chat-list--item--description']}>
                  <div className={styles['chat-list--preview-content']}>{recent_message_content}</div>
                  {unread_message_count !== 0 && <div className={styles['chat-list--message-count']}>{unread_message_count}</div>}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles['chat-view']}>
          {chatroomDetail && messages && (
            <>
              <div className={styles['chat-view--header']}>
                <div>
                  <img src={chatroomDetail.chat_partner_profile_image} alt="분실물 이미지" className={styles['chat-list--item--profile']} onError={addErrorImage} />
                  <div className={styles['chat-view--title']}>{chatroomDetail.article_title}</div>
                </div>
                <button
                  type="button"
                  className={styles['chat-block']}
                  onClick={openDeleteModal}
                >
                  <BlockIcon />
                  <div>차단하기</div>
                </button>
              </div>

              <div className={styles['message-container']} ref={chatContainerRef}>
                {messages.reduce((acc, message, index) => {
                  const messageDate = formatDate2(message.timestamp);
                  const prevDate = index > 0 ? formatDate2(messages[index - 1].timestamp) : null;
                  const messageTime = formatTime(message.timestamp);
                  const prevTime = index > 0 ? formatTime(messages[index - 1].timestamp) : null;
                  const isSenderChanged = message.user_id !== messages[index - 1]?.user_id;

                  return acc.concat(
                    (index === 0 || messageDate !== prevDate) && <div key={`date-${index}`} className={styles['message-date-header']}>{messageDate}</div>,
                    (
                      ((message.user_id === 5805 && isCouncil)
                      || (message.user_id !== 5805 && !isCouncil))
                        ? (
                          <div key={index} className={styles['message-item__right']}>
                            <span className={styles['message-item--time']}>{formatTime(message.timestamp)}</span>
                            <span className={styles['message-item--content__right']}>{message.is_image ? <img src={message.content} alt="메세지 이미지" className={styles['message-item--content-image']} /> : message.content}</span>
                          </div>
                        )
                        : (
                          <div key={index} className={styles['message-item-container']}>
                            { (isSenderChanged || (messageTime !== prevTime)) && (
                              <div className={styles['message-item--header']}>
                                <div className={styles['message-item--profile']}><PersonIcon /></div>
                                <div className={styles['message-item--name']}>{message.user_nickname || user?.anonymous_nickname || '익명'}</div>
                              </div>
                            )}
                            <div className={styles['message-item']}>
                              <span className={styles['message-item--content']}>{message.is_image ? <img src={message.content} alt="메세지 이미지" className={styles['message-item--content-image']} /> : message.content}</span>
                              <span className={styles['message-item--time']}>{formatTime(message.timestamp)}</span>
                            </div>
                          </div>
                        )
                    ),
                  );
                }, [] as React.ReactNode[])}
                {currentMessageList.length > 0
                && currentMessageList.reduce((acc, message, index) => {
                  const messageDate = formatDate2(message.timestamp);
                  const prevDate = index === 0
                    ? formatDate2(messages[messages.length - 1]?.timestamp)
                    : formatDate2(currentMessageList[index - 1].timestamp);

                  return acc.concat(
                    (messageDate !== prevDate) && <div key={`date-${index}`} className={styles['message-date-header']}>{messageDate}</div>,
                    (
                      ((message.user_id === 5805 && isCouncil)
                      || (message.user_id !== 5805 && !isCouncil))
                        ? (
                          <div key={index} className={styles['message-item__right']}>
                            <span className={styles['message-item--time']}>{formatTime(message.timestamp)}</span>
                            <span className={styles['message-item--content__right']}>{message.is_image ? <img src={message.content} alt="메세지 이미지" className={styles['message-item--content-image']} /> : message.content}</span>
                          </div>
                        )
                        : (
                          <div key={index} className={styles['message-item']}>
                            <span className={styles['message-item--content']}>{message.is_image ? <img src={message.content} alt="메세지 이미지" className={styles['message-item--content-image']} /> : message.content}</span>
                            <span className={styles['message-item--time']}>{formatTime(message.timestamp)}</span>
                          </div>
                        )
                    ),
                  );
                }, [] as React.ReactNode[])}
              </div>
              <div className={styles['chat-input-container-wrapper']}>
                <div className={styles['chat-input-container']}>
                  <div className={styles['chat-input--photo']}>
                    <label htmlFor="image-file" className={styles['message-button']}>
                      <AddPhotoIcon />
                      <input
                        type="file"
                        ref={imgRef}
                        accept="image/*"
                        id="image-file"
                        multiple
                        onChange={uploadImage}
                        aria-label="사진 전송"
                      />
                    </label>
                  </div>
                  <textarea
                    ref={textareaRef}
                    className={styles['chat-input']}
                    value={inputValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="검색어 입력"
                  />
                  <button type="button" onClick={handleSearch} className={styles['message-button']} aria-label="문자 전송">
                    <SendIcon />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
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

export default LostItemChatPage;
