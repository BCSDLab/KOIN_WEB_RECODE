import APIClient from 'utils/ts/apiClient';
import {
  GetArticles,
  GetHotArticles,
  GetArticle,
  GetLostItemArticles,
  GetSingleLostItemArticle,
  DeleteLostItemArticle,
  PostLostItemArticles,
  PostLostItemChatroom,
  PostBlockLostItemChatroom,
  GetLostItemChatroomList,
  GetLostItemChatroomDetail,
  GetLostItemChatroomDetailMessages,
} from './APIDetail';

export const getArticles = APIClient.of(GetArticles);

export const getArticle = APIClient.of(GetArticle);

export const getHotArticles = APIClient.of(GetHotArticles);

export const getLostItemArticles = APIClient.of(GetLostItemArticles);

export const getSingleLostItemArticle = APIClient.of(GetSingleLostItemArticle);

export const postLostItemArticle = APIClient.of(PostLostItemArticles);

export const deleteLostItemArticle = APIClient.of(DeleteLostItemArticle);

export const postLostItemChatroom = APIClient.of(PostLostItemChatroom);

export const getLostItemChatroomList = APIClient.of(GetLostItemChatroomList);

export const getLostItemChatroomDetail = APIClient.of(GetLostItemChatroomDetail);

export const getLostItemChatroomDetailMessages = APIClient.of(GetLostItemChatroomDetailMessages);

export const postBlockLostItemChatroom = APIClient.of(PostBlockLostItemChatroom);
