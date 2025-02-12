/* eslint-disable import/no-duplicates */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Client } from '@stomp/stompjs';

import useBooleanState from 'utils/hooks/state/useBooleanState';
import useTokenState from 'utils/hooks/state/useTokenState';
import useImageUpload from 'utils/hooks/ui/useImageUpload';
import { useUser } from 'utils/hooks/state/useUser';
import showToast from 'utils/ts/showToast';
import ROUTES from 'static/routes';
import { uploadLostItemFile } from 'api/uploadFile';
import type { LostItemChatroomDetailMessage } from 'api/articles/entity';

import DefaultPhotoUrl from 'assets/svg/Articles/default-photo.svg?url';
import DefaultPhotoIcon from 'assets/svg/Articles/default-photo.svg';
import SendIcon from 'assets/svg/Articles/send.svg';
import AddPhotoIcon from 'assets/svg/Articles/photo.svg';
import BlockIcon from 'assets/svg/Articles/block.svg';
import PersonIcon from 'assets/svg/Articles/person.svg';

import DeleteModal from './components/DeleteModal';
import useChatroomQuery from './hooks/useChatroomQuery';
import {
  formatDate,
  formatISODateToMonthAndDay,
  formatISODateToTime,
  getKoreaISODate,
} from './utils/date';
import styles from './LostItemChatPage.module.scss';

const COUNCIL_ID = 5805;
const COUNCIL_STUDENT_NUMBER = '2022136000';

function LostItemChatPage() {
  const { articleId } = useParams<{ articleId: string }>();
  const [searchParams] = useSearchParams();

  const token = useTokenState();
  const { data: user } = useUser();
  const { imgRef, saveImgFile } = useImageUpload({ uploadFn: uploadLostItemFile });

  const [client, setClient] = useState<Client | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [currentMessageList, setCurrentMessageList] = useState<LostItemChatroomDetailMessage[]>([]);
  const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] = useBooleanState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    chatroomDetail,
    chatroomList,
    messages,
    defaultChatroomId: chatroomId,
  } = useChatroomQuery(token, articleId || null, searchParams.get('chatroomId'));

  const isCouncil = user && user.student_number === COUNCIL_STUDENT_NUMBER;

  const connectChatroom = () => {
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

  const disconnectChatroom = () => {
    if (client) {
      client.deactivate();
    }

    setClient(null);
  };

  const uploadImage = async () => {
    try {
      if (user === null || !chatroomDetail) {
        showToast('error', '유저정보 혹은 채팅방 정보를 불러오는데 실패했습니다.');
        return;
      }

      const imageUrlList = await saveImgFile();
      if (imageUrlList && imageUrlList.length === 1) {
        const newMessage = {
          user_nickname: user.nickname || user.anonymous_nickname,
          user_id: chatroomDetail.user_id,
          content: imageUrlList[0],
          timestamp: getKoreaISODate(),
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

  const sendMessage = () => {
    try {
      if (!inputValue.trim() || user === null || !chatroomDetail) {
        return;
      }

      const newMessage = {
        user_nickname: user.nickname || user.anonymous_nickname,
        user_id: chatroomDetail.user_id,
        content: inputValue,
        timestamp: getKoreaISODate(),
        is_image: false,
        isSentByMe: true,
      };

      client?.publish({
        destination: `/app/chat/${articleId}/${chatroomId}`,
        body: JSON.stringify(newMessage),
      });

      setInputValue('');
    } catch (error) {
      showToast('error', '메세지 전송에 실패했습니다.');
    }
  };

  const sendMessageToEnterKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
    connectChatroom();

    return () => {
      disconnectChatroom();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatroomId]);

  /**
   * @description
   * 채팅방의 메세지를 받아온 후, 스크롤을 맨 아래로 내립니다.
   */
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [currentMessageList]);

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
                  {chatroomDetail.chat_partner_profile_image
                    ? <img src={chatroomDetail.chat_partner_profile_image} alt="분실물 이미지" className={styles['chat-list--item--profile']} onError={addErrorImage} />
                    : <div className={styles['chat-list--item--profile']}><DefaultPhotoIcon /></div>}
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
                  const messageDate = formatISODateToMonthAndDay(message.timestamp);
                  const prevDate = formatISODateToMonthAndDay(messages[index - 1]?.timestamp);
                  const messageTime = formatISODateToTime(message.timestamp);
                  const prevTime = formatISODateToTime(messages[index - 1]?.timestamp);
                  const isSenderChanged = message.user_id !== messages[index - 1]?.user_id;
                  const isMe = (message.user_id === COUNCIL_ID && isCouncil)
                  || (message.user_id !== COUNCIL_ID && !isCouncil);

                  return acc.concat(
                    (index === 0 || messageDate !== prevDate) && <div key={`date-${index}`} className={styles['message-date-header']}>{messageDate}</div>,
                    (
                      isMe
                        ? (
                          <div key={index} className={styles['message-item__right']}>
                            <span className={styles['message-item--time']}>{messageTime}</span>
                            <span className={styles['message-item--content__right']}>
                              {message.is_image && <img src={message.content} alt="메세지 이미지" className={styles['message-item--content-image']} />}
                              {!message.is_image && message.content}
                            </span>
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
                              <span className={styles['message-item--content']}>
                                {message.is_image && <img src={message.content} alt="메세지 이미지" className={styles['message-item--content-image']} />}
                                {!message.is_image && message.content}
                              </span>
                              <span className={styles['message-item--time']}>{messageTime}</span>
                            </div>
                          </div>
                        )
                    ),
                  );
                }, [] as React.ReactNode[])}
                {currentMessageList.length > 0
                && currentMessageList.reduce((acc, message, index) => {
                  const messageDate = formatISODateToMonthAndDay(message.timestamp);
                  const prevDate = index === 0
                    ? formatISODateToMonthAndDay(messages[messages.length - 1]?.timestamp)
                    : formatISODateToMonthAndDay(currentMessageList[index - 1].timestamp);
                  const messageTime = formatISODateToTime(message.timestamp);
                  const prevTime = index === 0
                    ? formatISODateToTime(messages[messages.length - 1]?.timestamp)
                    : formatISODateToTime(currentMessageList[index - 1].timestamp);
                  const isSenderChanged = index === 0
                    ? message.user_id !== messages[messages.length - 1]?.user_id
                    : message.user_id !== currentMessageList[index - 1]?.user_id;
                  const isMe = (message.user_id === COUNCIL_ID && isCouncil)
                    || (message.user_id !== COUNCIL_ID && !isCouncil);

                  return acc.concat(
                    (messageDate !== prevDate) && <div key={`date-${index}`} className={styles['message-date-header']}>{messageDate}</div>,
                    (
                      isMe
                        ? (
                          <div key={index} className={styles['message-item__right']}>
                            <span className={styles['message-item--time']}>{formatISODateToTime(message.timestamp)}</span>
                            <span className={styles['message-item--content__right']}>
                              {message.is_image && <img src={message.content} alt="메세지 이미지" className={styles['message-item--content-image']} />}
                              {!message.is_image && message.content}
                            </span>
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
                              <span className={styles['message-item--content']}>
                                {message.is_image && <img src={message.content} alt="메세지 이미지" className={styles['message-item--content-image']} />}
                                {!message.is_image && message.content}
                              </span>
                              <span className={styles['message-item--time']}>{messageTime}</span>
                            </div>
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
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={sendMessageToEnterKeyDown}
                    placeholder="검색어 입력"
                  />
                  <button type="button" onClick={sendMessage} className={styles['message-button']} aria-label="문자 전송">
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
