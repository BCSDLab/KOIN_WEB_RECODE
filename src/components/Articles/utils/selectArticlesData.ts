import { isNewArticle } from './setArticleRegisteredDate';
import type {
  ArticleWithNew,
  ArticlesResponse,
  LostItemArticleForGetDTO,
  LostItemArticlesResponseDTO,
  PaginationInfo,
} from 'api/articles/entity';

export interface ArticlesListViewData {
  articles: ArticleWithNew[];
  paginationInfo: PaginationInfo;
}

export interface LostItemPaginationViewData {
  articles: LostItemArticleForGetDTO[];
  paginationInfo: PaginationInfo;
}

export const selectArticlesWithNew = (data: ArticlesResponse): ArticlesListViewData => {
  const {
    articles,
    total_count,
    current_count,
    total_page,
    current_page,
  } = data;

  const currentDate = new Date();
  const articlesWithNew: ArticleWithNew[] = articles.map((article) => ({
    ...article,
    isNew: isNewArticle(article.registered_at, currentDate),
  }));

  return {
    articles: articlesWithNew,
    paginationInfo: {
      total_count,
      current_count,
      total_page,
      current_page,
    },
  };
};

export const selectLostItemPaginationData = (
  data: LostItemArticlesResponseDTO,
): LostItemPaginationViewData => ({
  articles: data.articles,
  paginationInfo: {
    total_count: data.total_count,
    current_count: data.current_count,
    total_page: data.total_page,
    current_page: data.current_page,
  },
});
