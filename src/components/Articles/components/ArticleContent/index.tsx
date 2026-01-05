import styles from './ArticleContent.module.scss';
// import './ToastUIViewer.css';

interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div className={styles.content}>
      <div dangerouslySetInnerHTML={{ __html: content }} className="toastui-editor-contents" />
    </div>
  );
}
