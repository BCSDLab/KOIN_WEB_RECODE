import { APIRequest } from 'interfaces/APIRequest';
import { HTTP_METHOD } from 'utils/ts/apiClient';
import { NoticeResponse, HotPostResponse } from './entity';

export class NoticeList<R extends NoticeResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  auth = true;

  constructor(page: string | undefined) {
    this.path = `/articles?page=${page}&boardId=4`;
  }
}

export class HotNoticeList<R extends HotPostResponse[]> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/articles/hot/list';

  response!: R;

  auth = true;
}
