import {
  Fragment,
  useRef,
  type ChangeEvent,
  type Key,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import Link from 'next/link';
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
  item?: string;
  activeItem?: string;
  avatar?: string;
  content?: string;
  header?: string;
  title?: string;
  time?: string;
  previewRow?: string;
  preview?: string;
  unreadCount?: string;
  empty?: string;
}

interface ChatRoomListProps {
  items: ChatRoomListItem[];
  classNames?: ChatRoomListClassNames;
  emptyContent: ReactNode;
  contentElement?: 'div' | 'span';
  emptyElement?: 'div' | 'p';
}

export interface ChatMessageListItem {
  key: Key;
  messageId?: string | number;
  isMine: boolean;
  content: string;
  isImage: boolean;
  imageAlt: string;
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
  mineRow?: string;
  otherGroup?: string;
  otherGroupConsecutive?: string;
  sender?: string;
  senderName?: string;
  otherRow?: string;
  bubbleMine?: string;
  bubbleOthers?: string;
  imageBubble?: string;
  image?: string;
  meta?: string;
  metaMine?: string;
  unreadCount?: string;
  time?: string;
}

interface ChatMessageListProps {
  groups: ChatMessageListGroup[];
  classNames?: ChatMessageListClassNames;
  wrapGroups?: boolean;
  bubbleElement?: 'div' | 'span';
  dateLabelElement?: 'div' | 'span';
  senderNameElement?: 'div' | 'span';
}

interface ChatMessageInputClassNames {
  container?: string;
  imageWrapper?: string;
  imageControl?: string;
  imageControlDisabled?: string;
  fileInput?: string;
  textarea?: string;
  sendButton?: string;
  sendButtonDisabled?: string;
}

interface ChatMessageInputProps {
  classNames?: ChatMessageInputClassNames;
  imageIcon: ReactNode;
  sendIcon: ReactNode;
  value: string;
  onChange: (value: string) => void;
  onSend: () => boolean | void;
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  placeholder?: string;
  fileInputRef?: RefObject<HTMLInputElement | null>;
  imageControlElement?: 'button' | 'label';
  imageInputId?: string;
  imageInputMultiple?: boolean;
  imageControlAriaLabel?: string;
  fileInputAriaLabel?: string;
  textareaAriaLabel?: string;
  sendButtonAriaLabel?: string;
}

const joinClassNames = (...classNames: (string | false | undefined)[]) => classNames.filter(Boolean).join(' ');

export function ChatRoomList({
  items,
  classNames = {},
  emptyContent,
  contentElement: ContentElement = 'div',
  emptyElement: EmptyElement = 'div',
}: ChatRoomListProps) {
  if (items.length === 0) {
    return <EmptyElement className={joinClassNames(styles.roomList__empty, classNames.empty)}>{emptyContent}</EmptyElement>;
  }

  return items.map((item) => (
    <Link
      key={item.key}
      href={item.href}
      className={joinClassNames(
        styles.roomList__item,
        classNames.item,
        item.isActive && styles['roomList__item--active'],
        item.isActive && classNames.activeItem,
      )}
      aria-current={item.isActive ? 'page' : undefined}
      onClick={item.onClick}
    >
      <ContentElement
        className={joinClassNames(styles.roomList__avatar, classNames.avatar)}
        aria-hidden={item.avatarAriaHidden}
      >
        {item.avatar}
      </ContentElement>
      <ContentElement className={joinClassNames(styles.roomList__content, classNames.content)}>
        <ContentElement className={joinClassNames(styles.roomList__header, classNames.header)}>
          <ContentElement className={joinClassNames(styles.roomList__title, classNames.title)}>{item.title}</ContentElement>
          {item.timeLabel && (
            <ContentElement className={joinClassNames(styles.roomList__time, classNames.time)}>
              {item.timeLabel}
            </ContentElement>
          )}
        </ContentElement>
        <ContentElement className={joinClassNames(styles.roomList__previewRow, classNames.previewRow)}>
          <ContentElement className={joinClassNames(styles.roomList__preview, classNames.preview)}>
            {item.preview}
          </ContentElement>
          {item.unreadCount > 0 && (
            <ContentElement className={joinClassNames(styles.roomList__unreadCount, classNames.unreadCount)}>
              {item.unreadCount}
            </ContentElement>
          )}
        </ContentElement>
      </ContentElement>
    </Link>
  ));
}

