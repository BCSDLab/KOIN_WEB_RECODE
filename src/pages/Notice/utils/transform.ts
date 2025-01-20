import { LostItemArticlesRequestDTO, LostItemArticlesResponseDTO, SingleLostItemArticleResponseDTO } from 'api/notice/entity';
import { LostItemArticlesForGet, LostItemArticlesForPost, SingleLostItemArticle } from 'pages/Notice/ts/types';

export const transformLostItemArticles = (dto: LostItemArticlesResponseDTO)
: LostItemArticlesForGet => ({
  articles: dto.articles.map((article) => ({
    id: article.id,
    boardId: article.board_id,
    category: article.category,
    foundPlace: article.found_place,
    foundDate: article.found_date,
    content: article.content,
    author: article.author,
    registeredAt: article.registered_at,
    updatedAt: article.updated_at,
  })),
  totalCount: dto.total_count,
  currentCount: dto.current_count,
  totalPage: dto.total_page,
  currentPage: dto.current_page,
});

export const transformSingleLostItemArticle = (dto: SingleLostItemArticleResponseDTO)
: SingleLostItemArticle => ({
  id: dto.id,
  boardId: dto.board_id,
  category: dto.category,
  foundPlace: dto.found_place,
  foundDate: dto.found_date,
  content: dto.content,
  author: dto.author,
  images: dto.images.map((image) => ({
    id: image.id,
    imageUrl: image.image_url,
  })),
  prevId: dto.prev_id,
  nextId: dto.next_id,
  registeredAt: dto.registered_at,
  updatedAt: dto.updated_at,
});

export const transformLostItemArticlesForPost = (dto: LostItemArticlesForPost)
: LostItemArticlesRequestDTO => ({
  articles: dto.articles.map((article) => ({
    category: article.category,
    found_place: article.foundPlace,
    found_date: article.foundDate,
    content: article.content,
    images: article.images,
  })),
});
