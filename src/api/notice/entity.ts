import { APIResponse } from 'interfaces/APIResponse';

export interface GetNoticeRequest {
  boardId: string
  page: string
}

export interface Article {
  id: number
  board_id: number
  title: string
  nickname: string
  hit: number
  created_at: string // yyyy-MM-dd HH:mm:ss 이하 형식 동일
  updated_at: string
}

export interface PaginationInfo {
  total_count: number
  current_count: number
  total_page: number
  current_page: number
}

export interface PaginatedResponse<T> extends PaginationInfo, APIResponse {
  articles: T[];
}

export type ArticlesResponse = PaginatedResponse<Article>;
export type ArticlesSearchResponse = PaginatedResponse<Article>;

export interface ArticleResponse extends Article, APIResponse {
  content: string;
}

export interface HotArticle extends Article { }

export type HotArticlesResponse = HotArticle[];
