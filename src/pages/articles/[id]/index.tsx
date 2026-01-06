import { GetServerSidePropsContext } from 'next';
import { articles } from 'api';
import { ArticleResponseWithNew } from 'api/articles/entity';
import ArticlesPageLayout from 'components/Articles/ArticlesPage';
import ArticleContent from 'components/Articles/components/ArticleContent';
import ArticleHeader from 'components/Articles/components/ArticleHeader';
import { isNewArticle } from 'components/Articles/utils/setArticleRegisteredDate';
import { SSRLayout } from 'components/layout';

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const id = ctx.query.id;
  if (typeof id !== 'string') {
    return { notFound: true };
  }
  const article = await articles.getArticle(id);
  const serverTime = new Date(); // 서버 시간 고정

  const articleWithNew: ArticleResponseWithNew = {
    ...article,
    isNew: isNewArticle(article.registered_at, serverTime),
  };

  return { props: { article: articleWithNew } };
};

export default function ArticlesDetailPage({ article }: { article: ArticleResponseWithNew }) {
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
      <ArticleContent content={article.content} />
    </ArticlesPageLayout>
  );
}

ArticlesDetailPage.getLayout = (page: React.ReactElement) => <SSRLayout>{page}</SSRLayout>;
