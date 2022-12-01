import { APIResponse } from 'interfaces/APIResponse';

export type getNoticeRequest = {
  boardId: string
  page: string
};

export interface NoticeResponse extends APIResponse {
  articles: 
  {
    id: number
    board_id: number
    title: string
    content: string
    nickname: string
    updated_at: string
    created_at: string
    is_delete: boolean
    hit: number
  }[]
}