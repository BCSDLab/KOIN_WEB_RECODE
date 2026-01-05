import { GetServerSidePropsContext } from 'next';
import { articles } from 'api';
import { ArticleResponse } from 'api/articles/entity';
import ArticlesPageLayout from 'components/Articles/ArticlesPage';
import ArticleContent from 'components/Articles/components/ArticleContent';
import ArticleHeader from 'components/Articles/components/ArticleHeader';
import { SSRLayout } from 'components/layout';

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const id = ctx.query.id;
  if (typeof id !== 'string') {
    return { notFound: true };
  }
  const article = await articles.getArticle(id);
  return { props: { article } };
};

export default function ArticlesDetailPage({ article }: { article: ArticleResponse }) {
  return (
    <ArticlesPageLayout>
      <ArticleHeader
        boardId={article.board_id}
        title={article.title}
        registeredAt={article.registered_at}
        author={article.author}
        hit={article.hit}
      />
      <ArticleContent content={article.content} />
    </ArticlesPageLayout>
  );
}

ArticlesDetailPage.getLayout = (page: React.ReactElement) => <SSRLayout>{page}</SSRLayout>;
