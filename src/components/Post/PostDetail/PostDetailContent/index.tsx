import styles from './PostDetailContent.module.scss';

type PostDetailContentProps = {
  content: string
};

function PostDetailContent(props: PostDetailContentProps) {
  const { content } = props;

  return (
    <div className={styles.content} dangerouslySetInnerHTML={{ __html: content }} />
  );
}

export default PostDetailContent;
