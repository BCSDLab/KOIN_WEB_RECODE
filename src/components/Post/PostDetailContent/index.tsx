import styles from './PostDetailContent.module.scss';

type PostDetailContentProps = {
  content: string
};

function PostDetailContent(props: PostDetailContentProps) {
  const { content } = props;

  return (
    <div className={styles.content}>
      {/* eslint-disable-next-line  */}
      <div dangerouslySetInnerHTML={{ __html: content }} /> 
    </div>
  );
}

export default PostDetailContent;
