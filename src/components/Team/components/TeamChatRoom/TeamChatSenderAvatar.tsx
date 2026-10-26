import ChatAvatarIcon from 'assets/svg/Team/chat-avatar.svg';
import WebChatIcon from 'assets/svg/Team/web_chat.svg';

import styles from './TeamChatRoom.module.scss';

export default function TeamChatSenderAvatar() {
  return (
    <>
      <span className={styles['chat-room__desktopSenderIcon']} aria-hidden="true">
        <WebChatIcon />
      </span>
      <span className={styles['chat-room__mobileSenderIcon']} aria-hidden="true">
        <ChatAvatarIcon />
      </span>
    </>
  );
}
