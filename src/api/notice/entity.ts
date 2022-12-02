import { APIResponse } from 'interfaces/APIResponse';

export type getNoticeRequest = {
  boardId: string
  page: string
};

export type HotList = {
  'board_id': number
  'comment_count': number
  'contentSummary': string
  'title': string
  'id': number
  'created_at': string
  'hit': number
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

export interface HotPostResponse extends APIResponse {
  [index: number]: HotList;
};