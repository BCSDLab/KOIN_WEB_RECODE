import {
  useRef,
  type ChangeEvent,
  type Key,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import Link from 'next/link';
import ImageUploadIcon from 'assets/svg/common/chat-photo.svg';
import SendIcon from 'assets/svg/common/chat-send.svg';
import styles from './Chat.module.scss';

interface ChatRoomListItem {
  key: Key;
  href: string;
  title: string;
  timeLabel?: string;
  preview: string;
  unreadCount: number;
  avatar: ReactNode;
  avatarAriaHidden?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

interface ChatRoomListClassNames {
  empty?: string;
}

interface ChatRoomListProps {
  items: ChatRoomListItem[];
  classNames?: ChatRoomListClassNames;
  emptyContent?: ReactNode;
}

export interface ChatMessageListItem {
  key: Key;
  messageId?: string | number;
  isMine: boolean;
  content: string;
  isImage: boolean;
  timeLabel: string;
  unreadCount?: number;
  showSender?: boolean;
  senderName?: string;
  senderAvatar?: ReactNode;
}

export interface ChatMessageListGroup {
  key: Key;
  dateLabel: string;
  messages: ChatMessageListItem[];
}

interface ChatMessageListClassNames {
  dateContainer?: string;
  dateLabel?: string;
  bubbleMine?: string;
  bubbleOthers?: string;
  imageBubble?: string;
  image?: string;
}

interface ChatMessageListProps {
  groups: ChatMessageListGroup[];
  classNames?: ChatMessageListClassNames;
}

interface ChatMessageInputClassNames {
  container?: string;
  imageControl?: string;
  imageControlDisabled?: string;
  textarea?: string;
  sendButton?: string;
  sendButtonDisabled?: string;
}

interface ChatMessageInputProps {
  classNames?: ChatMessageInputClassNames;
  value: string;
  onChange: (value: string) => void;
  onSend: () => boolean | void;
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  placeholder?: string;
  fileInputRef?: RefObject<HTMLInputElement | null>;
  imageInputMultiple?: boolean;
}

interface ChatLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
  className?: string;
  sidebarClassName?: string;
  panelClassName?: string;
}

const joinClassNames = (...classNames: (string | false | undefined)[]) => classNames.filter(Boolean).join(' ');

export function ChatLayout({
  sidebar,
  children,
  className,
  sidebarClassName,
  panelClassName,
}: ChatLayoutProps) {
  const hasSidebar = Boolean(sidebar);

  return (
    <div
      className={joinClassNames(
        styles.chatLayout,
        !hasSidebar && styles['chatLayout--withoutSidebar'],
        className,
      )}
    >
      {hasSidebar && (
        <aside className={joinClassNames(styles.chatLayout__sidebar, sidebarClassName)} aria-label="채팅방 목록">
          {sidebar}
        </aside>
      )}
      {children && <section className={joinClassNames(styles.chatLayout__panel, panelClassName)}>{children}</section>}
    </div>
  );
}

export function ChatRoomList({
  items,
  classNames = {},
  emptyContent = '채팅방이 없습니다.',
}: ChatRoomListProps) {
  if (items.length === 0) {
    return <div className={joinClassNames(styles.roomList__empty, classNames.empty)}>{emptyContent}</div>;
  }

  return items.map((item) => (
    <Link
      key={item.key}
      href={item.href}
      className={joinClassNames(styles.roomList__item, item.isActive && styles['roomList__item--active'])}
      aria-current={item.isActive ? 'page' : undefined}
      onClick={item.onClick}
    >
      <div className={styles.roomList__avatar} aria-hidden={item.avatarAriaHidden}>
        {item.avatar}
      </div>
      <div className={styles.roomList__content}>
        <div className={styles.roomList__header}>
          <div className={styles.roomList__title}>{item.title}</div>
          {item.timeLabel && <div className={styles.roomList__time}>{item.timeLabel}</div>}
        </div>
        <div className={styles.roomList__previewRow}>
          <div className={styles.roomList__preview}>{item.preview}</div>
          {item.unreadCount > 0 && (
            <div className={styles.roomList__unreadCount}>{item.unreadCount}</div>
          )}
        </div>
      </div>
    </Link>
  ));
}

export function ChatMessageList({
  groups,
  classNames = {},
}: ChatMessageListProps) {
  const renderMessage = (message: ChatMessageListItem) => {
    let bubbleClassName = message.isMine
      ? joinClassNames(styles.messageList__bubble, styles['messageList__bubble--mine'], classNames.bubbleMine)
      : joinClassNames(styles.messageList__bubble, styles['messageList__bubble--other'], classNames.bubbleOthers);
    if (message.isImage) bubbleClassName = joinClassNames(styles.messageList__imageBubble, classNames.imageBubble);

    const bubble = (
      <div className={bubbleClassName}>
        {message.isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={message.content}
            alt="전송된 이미지"
            className={joinClassNames(styles.messageList__image, classNames.image)}
          />
        ) : (
          message.content
        )}
      </div>
    );

    const metaContent = (
      <>
        {(message.unreadCount ?? 0) > 0 && (
          <span className={styles.messageList__unreadCount}>{message.unreadCount}</span>
        )}
        <span className={styles.messageList__time}>{message.timeLabel}</span>
      </>
    );
    const meta = (
      <div className={joinClassNames(styles.messageList__meta, message.isMine && styles['messageList__meta--mine'])}>
        {metaContent}
      </div>
    );

    if (message.isMine) {
      return (
        <div
          key={message.key}
          className={joinClassNames(styles.messageList__item, styles['messageList__item--mine'])}
          data-message-id={message.messageId}
        >
          {meta}
          {bubble}
        </div>
      );
    }

    return (
      <div
        key={message.key}
        className={joinClassNames(
          styles.messageList__item,
          styles['messageList__item--other'],
          !message.showSender && styles['messageList__item--consecutive'],
        )}
        data-message-id={message.messageId}
      >
        {message.showSender && (
          <div className={styles.messageList__sender}>
            {message.senderAvatar}
            <span className={styles.messageList__senderName}>{message.senderName}</span>
          </div>
        )}
        <div className={styles.messageList__row}>
          {bubble}
          {meta}
        </div>
      </div>
    );
  };

  return groups.map((group) => (
    <div key={group.key}>
      <div className={joinClassNames(styles.messageList__date, classNames.dateContainer)}>
        <span className={joinClassNames(styles.messageList__dateLabel, classNames.dateLabel)}>
          {group.dateLabel}
        </span>
      </div>
      {group.messages.map(renderMessage)}
    </div>
  ));
}

