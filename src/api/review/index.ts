import APIClient from 'utils/ts/apiClient';
import { AddStoreReview, EditStoreReview, UploadFile } from './APIDetail';

export const postStoreReview = APIClient.of(AddStoreReview);

export const putStoreReview = APIClient.of(EditStoreReview);

export const uploadFile = APIClient.of(UploadFile);
