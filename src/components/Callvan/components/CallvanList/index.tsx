import { CallvanPost } from 'api/callvan/entity';
import CallvanCard from 'components/Callvan/components/CallvanCard';
import styles from './CallvanList.module.scss';

interface CallvanListProps {
  posts: CallvanPost[];
}

export default function CallvanList({ posts }: CallvanListProps) {
  if (posts.length === 0) {
    return (
      <div className={styles["empty-state"]}>
        <span className={styles["empty-state__text"]}>게시글이 없습니다.</span>
      </div>
    );
  }

  return (
    <div className={styles["callvan-list"]}>
      {posts.map((post) => (
        <CallvanCard key={post.id} post={post} />
      ))}
    </div>
  );
}
