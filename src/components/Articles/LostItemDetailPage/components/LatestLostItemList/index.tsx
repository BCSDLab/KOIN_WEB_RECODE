import Link from 'next/link';
import useLostItemArticles from 'components/Articles/hooks/useLostItemArticles';
import FoundChip from 'components/Articles/LostItemDetailPage/components/FoundChip';
import ROUTES from 'static/routes';
import useInfiniteScroll from 'utils/hooks/ui/useInfiniteScroll';
import styles from './LatestLostItemList.module.scss';

function LatestLostItemList() {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useLostItemArticles({
    limit: 10,
    sort: 'LATEST',
  });

  const observerRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);
  const articles = data.pages.flatMap((page) => page.articles);

  return (
    <div className={styles.container}>
      <div className={styles.title}>최근 게시물</div>
      <div className={styles.list}>
        {articles.length === 0 ? (
          <div className={styles.empty}>게시물이 없습니다.</div>
        ) : (
          articles.map((article) => (
            <Link
              key={article.id}
              href={ROUTES.LostItemDetail({ id: String(article.id) })}
              className={styles.item}
            >
              <div className={styles.item__content}>
                <span className={styles.item__type}>{article.type === 'LOST' ? '분실물' : '습득물'}</span>
                <div className={styles.item__info}>
                  <span className={styles.item__category}>{article.category}</span>
                  <span className={styles.item__place}>{article.found_place}</span>
                  <span className={styles.item__date}>| {article.found_date}</span>
                </div>
              </div>
              <FoundChip isFound={article.is_found} size="small" />
            </Link>
          ))
        )}
        {hasNextPage && (
          <div ref={observerRef} className={styles.loading}>
            {isFetchingNextPage && '불러오는 중...'}
          </div>
        )}
      </div>
    </div>
  );
}

export default LatestLostItemList;
