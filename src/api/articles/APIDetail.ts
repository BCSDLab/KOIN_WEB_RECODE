import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import {
  ArticlesResponse,
  ArticleResponse,
  HotArticlesResponse,
  SingleLostItemArticleResponseDTO,
  LostItemArticlesResponseDTO,
  LostItemResponse,
  LostItemArticlesRequestDTO,
  LostItemArticlesPostResponseDTO,
  ReportItemArticleRequestDTO,
  ReportItemArticleResponseDTO,
  ItemArticleRequestDTO,
  LostItemChatroomPostResponse,
  LostItemChatroomListResponse,
  LostItemChatroomDetailResponse,
  LostItemChatroomDetailMessagesResponse,
} from './entity';

export class GetArticles<R extends ArticlesResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  auth = true;

  constructor(public authorization: string, page: string | undefined) {
    this.path = `/articles?page=${page}&limit=10`;
  }
}

export class GetArticle<R extends ArticleResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  constructor(id: string | undefined) {
    this.path = `/articles/${id}`;
  }
}

export class GetHotArticles<R extends HotArticlesResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/articles/hot';

  response!: R;
}

export class GetLostItemArticles<R extends LostItemArticlesResponseDTO> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  auth = true;

  constructor(public authorization: string, public data: ItemArticleRequestDTO) {
    this.path = '/articles/lost-item';
  }
}

export class GetSingleLostItemArticle<
  R extends SingleLostItemArticleResponseDTO> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  constructor(id: number) {
    this.path = `/articles/lost-item/${id}`;
  }
}

export class PostLostItemArticles<
  R extends LostItemArticlesPostResponseDTO> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/articles/lost-item';

  response!: R;

  auth = true;

  constructor(public authorization: string, public data: LostItemArticlesRequestDTO) { }
}

export class DeleteLostItemArticle<R extends LostItemResponse> implements APIRequest<R> {
  method = HTTP_METHOD.DELETE;

  path: string;

  response!: R;

  auth = true;

  constructor(public authorization: string, id: number) {
    this.path = `/articles/lost-item/${id}`;
  }
}

export class PostReportLostItemArticle<
  R extends ReportItemArticleResponseDTO> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path: string;

  response!: R;

  auth = true; // 인증 필요

  constructor(public authorization: string, id: number, public data: ReportItemArticleRequestDTO) {
    this.path = `/articles/lost-item/${id}/reports`;
  }
}
export class PostLostItemChatroom<
  R extends LostItemChatroomPostResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path: string;

  response!: R;

  auth = true;

  constructor(public authorization: string, articleId: number) {
    this.path = `/chatroom/lost-item/${articleId}`;
  }
}

export class GetLostItemChatroomList<
  R extends LostItemChatroomListResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/chatroom/lost-item';

  response!: R;

  auth = true;

  constructor(public authorization: string) { }
}

export class GetLostItemChatroomDetail<
  R extends LostItemChatroomDetailResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  auth = true;

  constructor(public authorization: string, articleId: number, chatroomId: number) {
    this.path = `/chatroom/lost-item/${articleId}/${chatroomId}`;
  }
}

export class GetLostItemChatroomDetailMessages<
  R extends LostItemChatroomDetailMessagesResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  auth = true;

  constructor(public authorization: string, articleId: number, chatroomId: number) {
    this.path = `/chatroom/lost-item/${articleId}/${chatroomId}/messages`;
  }
}

export class PostBlockLostItemChatroom<R extends {}> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path: string;

  response!: R;

  auth = true;

  constructor(public authorization: string, articleId: number, chatroomId: number) {
    this.path = `/chatroom/lost-item/${articleId}/${chatroomId}/block`;
  }
}
