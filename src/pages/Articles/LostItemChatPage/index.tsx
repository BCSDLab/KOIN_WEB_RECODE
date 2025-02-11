/* eslint-disable react/no-array-index-key */
/* eslint-disable react-hooks/exhaustive-deps */
import { Client } from '@stomp/stompjs';
import { skipToken, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { getLostItemChatroomDetail, getLostItemChatroomDetailMessages, getLostItemChatroomList } from 'api/articles';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import ROUTES from 'static/routes';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useUser } from 'utils/hooks/state/useUser';
import type { LostItemChatroomDetailMessage } from 'api/articles/entity';
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSearch: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (!inputValue.trim() || user === null || !chatroomDetail) {
      return;
    }

    const newMessage = {
      user_nickname: user.nickname || user.anonymous_nickname,
      user_id: chatroomDetail.user_id,
      content: inputValue,
      timestamp: new Date().toISOString(),
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
      debug: (str) => console.log('STOMP Debug:', str),
      reconnectDelay: 1000000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('Connected!');
        stompClient.subscribe(
          `/topic/chat/${articleId}/${chatroomId}`,
          (message) => {
            const receivedMessage = JSON.parse(message.body);
            setCurrentMessageList((prev) => [...prev, receivedMessage]);
          },
        );
      },
      onDisconnect: () => {
        console.log('Disconnected!');
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ', frame.headers.message);
        console.error('Additional details: ', frame.body);
      },
    });

    stompClient.activate();
    setClient(stompClient);
  };

  const disconnect = () => {
    if (client) {
      client.deactivate();
    }

    setClient(null);
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
              {lost_item_image_url ? <img src={lost_item_image_url} alt="분실물 이미지" className={styles['chat-list--item--profile']} /> : <div className={styles['chat-list--item--profile']} />}
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
                  <img src={chatroomDetail.chat_partner_profile_image} alt="분실물 이미지" className={styles['chat-list--item--profile']} />
                  <div className={styles['chat-view--title']}>{chatroomDetail.article_title}</div>
                </div>
                <div>차단하기</div>
              </div>

              <div className={styles['message-container']} ref={chatContainerRef}>
                {messages.reduce((acc, message, index) => {
                  const messageDate = formatDate2(message.timestamp);
                  const prevDate = index > 0 ? formatDate2(messages[index - 1].timestamp) : null;
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
                          <div key={index} className={styles['message-item']}>
                            <span className={styles['message-item--content__right']}>{message.is_image ? <img src={message.content} alt="메세지 이미지" className={styles['message-item--content-image']} /> : message.content}</span>
                            <span className={styles['message-item--time']}>{formatTime(message.timestamp)}</span>
                          </div>
                        )
                    ),
                  );
                }, [] as React.ReactNode[])}
                {currentMessageList.reduce((acc, message, index) => {
                  const messageDate = formatDate2(message.timestamp);
                  const prevDate = index > 0 ? formatDate2(messages[index - 1].timestamp) : null;

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
                          <div key={index} className={styles['message-item']}>
                            <span className={styles['message-item--content__right']}>{message.is_image ? <img src={message.content} alt="메세지 이미지" className={styles['message-item--content-image']} /> : message.content}</span>
                            <span className={styles['message-item--time']}>{formatTime(message.timestamp)}</span>
                          </div>
                        )
                    ),
                  );
                }, [] as React.ReactNode[])}
              </div>

              <form className={styles['chat-input-container']} onSubmit={handleSearch}>
                <div className={styles['chat-list--item--profile']} />
                <input
                  className={styles['chat-input']}
                  type="text"
                  value={inputValue}
                  onChange={handleChange}
                  placeholder="검색어 입력"
                />
                <button type="submit" className={styles['chat-list--item--profile']}>A</button>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default LostItemChatPage;
