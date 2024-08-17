import styles from './ArticleContent.module.scss';

interface PostDetailContentProps {
  content: string
}

function ArticleContent({ content }: PostDetailContentProps) {
  return (
    <div className={styles.content}>
      {/* eslint-disable-next-line  */}
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}

export default ArticleContent;
