import {
  GetLostItemChatroomMessagesV2,
  PostLeaveLostItemChatroomV2,
  PostLostItemChatroomMessageV2,
} from 'api/articles/ChatAPIDetailV2';
import APIClient from 'utils/ts/apiClient';
import {
  GetArticles,
  GetHotArticles,
  GetArticle,
  GetLostItemArticles,
  GetSingleLostItemArticle,
  DeleteLostItemArticle,
  PostLostItemArticles,
  PostReportLostItemArticle,
  PostLostItemChatroom,
  PostBlockLostItemChatroom,
  GetLostItemChatroomList,
  GetLostItemChatroomDetail,
  GetLostItemChatroomDetailMessages,
  GetLostItemStat,
  PostFoundLostItem,
  PutLostItemArticle,
  GetLostItemSearch,
} from './APIDetail';

export const getArticles = (token: string, page: string) => APIClient.of(GetArticles)(token, page);

export const getArticle = APIClient.of(GetArticle);

export const getHotArticles = APIClient.of(GetHotArticles);

export const getLostItemArticles = APIClient.of(GetLostItemArticles);

export const getSingleLostItemArticle = APIClient.of(GetSingleLostItemArticle);

export const postLostItemArticle = APIClient.of(PostLostItemArticles);

export const deleteLostItemArticle = APIClient.of(DeleteLostItemArticle);

export const postReportLostItemArticle = APIClient.of(PostReportLostItemArticle);

export const postLostItemChatroom = APIClient.of(PostLostItemChatroom);

export const getLostItemChatroomList = APIClient.of(GetLostItemChatroomList);

export const getLostItemChatroomDetail = APIClient.of(GetLostItemChatroomDetail);

export const getLostItemChatroomDetailMessages = APIClient.of(GetLostItemChatroomDetailMessages);

export const postBlockLostItemChatroom = APIClient.of(PostBlockLostItemChatroom);

export const getLostItemStat = APIClient.of(GetLostItemStat);

export const postFoundLostItem = APIClient.of(PostFoundLostItem);

export const putLostItemArticle = APIClient.of(PutLostItemArticle);

export const getLostItemSearch = APIClient.of(GetLostItemSearch);

export const getLostItemChatroomMessagesV2 = APIClient.of(GetLostItemChatroomMessagesV2);

export const postLostItemChatroomMessageV2 = APIClient.of(PostLostItemChatroomMessageV2);

export const postLeaveLostItemChatroomV2 = APIClient.of(PostLeaveLostItemChatroomV2);
