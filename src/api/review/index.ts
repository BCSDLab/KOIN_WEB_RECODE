import APIClient from 'utils/ts/apiClient';
import {
  GetStoreReview, AddStoreReview, EditStoreReview, UploadFile,
} from './APIDetail';

export const getStoreReview = APIClient.of(GetStoreReview);

export const postStoreReview = APIClient.of(AddStoreReview);

export const putStoreReview = APIClient.of(EditStoreReview);

export const uploadFile = APIClient.of(UploadFile);
