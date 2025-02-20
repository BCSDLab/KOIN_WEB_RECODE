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
