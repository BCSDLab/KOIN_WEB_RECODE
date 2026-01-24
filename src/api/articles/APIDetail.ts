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
  LostItemChatroomPostResponse,
  LostItemChatroomListResponse,
  LostItemChatroomDetailResponse,
  LostItemChatroomDetailMessagesResponse,
  LostItemStatResponse,
  LostItemArticlesRequest,
  UpdateLostItemArticleRequestDTO,
} from './entity';

export class GetArticles<R extends ArticlesResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    page: string | undefined,
    boardId: number = 4,
  ) {
    this.path = `/articles?boardId=${boardId}&page=${page}&limit=10`;
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

  path = '/articles/lost-item/v2';

  params: {
    type?: string;
    page?: number;
    limit?: number;
    category?: string;
    foundStatus?: string;
    sort?: string;
    author?: string;
    title?: string;
  };

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    params: LostItemArticlesRequest,
  ) {
    this.params = params;
  }
}

export class GetSingleLostItemArticle<R extends SingleLostItemArticleResponseDTO> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  constructor(
    public authorization: string,
    id: number,
  ) {
    this.path = `/articles/lost-item/v2/${id}`;
  }
}

export class PostLostItemArticles<R extends LostItemArticlesPostResponseDTO> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/articles/lost-item';

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    public data: LostItemArticlesRequestDTO,
  ) {}
}

export class DeleteLostItemArticle<R extends LostItemResponse> implements APIRequest<R> {
  method = HTTP_METHOD.DELETE;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    id: number,
  ) {
    this.path = `/articles/lost-item/${id}`;
  }
}

export class PostReportLostItemArticle<R extends ReportItemArticleResponseDTO> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path: string;

  response!: R;

  auth = true; // 인증 필요

  constructor(
    public authorization: string,
    id: number,
    public data: ReportItemArticleRequestDTO,
  ) {
    this.path = `/articles/lost-item/${id}/reports`;
  }
}
export class PostLostItemChatroom<R extends LostItemChatroomPostResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    articleId: number,
  ) {
    this.path = `/chatroom/lost-item/${articleId}`;
  }
}

export class GetLostItemChatroomList<R extends LostItemChatroomListResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/chatroom/lost-item';

  response!: R;

  auth = true;

  constructor(public authorization: string) {}
}

export class GetLostItemChatroomDetail<R extends LostItemChatroomDetailResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    articleId: number,
    chatroomId: number,
  ) {
    this.path = `/chatroom/lost-item/${articleId}/${chatroomId}`;
  }
}

export class GetLostItemChatroomDetailMessages<R extends LostItemChatroomDetailMessagesResponse>
  implements APIRequest<R>
{
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    articleId: number,
    chatroomId: number,
  ) {
    this.path = `/chatroom/lost-item/${articleId}/${chatroomId}/messages`;
  }
}

export class PostBlockLostItemChatroom<R extends object> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    articleId: number,
    chatroomId: number,
  ) {
    this.path = `/chatroom/lost-item/${articleId}/${chatroomId}/block`;
  }
}

export class GetLostItemStat<R extends LostItemStatResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/articles/lost-item/stats';

  response!: R;

  auth = false;
}

export class PostFoundLostItem<R extends object> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    id: number,
  ) {
    this.path = `/articles/lost-item/${id}/found`;
  }
}

export class PutLostItemArticle<R extends SingleLostItemArticleResponseDTO> implements APIRequest<R> {
  method = HTTP_METHOD.PUT;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    id: number,
    public data: UpdateLostItemArticleRequestDTO,
  ) {
    this.path = `/articles/lost-item/${id}`;
  }
}
