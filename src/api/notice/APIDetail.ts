import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import {
  ArticlesResponse,
  ArticleResponse,
  HotArticlesResponse,
  SingleLostItemArticleResponseDTO,
  LostItemArticlesResponseDTO,
  LostItemResponse,
  LostItemArticlesRequestDTO,
} from './entity';

const BOARD_IDS = {
  자유게시판: 1,
  취업게시판: 2,
  익명게시판: 3,
  공지사항: 4, // 전체 공지 조회 시 사용
  일반공지: 5,
  장학공지: 6,
  학사공지: 7,
  취업공지: 8,
  코인공지: 9,
  질문게시판: 10,
  홍보게시판: 11,
  현장실습: 12,
  학생생활: 13,
} as const;

export class GetArticles<R extends ArticlesResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  constructor(page: string | undefined) {
    this.path = `/articles?boardId=${BOARD_IDS.공지사항}&page=${page}&limit=10`;
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

  path = '/articles/lost-item';

  response!: R;
}

export class GetSingleLostItemArticle<R
extends SingleLostItemArticleResponseDTO> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  constructor(id: number) {
    this.path = `/articles/lost-item/${id}`;
  }
}

export class PostLostItemArticles<R extends LostItemResponse> implements APIRequest<R> {
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
