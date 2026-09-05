import type { Key, ReactNode } from 'react';
import Link from 'next/link';

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
  item: string;
  activeItem?: string;
  avatar: string;
  content: string;
  header: string;
  title?: string;
  time: string;
  previewRow: string;
  preview: string;
  unreadCount: string;
  empty: string;
}

interface ChatRoomListProps {
  items: ChatRoomListItem[];
  classNames: ChatRoomListClassNames;
  emptyContent: ReactNode;
  contentElement?: 'div' | 'span';
  emptyElement?: 'div' | 'p';
}

const joinClassNames = (...classNames: (string | false | undefined)[]) => classNames.filter(Boolean).join(' ');

export function ChatRoomList({
  items,
  classNames,
  emptyContent,
  contentElement: ContentElement = 'div',
  emptyElement: EmptyElement = 'div',
}: ChatRoomListProps) {
  if (items.length === 0) {
    return <EmptyElement className={classNames.empty}>{emptyContent}</EmptyElement>;
  }

  return items.map((item) => (
    <Link
      key={item.key}
      href={item.href}
      className={joinClassNames(classNames.item, item.isActive && classNames.activeItem)}
      aria-current={item.isActive ? 'page' : undefined}
      onClick={item.onClick}
    >
      <ContentElement className={classNames.avatar} aria-hidden={item.avatarAriaHidden}>
        {item.avatar}
      </ContentElement>
      <ContentElement className={classNames.content}>
        <ContentElement className={classNames.header}>
          <ContentElement className={classNames.title}>{item.title}</ContentElement>
          {item.timeLabel && <ContentElement className={classNames.time}>{item.timeLabel}</ContentElement>}
        </ContentElement>
        <ContentElement className={classNames.previewRow}>
          <ContentElement className={classNames.preview}>{item.preview}</ContentElement>
          {item.unreadCount > 0 && (
            <ContentElement className={classNames.unreadCount}>{item.unreadCount}</ContentElement>
          )}
        </ContentElement>
      </ContentElement>
    </Link>
  ));
}