export function ChatMessageInput({
  classNames = {},
  value,
  onChange,
  onSend,
  onImageChange,
  disabled = false,
  placeholder = '메세지 보내기',
  fileInputRef,
  imageInputMultiple = false,
}: ChatMessageInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const internalFileInputRef = useRef<HTMLInputElement>(null);
  const resolvedFileInputRef = fileInputRef ?? internalFileInputRef;

  const resizeTextarea = () => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
    resizeTextarea();
  };

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    if (onSend() === false) return;

    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.nativeEvent.isComposing) return;

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={joinClassNames(styles.messageInput, classNames.container)}>
      <button
        type="button"
        className={joinClassNames(
          styles.messageInput__imageButton,
          classNames.imageControl,
          disabled && classNames.imageControlDisabled,
        )}
        aria-label="이미지 전송"
        onClick={() => resolvedFileInputRef.current?.click()}
        disabled={disabled}
      >
        <ImageUploadIcon />
      </button>
      <input
        ref={resolvedFileInputRef}
        type="file"
        accept="image/*"
        multiple={imageInputMultiple}
        className={styles.messageInput__file}
        onChange={onImageChange}
        disabled={disabled}
        aria-label="이미지 파일 선택"
      />
      <textarea
        ref={textareaRef}
        className={joinClassNames(styles.messageInput__textarea, classNames.textarea)}
        placeholder={placeholder}
        aria-label="메시지 입력"
        rows={1}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <button
        type="button"
        className={joinClassNames(styles.messageInput__sendButton, classNames.sendButton, disabled && classNames.sendButtonDisabled)}
        aria-label="전송"
        onClick={handleSend}
        disabled={disabled}
      >
        <SendIcon />
      </button>
    </div>
  );
}
