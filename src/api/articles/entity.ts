import { APIResponse } from 'interfaces/APIResponse';

export interface GetArticlesRequest {
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
  is_reported: boolean
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

// GET /articles/lost-item
interface LostItemArticleForGetDTO {
  id: number;
  board_id: number;
  type: string;
  category: string;
  found_place: string;
  found_date: string;
  content: string;
  author: string;
  registered_at: string;
  updated_at: string;
  is_reported: boolean;
}

export interface LostItemArticlesResponseDTO extends APIResponse {
  articles: LostItemArticleForGetDTO[];
  total_count: number;
  current_count: number;
  total_page: number;
  current_page: number;
}

interface ImageDTO {
  id: number;
  image_url: string;
}

export interface SingleLostItemArticleResponseDTO extends APIResponse {
  id: number;
  board_id: number;
  type: string;
  category: string;
  found_place: string;
  found_date: string;
  content: string;
  author: string;
  is_council: boolean;
  is_mine: boolean
  images: ImageDTO[];
  prev_id: number | null;
  next_id: number | null;
  registered_at: string; // yyyy-MM-dd
  updated_at: string; // yyyy-MM-dd HH:mm:ss
}

export interface LostItemResponse extends APIResponse {
  id: number;
  board_id: number;
  category: string;
  found_place: string;
  found_date: string;
  content: string;
  author: string;
  images: ImageDTO[];
  prev_id: number | null;
  next_id: number | null;
  registered_at: string;
  updated_at: string;
}

// POST /articles/lost-item
interface LostItemArticleForPostDTO {
  type: string;
  category: string;
  found_place: string;
  found_date: string; // yyyy-MM-dd
  content: string;
  images: string[];
  registered_at: string;
  updated_at: string;
}

export interface LostItemArticlesRequestDTO {
  articles: Array<LostItemArticleForPostDTO>;
}

export interface LostItemArticlesPostResponseDTO {
  id: number;
  board_id: number;
  type: string;
  category: string;
  found_place: string;
  found_date: string; // yyyy-MM-dd
  content: string;
  author: string;
  is_council: boolean;
  is_mine: boolean;
  images: LostItemImageDTO[];
  prev_id: number | null;
  next_id: number | null;
  registered_at: string;
  updated_at: string;
}

interface LostItemImageDTO {
  id: number;
  image_url: string;
}

export interface LostItemArticleResponse {
  article: LostItemArticlesPostResponseDTO;
}

// POST /articles/lost-item/{id}/reports)
export interface ReportItemArticleRequestDTO {
  reports: Array<{
    title: string;
    content: string;
  }>;
}

export interface ReportItemArticleResponseDTO extends APIResponse { }

export interface ItemArticleRequestDTO {
  boardId: number;
  page: number;
  limit: number;
}
export interface LostItemChatroomDetailResponse {
  article_id: number;
  chat_room_id: number;
  user_id: number;
  article_title: string;
  chat_partner_profile_image?: string;
}

export type LostItemChatroomPostResponse = LostItemChatroomDetailResponse;

interface LostItemChatroomResponse {
  article_title: string;
  recent_message_content: string;
  lost_item_image_url: string;
  unread_message_count: number;
  last_message_at: string;
  article_id: number;
  chat_room_id: number;
}

export type LostItemChatroomListResponse = LostItemChatroomResponse[];

export interface LostItemChatroomDetailMessage {
  user_id: number;
  user_nickname: string;
  content: string;
  timestamp: string;
  is_image: boolean;
}

export type LostItemChatroomDetailMessagesResponse = LostItemChatroomDetailMessage[];
