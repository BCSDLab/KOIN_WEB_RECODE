import { APIResponse } from 'interfaces/APIResponse';

export interface GetNoticeRequest {
  boardId: string
  page: string
}

export interface Article {
  id: number
  board_id: number
  title: string
  author: string
  hit: number
  registered_at: string // yyyy-MM-dd 아우누리에 게시판에 등록된 날짜
  updated_at: string // yyyy-MM-dd HH:mm:ss 이하 형식 동일
}

export interface Attachment {
  id: 1,
  name: string,
  url: string,
  created_at: string,
  updated_at: string,
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
  attachments: Attachment[];
  prev_id: number;
  next_id: number;
}

export interface HotArticle extends Article { }

export type HotArticlesResponse = HotArticle[];
