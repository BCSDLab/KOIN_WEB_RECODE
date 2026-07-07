import type { GetStaticPaths, GetStaticProps } from 'next';
import { getArticle, getArticles, getHotArticles } from 'api/articles';
import { ArticleResponseWithNew, HotArticle } from 'api/articles/entity';
import ArticlesPageLayout from 'components/Articles/ArticlesPage';
import ArticleContent from 'components/Articles/components/ArticleContent';
import ArticleHeader from 'components/Articles/components/ArticleHeader';
import MobileArticleDetailFooter from 'components/Articles/components/MobileArticleDetailFooter';
import { isNewArticle } from 'components/Articles/utils/setArticleRegisteredDate';
import { SSRLayout } from 'components/layout';
import {
  ARTICLE_DETAIL_ISR_REVALIDATE_SECONDS,
  ARTICLE_HOT_PATH_LIMIT,
  isNotFoundKoinError,
  withStaticFetchRetry,
} from 'utils/ts/isr';

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const { articles } = await withStaticFetchRetry(() => getArticles('', '1'));

    return {
      paths: articles.slice(0, ARTICLE_HOT_PATH_LIMIT).map((article) => ({
        params: { id: String(article.id) },
      })),
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('[ISR] failed to prebuild article detail paths:', error);

    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

export const getStaticProps: GetStaticProps<
  { article: ArticleResponseWithNew; hotArticles: HotArticle[] },
  { id: string }
> = async ({ params }) => {
  const id = params?.id;
  if (!id) {
    return { notFound: true, revalidate: ARTICLE_DETAIL_ISR_REVALIDATE_SECONDS };
  }

  try {
    const article = await withStaticFetchRetry(() => getArticle(id));
    const hotArticles = (await withStaticFetchRetry(() => getHotArticles()).catch(() => [])) ?? [];
    const serverTime = new Date();

    const articleWithNew: ArticleResponseWithNew = {
      ...article,
      isNew: isNewArticle(article.registered_at, serverTime),
    };

    return {
      props: { article: articleWithNew, hotArticles },
      revalidate: ARTICLE_DETAIL_ISR_REVALIDATE_SECONDS,
    };
  } catch (error) {
    if (isNotFoundKoinError(error)) {
      return { notFound: true, revalidate: ARTICLE_DETAIL_ISR_REVALIDATE_SECONDS };
    }
    throw error;
  }
};

export default function ArticlesDetailPage({
  article,
  hotArticles,
}: {
  article: ArticleResponseWithNew;
  hotArticles?: HotArticle[];
}) {
  return (
    <ArticlesPageLayout>
      <ArticleHeader
        boardId={article.board_id}
        title={article.title}
        registeredAt={article.registered_at}
        author={article.author}
        hit={article.hit}
        isNew={article.isNew}
      />
      <ArticleContent content={article.content} attachments={article.attachments} />
      <MobileArticleDetailFooter prevId={article.prev_id} nextId={article.next_id} hotArticles={hotArticles} />
    </ArticlesPageLayout>
  );
}

ArticlesDetailPage.getLayout = (page: React.ReactElement) => <SSRLayout>{page}</SSRLayout>;
