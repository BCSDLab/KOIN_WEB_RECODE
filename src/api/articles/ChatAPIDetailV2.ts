import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import { LostItemChatroomDetailMessagesResponse, LostItemChatroomDetailMessage } from './entity';

export class GetLostItemChatroomMessagesV2<R extends LostItemChatroomDetailMessagesResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    articleId: number,
    chatRoomId: number,
  ) {
    this.path = `/v2/chatroom/lost-item/${articleId}/${chatRoomId}/messages`;
  }
}

export class PostLostItemChatroomMessageV2<R extends LostItemChatroomDetailMessage> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    articleId: number,
    chatRoomId: number,
    public data: {
      content: string;
      is_image: boolean;
    },
  ) {
    this.path = `/v2/chatroom/lost-item/${articleId}/${chatRoomId}/messages`;
  }
}

export class PostLeaveLostItemChatroomV2<R extends object> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path: string;

  response!: R;

  auth = true;

  constructor(
    public authorization: string,
    articleId: number,
    chatRoomId: number,
  ) {
    this.path = `/v2/chatroom/lost-item/${articleId}/${chatRoomId}/leave`;
  }
}
