import { useState, type ChangeEvent } from 'react';

import { ChatMessageInput } from 'components/ui/Chat';

import styles from './TeamChatSendBar.module.scss';

interface TeamChatSendBarProps {
  disabled?: boolean;
  onSend: (content: string) => void;
  onImageSelect: (file: File) => void;
}

export default function TeamChatSendBar({
  disabled = false,
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
        container: styles['send-bar'],
        imageControl: styles['send-bar__imageButton'],
        textarea: styles['send-bar__input'],
        sendButton: styles['send-bar__sendButton'],
      }}
      value={content}
      onChange={setContent}
      onSend={handleSend}
      onImageChange={handleFileChange}
      disabled={disabled}
    />
  );
}
