import styles from './PostDetailContent.module.scss';

type PostDetailContentProps = {
  content: string
};

function PostDetailContent(props: PostDetailContentProps) {
  const { content } = props;
  function setHtmlContent() {
    return (
      <div dangerouslySetInnerHTML={{ __html: content }} />
    );
  }
  console.log(content);
  return (
    <div className={styles.content}>
      { setHtmlContent() }
    </div>
  );
}

export default PostDetailContent;
