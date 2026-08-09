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

/**
 * NEW 뱃지 판정 기준 시각을 밖에서 받는다.
 *
 * 이 셀렉터는 서버 렌더와 하이드레이션 양쪽에서 실행된다. 안에서 `new Date()`로 잡으면
 * 클라이언트는 사용자 기기 시계를 쓰므로 판정이 갈리고, `<img alt="NEW">`의 유무가
 * 서버 HTML과 달라져 하이드레이션이 깨진다.
 */
export const createArticlesWithNewSelector = (
  referenceDate: string,
) => (data: ArticlesResponse): ArticlesListViewData => {
  const {
    articles,
    total_count,
    current_count,
    total_page,
    current_page,
  } = data;

  const currentDate = new Date(referenceDate);
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
