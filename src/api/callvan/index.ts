import APIClient from 'utils/ts/apiClient';
import {
  DeleteAllNotifications,
  GetCallvanList,
  GetCallvanNotifications,
  PostCallvan,
  PostMarkAllNotificationsRead,
  PostMarkNotificationRead,
  PutCloseCallvanPost,
  PutCompleteCallvanPost,
  PutReopenCallvanPost,
} from './APIDetail';

export const getCallvanList = APIClient.of(GetCallvanList);
export const getCallvanNotifications = APIClient.of(GetCallvanNotifications);
export const markAllNotificationsRead = APIClient.of(PostMarkAllNotificationsRead);
export const markNotificationRead = APIClient.of(PostMarkNotificationRead);
export const deleteAllNotifications = APIClient.of(DeleteAllNotifications);
export const createCallvan = APIClient.of(PostCallvan);
export const closeCallvanPost = APIClient.of(PutCloseCallvanPost);
export const reopenCallvanPost = APIClient.of(PutReopenCallvanPost);
export const completeCallvanPost = APIClient.of(PutCompleteCallvanPost);
