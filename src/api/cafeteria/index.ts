import APIClient from 'utils/ts/apiClient';
import DiningResponse, { DiningLikePatcher, CancelDiningLikePatcher } from './APIDetail';

export const like = APIClient.of(DiningLikePatcher);

export const cancelLike = APIClient.of(CancelDiningLikePatcher);

export default APIClient.of(DiningResponse);
