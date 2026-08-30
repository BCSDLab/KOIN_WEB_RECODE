import { useRef, useState } from 'react';
import ImageUploadIcon from 'assets/svg/common/image-upload.svg';
import SendIcon from 'assets/svg/common/send.svg';
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resizeTextarea = () => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    resizeTextarea();
  };

  const handleSend = () => {
    const trimmed = content.trim();
    if (!trimmed || disabled) return;

    onSend(trimmed);
    setContent('');

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // 한글 조합 중의 Enter 는 조합 확정이라 전송으로 처리하면 안 된다.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onImageSelect(file);

    e.target.value = '';
  };

  return (
    <div className={styles.sendBar}>
      <button
        type="button"
        className={styles.sendBar__imageButton}
        aria-label="이미지 전송"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
      >
        <ImageUploadIcon />
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className={styles.sendBar__fileInput}
        onChange={handleFileChange}
      />
      <textarea
        ref={textareaRef}
        className={styles.sendBar__input}
        placeholder={placeholder}
        aria-label="메시지 입력"
        rows={1}
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <button
        type="button"
        className={styles.sendBar__sendButton}
        aria-label="전송"
        onClick={handleSend}
        disabled={disabled || !content.trim()}
      >
        <SendIcon />
      </button>
    </div>
  );
}
