import styles from './PostDetailContent.module.scss';

type PostDetailContentProps = {
  content: string
};

function PostDetailContent(props: PostDetailContentProps) {
  const { content } = props;
  // dangerouslySetInnerHTML에 대한 경고콘솔 제거
  // eslint-disable-next-line
  const contentParse = () => (<div dangerouslySetInnerHTML={{ __html: content }} />);

  return (
    <div className={styles.content}>
      { contentParse() }
    </div>
  );
}

export default PostDetailContent;
