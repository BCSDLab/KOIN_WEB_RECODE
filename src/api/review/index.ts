import APIClient from 'utils/ts/apiClient';
import { GetStoreReview, AddStoreReview, EditStoreReview } from './APIDetail';

export const getStoreReview = APIClient.of(GetStoreReview);

export const postStoreReview = APIClient.of(AddStoreReview);

export const putStoreReview = APIClient.of(EditStoreReview);
