import styles from './ArticleContent.module.scss';

interface ArticleContentProps {
  content: string
}

function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div className={styles.content}>
      {/* eslint-disable-next-line  */}
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}

export default ArticleContent;
