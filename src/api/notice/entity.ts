import { APIResponse } from 'interfaces/APIResponse';

export type GetNoticeRequest = {
  boardId: string
  page: string
};

export type Article = {
  id: number
  board_id: number
  title: string
  nickname: string
  hit: number
  created_at: string // yyyy-MM-dd HH:mm:ss 이하 형식 동일
  updated_at: string
};

export interface ArticlesResponse extends APIResponse {
  articles: Article[]
  total_count: number
  current_count: number
  total_page: number
  current_page: number
}

export interface ArticleResponse extends Article, APIResponse {
  content: string;
}

export interface HotArticle extends Article { }

export type HotArticlesResponse = HotArticle[];
