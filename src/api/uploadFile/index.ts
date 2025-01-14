import APIClient from 'utils/ts/apiClient';
import { ShopUploadFile, LostItemUploadFile } from './APIDetail';

export const uploadShopFile = APIClient.of(ShopUploadFile);
export const uploadLostItemFile = APIClient.of(LostItemUploadFile);
