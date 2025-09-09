import { useState } from 'react';
import showToast from 'utils/ts/showToast';
import styles from './FormContent.module.scss';

const MAX_CONTENT_LENGTH = 1000;

interface FormContentProps {
  content: string;
  setContent: (content: string) => void;
  type: 'FOUND' | 'LOST';
}

export default function FormContent({ content, setContent, type }: FormContentProps) {
  const [localContent, setLocalContent] = useState(content);
  const contentCounter = `${localContent.length}/${MAX_CONTENT_LENGTH}`;

  const handleContentChange = (value: string) => {
    if (value.length <= MAX_CONTENT_LENGTH) {
      setLocalContent(value);
    } else {
      showToast('error', `최대 ${MAX_CONTENT_LENGTH}자까지 입력 가능합니다.`);
    }
  };

  const placeholderText = type === 'FOUND' ? '습득한 물건에 대한 설명을 적어주세요.' : '물품이나 분실 장소에 대한 추가 설명이 있다면 작성해주세요.';

  return (
    <div className={styles.content}>
      <div className={styles.content__header}>
        <span className={styles.title}>내용</span>
        <span className={styles.content__counter}>{contentCounter}</span>
      </div>
      <textarea
        className={styles.content__input}
        placeholder={placeholderText}
        value={localContent}
        onChange={(e) => handleContentChange(e.target.value)}
        onBlur={(e) => setContent(e.target.value)}
        maxLength={MAX_CONTENT_LENGTH}
      />
    </div>
  );
}
