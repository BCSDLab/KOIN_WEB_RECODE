import { APIRequest } from 'interfaces/APIRequest';
import { HTTP_METHOD } from 'utils/ts/apiClient';
import { RoomListResponse, RoomDetailResponse } from './entity';

export class RoomList<R extends RoomListResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/lands';

  response!: R;
}

export class RoomDetailInfo<R extends RoomDetailResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  response!: R;

  path = 'lands/:id';

  constructor(id: number) {
    this.path = `lands/${id}`;
  }
}
