import { APIClient } from 'utils/ts/apiClient';
import { NoticeList, HotNoticeList } from './APIDetail';

export const PostList = APIClient.of(NoticeList);

export const HotPostList = APIClient.of(HotNoticeList);
