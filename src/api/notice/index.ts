import { APIClient } from 'utils/ts/apiClient';
import {
  NoticeList,
  HotNoticeList,
  GetArticle,
} from './APIDetail';

export const PostList = APIClient.of(NoticeList);

export const HotPostList = APIClient.of(HotNoticeList);

export const Post = APIClient.of(GetArticle);
