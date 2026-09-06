import { useState, type ChangeEvent } from 'react';
import ImageUploadIcon from 'assets/svg/common/chat-photo.svg';
import SendIcon from 'assets/svg/common/chat-send.svg';
import { ChatMessageInput } from 'components/ui/Chat';
import styles from './TeamChatSendBar.module.scss';

interface TeamChatSendBarProps {
  disabled?: boolean;
  placeholder?: string;
  onSend: (content: string) => void;
  onImageSelect: (file: File) => void;
}

export default function TeamChatSendBar({
  disabled = false,
  placeholder = '메세지 보내기',
  onSend,
  onImageSelect,
}: TeamChatSendBarProps) {
  const [content, setContent] = useState('');

  const handleSend = () => {
    onSend(content.trim());
    setContent('');
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onImageSelect(file);

    event.target.value = '';
  };

  return (
    <ChatMessageInput
      classNames={{
        container: styles.sendBar,
        imageControl: styles.sendBar__imageButton,
        fileInput: styles.sendBar__fileInput,
        textarea: styles.sendBar__input,
        sendButton: styles.sendBar__sendButton,
      }}
      imageIcon={<ImageUploadIcon />}
      sendIcon={<SendIcon />}
      value={content}
      onChange={setContent}
      onSend={handleSend}
      onImageChange={handleFileChange}
      disabled={disabled}
      placeholder={placeholder}
      imageControlAriaLabel="이미지 전송"
      textareaAriaLabel="메시지 입력"
      sendButtonAriaLabel="전송"
      textareaRows={1}
    />
  );
}
