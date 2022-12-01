import { APIRequest } from 'interfaces/APIRequest';
import { HTTP_METHOD } from 'utils/ts/apiClient';
import { NoticeResponse } from './entity';

export default class NoticeList<R extends NoticeResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/articles?page=1&boardId=4';

  response!: R;

  auth = true;
}
