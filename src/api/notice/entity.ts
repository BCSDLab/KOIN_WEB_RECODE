import { APIResponse } from 'interfaces/APIResponse';

export type GetNoticeRequest = {
  boardId: string
  page: string
};

export type NoticeList = {
  id: number
  board_id: number
  comment_count: number
  title: string
  content: string
  nickname: string
  updated_at: string
  created_at: string
  is_delete: boolean
  hit: number
};

export interface NoticeResponse extends APIResponse {
  totalPage: number
  articles: NoticeList[]
}

export interface HotPostResponse extends APIResponse {
  board_id: number
  comment_count: number
  contentSummary: string
  title: string
  id: number
  created_at: string
  hit: number
}
