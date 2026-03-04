import APIClient from 'utils/ts/apiClient';
import { GetCallvanList, GetCallvanNotifications } from './APIDetail';

export const getCallvanList = APIClient.of(GetCallvanList);
export const getCallvanNotifications = APIClient.of(GetCallvanNotifications);
