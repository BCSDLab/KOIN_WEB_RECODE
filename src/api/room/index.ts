import { APIClient } from 'utils/ts/apiClient';
import { RoomList, RoomDetailInfo } from './APIDetail';

export const getRoomList = APIClient.of(RoomList);

export const getRoomDetailInfo = APIClient.of(RoomDetailInfo);
