import { useState, type ChangeEvent } from 'react';
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
  placeholder,
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
        textarea: styles.sendBar__input,
        sendButton: styles.sendBar__sendButton,
      }}
      value={content}
      onChange={setContent}
      onSend={handleSend}
      onImageChange={handleFileChange}
      disabled={disabled}
      placeholder={placeholder}
    />
  );
}
