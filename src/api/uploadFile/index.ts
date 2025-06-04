import APIClient from 'utils/ts/apiClient';
import { ShopUploadFile, LostItemUploadFile, ClubUploadFile } from './APIDetail';

export const uploadShopFile = APIClient.of(ShopUploadFile);
export const uploadLostItemFile = APIClient.of(LostItemUploadFile);
export const uploadClubFile = APIClient.of(ClubUploadFile);
