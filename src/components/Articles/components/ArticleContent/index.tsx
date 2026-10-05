import { Attachment } from 'api/articles/entity';
import DownloadIcon from 'assets/svg/download-icon.svg';
import { sanitizeHtml } from 'utils/ts/sanitize';
import styles from './ArticleContent.module.scss';

interface ArticleContentProps {
  content: string;
  attachments?: Attachment[];
}

export default function ArticleContent({ content, attachments }: ArticleContentProps) {
  const safeContent = sanitizeHtml(content);

  return (
    <div className={styles.content}>
      <div
        dangerouslySetInnerHTML={{ __html: safeContent }}
        className={`toastui-editor-contents ${styles.viewer}`}
      />
      {attachments && attachments.length > 0 && (
        <div className={styles.attachments}>
          <span className={styles.attachments__title}>첨부파일</span>
          <ul className={styles.attachments__list}>
            {attachments.map((attachment) => (
              <li key={attachment.id} className={styles.attachments__item}>
                <a
                  href={attachment.url}
                  download={attachment.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.attachments__link}
                >
                  <DownloadIcon />
                  <span>{attachment.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
