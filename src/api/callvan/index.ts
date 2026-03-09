import APIClient from 'utils/ts/apiClient';
import {
  DeleteAllNotifications,
  DeleteCancelCallvan,
  GetCallvanChat,
  GetCallvanList,
  GetCallvanNotifications,
  GetCallvanPostDetail,
  PostCallvan,
  PostCallvanChat,
  PostJoinCallvan,
  PostMarkAllNotificationsRead,
  PostMarkNotificationRead,
  PutCloseCallvanPost,
  PutCompleteCallvanPost,
  PutReopenCallvanPost,
} from './APIDetail';

export const getCallvanList = APIClient.of(GetCallvanList);
export const getCallvanPostDetail = APIClient.of(GetCallvanPostDetail);
export const getCallvanNotifications = APIClient.of(GetCallvanNotifications);
export const markAllNotificationsRead = APIClient.of(PostMarkAllNotificationsRead);
export const markNotificationRead = APIClient.of(PostMarkNotificationRead);
export const deleteAllNotifications = APIClient.of(DeleteAllNotifications);
export const createCallvan = APIClient.of(PostCallvan);
export const closeCallvanPost = APIClient.of(PutCloseCallvanPost);
export const reopenCallvanPost = APIClient.of(PutReopenCallvanPost);
export const completeCallvanPost = APIClient.of(PutCompleteCallvanPost);
export const joinCallvan = APIClient.of(PostJoinCallvan);
export const cancelCallvan = APIClient.of(DeleteCancelCallvan);
export const getCallvanChat = APIClient.of(GetCallvanChat);
export const sendCallvanChat = APIClient.of(PostCallvanChat);
