import { useState } from 'react';
import showToast from 'utils/ts/showToast';
import styles from './FormContent.module.scss';

const MAX_CONTENT_LENGTH = 1000;

interface FormContentProps {
  content: string;
  setContent: (content: string) => void;
}

export default function FormContent({ content, setContent }: FormContentProps) {
  const [localContent, setLocalContent] = useState(content);
  const contentCounter = `${localContent.length}/${MAX_CONTENT_LENGTH}`;

  const handleContentChange = (value: string) => {
    if (value.length <= MAX_CONTENT_LENGTH) {
      setLocalContent(value);
    } else {
      showToast('error', `최대 ${MAX_CONTENT_LENGTH}자까지 입력 가능합니다.`);
    }
  };

  return (
    <div className={styles.content}>
      <div className={styles.content__header}>
        <span className={styles.title}>내용</span>
        <span className={styles.content__counter}>{contentCounter}</span>
      </div>
      <textarea
        className={styles.content__input}
        placeholder="습득한 물건에 대한 설명을 적어주세요."
        value={localContent}
        onChange={(e) => handleContentChange(e.target.value)}
        onBlur={(e) => setContent(e.target.value)}
        maxLength={MAX_CONTENT_LENGTH}
      />
    </div>
  );
}
