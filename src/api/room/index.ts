import APIClient from 'utils/ts/apiClient';
import { LandList, LandDetailInfo } from './APIDetail';

export const getRoomList = APIClient.of(LandList);

export const getRoomDetailInfo = APIClient.of(LandDetailInfo);
