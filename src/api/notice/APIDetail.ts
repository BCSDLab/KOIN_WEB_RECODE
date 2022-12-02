import { APIRequest } from 'interfaces/APIRequest';
import { HTTP_METHOD } from 'utils/ts/apiClient';
import { NoticeResponse, HotPostResponse } from './entity';

export class NoticeList<R extends NoticeResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/articles?page=1&boardId=5';

  response!: R;

  auth = true;
}

export class HotNoticeList<R extends HotPostResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/articles/hot/list';

  response!: R;

  auth = true;
}