export function ChatMessageList({
  groups,
  classNames = {},
  wrapGroups = false,
  bubbleElement: BubbleElement = 'div',
  dateLabelElement: DateLabelElement = 'div',
  senderNameElement: SenderNameElement = 'div',
}: ChatMessageListProps) {
  const renderMessage = (message: ChatMessageListItem) => {
    let bubbleClassName = message.isMine
      ? joinClassNames(styles.messageList__bubble, styles['messageList__bubble--mine'], classNames.bubbleMine)
      : joinClassNames(styles.messageList__bubble, styles['messageList__bubble--other'], classNames.bubbleOthers);
    if (message.isImage) bubbleClassName = joinClassNames(styles.messageList__imageBubble, classNames.imageBubble);

    const bubble = (
      <BubbleElement className={bubbleClassName}>
        {message.isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={message.content}
            alt={message.imageAlt}
            className={joinClassNames(styles.messageList__image, classNames.image)}
          />
        ) : (
          message.content
        )}
      </BubbleElement>
    );

    const metaContent = (
      <>
        {(message.unreadCount ?? 0) > 0 && (
          <span className={joinClassNames(styles.messageList__unreadCount, classNames.unreadCount)}>
            {message.unreadCount}
          </span>
        )}
        <span className={joinClassNames(styles.messageList__time, classNames.time)}>{message.timeLabel}</span>
      </>
    );
    const meta = (
      <div
        className={joinClassNames(
          styles.messageList__meta,
          classNames.meta,
          message.isMine && styles['messageList__meta--mine'],
          message.isMine && classNames.metaMine,
        )}
      >
        {metaContent}
      </div>
    );

    if (message.isMine) {
      return (
        <div
          key={message.key}
          className={joinClassNames(styles.messageList__item, styles['messageList__item--mine'], classNames.mineRow)}
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
          classNames.otherGroup,
          !message.showSender && styles['messageList__item--consecutive'],
          !message.showSender && classNames.otherGroupConsecutive,
        )}
        data-message-id={message.messageId}
      >
        {message.showSender && (
          <div className={joinClassNames(styles.messageList__sender, classNames.sender)}>
            {message.senderAvatar}
            <SenderNameElement className={joinClassNames(styles.messageList__senderName, classNames.senderName)}>
              {message.senderName}
            </SenderNameElement>
          </div>
        )}
        <div className={joinClassNames(styles.messageList__row, classNames.otherRow)}>
          {bubble}
          {meta}
        </div>
      </div>
    );
  };

  return groups.map((group) => {
    const dateLabel = (
      <DateLabelElement className={joinClassNames(styles.messageList__dateLabel, classNames.dateLabel)}>
        {group.dateLabel}
      </DateLabelElement>
    );
    const dateHeader = (
      <div className={joinClassNames(styles.messageList__date, classNames.dateContainer)}>{dateLabel}</div>
    );
    const groupContent = (
      <>
        {dateHeader}
        {group.messages.map(renderMessage)}
      </>
    );

    return wrapGroups ? <div key={group.key}>{groupContent}</div> : <Fragment key={group.key}>{groupContent}</Fragment>;
  });
}

export function ChatMessageInput({
  classNames = {},
  imageIcon,
  sendIcon,
  value,
  onChange,
  onSend,
  onImageChange,
  disabled = false,
  placeholder = '메세지 보내기',
  fileInputRef,
  imageControlElement = 'button',
  imageInputId,
  imageInputMultiple = false,
  imageControlAriaLabel,
  fileInputAriaLabel,
  textareaAriaLabel,
  sendButtonAriaLabel,
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

  const fileInput = (
    <input
      ref={resolvedFileInputRef}
      id={imageInputId}
      type="file"
      accept="image/*"
      multiple={imageInputMultiple}
      className={joinClassNames(styles.messageInput__file, classNames.fileInput)}
      onChange={onImageChange}
      disabled={disabled}
      aria-label={fileInputAriaLabel}
    />
  );
  const imageControlClassName = joinClassNames(
    styles.messageInput__imageButton,
    classNames.imageControl,
    disabled && classNames.imageControlDisabled,
  );
  const imageControl =
    imageControlElement === 'label' ? (
      <div className={joinClassNames(styles.messageInput__imageWrapper, classNames.imageWrapper)}>
        <label htmlFor={imageInputId} className={imageControlClassName}>
          {imageIcon}
          {fileInput}
        </label>
      </div>
    ) : (
      <>
        <button
          type="button"
          className={imageControlClassName}
          aria-label={imageControlAriaLabel}
          onClick={() => resolvedFileInputRef.current?.click()}
          disabled={disabled}
        >
          {imageIcon}
        </button>
        {fileInput}
      </>
    );
  const isSendDisabled = disabled || !value.trim();

  return (
    <div className={joinClassNames(styles.messageInput, classNames.container)}>
      {imageControl}
      <textarea
        ref={textareaRef}
        className={joinClassNames(styles.messageInput__textarea, classNames.textarea)}
        placeholder={placeholder}
        aria-label={textareaAriaLabel}
        rows={1}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <button
        type="button"
        className={joinClassNames(styles.messageInput__sendButton, classNames.sendButton, disabled && classNames.sendButtonDisabled)}
        aria-label={sendButtonAriaLabel}
        onClick={handleSend}
        disabled={isSendDisabled}
      >
        {sendIcon}
      </button>
    </div>
  );
}
