import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import {
  NoticeResponse,
  HotPostResponse,
  ArticleList,
} from './entity';

export class NoticeList<R extends NoticeResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  auth = true;

  constructor(page: string | undefined) {
    this.path = `/articles?page=${page}&boardId=4`;
  }
}

export class GetArticle<R extends ArticleList> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  auth = false;

  constructor(id: string | undefined) {
    this.path = `/articles/${id}`;
  }
}

export class HotNoticeList<R extends HotPostResponse[]> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/articles/hot';

  response!: R;

  auth = true;
}
