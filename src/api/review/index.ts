import APIClient from 'utils/ts/apiClient';
import { StoreReview, UploadFile } from './APIDetail';

export const postStoreReview = APIClient.of(StoreReview);

export const uploadFile = APIClient.of(UploadFile);
