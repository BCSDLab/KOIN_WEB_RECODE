import { useRef, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { CallvanChatMessage } from 'api/callvan/entity';
import { callvanQueries } from 'api/callvan/queries';
import ArrowBackIcon from 'assets/svg/Callvan/arrow-back.svg';
import ImageUploadIcon from 'assets/svg/Callvan/image-upload.svg';
import PeopleIcon from 'assets/svg/Callvan/people.svg';
import SendIcon from 'assets/svg/Callvan/send.svg';
import { ParticipantAvatarIcon } from 'components/Callvan/components/ParticipantsList/ParticipantAvatarIcon';
import useSendCallvanChat from 'components/Callvan/hooks/useSendCallvanChat';
import { getParticipantColor } from 'components/Callvan/utils/participantColor';
import useLogger from 'utils/hooks/analytics/useLogger';
import useTokenState from 'utils/hooks/state/useTokenState';
import useUploadFile from 'utils/hooks/uploadFile/useUploadFile';
import styles from './CallvanChatRoom.module.scss';

interface CallvanChatRoomProps {
  postId: number;
}

function groupMessagesByDate(messages: CallvanChatMessage[]): { date: string; messages: CallvanChatMessage[] }[] {
  const groups: { date: string; messages: CallvanChatMessage[] }[] = [];

  messages.forEach((msg) => {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.date === msg.date) {
      lastGroup.messages.push(msg);
    } else {
      groups.push({ date: msg.date, messages: [msg] });
    }
  });

  return groups;
}

function formatKoreanDateString(dateStr: string): string {
  const parts = dateStr.match(/\d+/g);
  if (parts && parts.length >= 3) {
    return `${parts[0]}년 ${parts[1]}월 ${parts[2]}일`;
  }
  return dateStr;
}

export default function CallvanChatRoom({ postId }: CallvanChatRoomProps) {
  const router = useRouter();
  const logger = useLogger();
  const token = useTokenState();
  const { data } = useSuspenseQuery(callvanQueries.chat(token ?? '', postId));
  const { data: postDetail } = useSuspenseQuery(callvanQueries.postDetail(token ?? '', postId));

  const { mutate: sendMessage, isPending: isSending } = useSendCallvanChat(postId);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { uploadFile, isPending: isUploading } = useUploadFile();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [data.messages]);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { file_url } = await uploadFile({ domain: 'CALLVAN_CHAT', file });
      if (file_url) {
        sendMessage({ is_image: true, content: file_url });
      }
    } finally {
      e.target.value = '';
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSend = () => {
    const content = inputValue.trim();
    if (!content || isSending) return;

    sendMessage(
      { is_image: false, content },
      {
        onSuccess: () => {
          setInputValue('');
          if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
          }
        },
      },
    );
    logger.actionEventClick({ event_label: 'callvan_chat_send', team: 'CAMPUS', value: '' });
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const senderColorMap = useMemo(() => {
    const map = new Map<number, number>();
    data.messages.forEach((msg) => {
      if (!msg.is_mine && !map.has(msg.user_id)) {
        map.set(msg.user_id, map.size);
      }
    });
    return map;
  }, [data.messages]);

  const messageGroups = groupMessagesByDate(data.messages);

  return (
    <div className={styles['chat-room']}>
      <div className={styles['chat-room__header']}>
        <button type="button" className={styles['chat-room__back-button']} onClick={() => router.back()}>
          <ArrowBackIcon />
        </button>
        <div className={styles['chat-room__header-center']}>
          <div className={styles['chat-room__title-row']}>
            <span className={styles['chat-room__route-text']}>{postDetail.departure}</span>
            <span>-</span>
            <span className={styles['chat-room__route-text']}>{postDetail.arrival}</span>
            <span>{postDetail.departure_time}</span>
          </div>
          <div className={styles['chat-room__header-count']}>
            <PeopleIcon />
            <span>
              {postDetail.current_participants}/{postDetail.max_participants}
            </span>
          </div>
        </div>
        <div className={styles['chat-room__header-menu']} />
      </div>

      <div className={styles['chat-room__messages']}>
        {messageGroups.length === 0 && <div className={styles['chat-room__empty']}>아직 대화가 없습니다.</div>}

        {messageGroups.map((group) => (
          <div key={group.date}>
            <div className={styles['chat-room__date-badge']}>
              <span>{formatKoreanDateString(group.date)}</span>
            </div>

            {group.messages.map((msg, idx) => {
              const key = `${msg.user_id}-${msg.time}-${idx}`;

              if (msg.is_mine) {
                return (
                  <div key={key} className={styles['chat-room__message-row--mine']}>
                    {msg.unread_count > 0 ? (
                      <div className={styles['chat-room__textheader--mine']}>
                        <span className={styles['chat-room__unread-count']}>{msg.unread_count}</span>
                        <span className={styles['chat-room__timestamp']}>{msg.time}</span>
                      </div>
                    ) : (
                      <span className={styles['chat-room__timestamp']}>{msg.time}</span>
                    )}
                    {msg.is_image ? (
                      <div className={styles['chat-room__bubble-image']}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={msg.content} alt="업로드 이미지" />
                      </div>
                    ) : (
                      <div className={styles['chat-room__bubble--mine']}>
                        <span className={styles['chat-room__message-text']}>{msg.content}</span>
                      </div>
                    )}
                  </div>
                );
              }

              const showSender = idx === 0 || group.messages[idx - 1].user_id !== msg.user_id;

              return (
                <div
                  key={key}
                  className={
                    showSender
                      ? styles['chat-room__message-group--others']
                      : styles['chat-room__message-group--others-consecutive']
                  }
                >
                  {showSender && (
                    <div className={styles['chat-room__sender-row']}>
                      <ParticipantAvatarIcon color={getParticipantColor(senderColorMap.get(msg.user_id) ?? 0)} />
                      <div className={styles['chat-room__sender-info']}>
                        <span className={styles['chat-room__sender-name']}>{msg.sender_nickname}</span>
                        {msg.is_left_user && <span className={styles['chat-room__left-badge']}>(나간 사용자)</span>}
                      </div>
                    </div>
                  )}
                  <div className={styles['chat-room__message-row--others']}>
                    {msg.is_image ? (
                      <div className={styles['chat-room__bubble-image']}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={msg.content} alt="업로드 이미지" />
                      </div>
                    ) : (
                      <div className={styles['chat-room__bubble--others']}>
                        <span className={styles['chat-room__message-text']}>{msg.content}</span>
                      </div>
                    )}
                    {msg.unread_count > 0 ? (
                      <div className={styles['chat-room__textheader--others']}>
                        <span className={styles['chat-room__unread-count']}>{msg.unread_count}</span>
                        <span className={styles['chat-room__timestamp']}>{msg.time}</span>
                      </div>
                    ) : (
                      <span className={styles['chat-room__timestamp']}>{msg.time}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      <div className={styles['chat-room__send-bar']}>
        <button
          type="button"
          className={styles['chat-room__image-button']}
          aria-label="이미지 전송"
          onClick={handleImageClick}
          disabled={isUploading}
        >
          <ImageUploadIcon />
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleImageFileChange}
        />
        <textarea
          className={styles['chat-room__input']}
          placeholder="메세지 보내기"
          value={inputValue}
          rows={1}
          ref={textareaRef}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className={styles['chat-room__send-button']}
          onClick={handleSend}
          disabled={!inputValue.trim() || isSending}
          aria-label="전송"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
}
