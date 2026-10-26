import APIClient from 'utils/ts/apiClient';

import DiningResponse, { DiningLikePatcher, CancelDiningLikePatcher, CreateSoldoutReport } from './APIDetail';

export const getCafeteriaDinings = APIClient.of(DiningResponse);

export const likeCafeteriaDining = APIClient.of(DiningLikePatcher);

export const cancelCafeteriaDiningLike = APIClient.of(CancelDiningLikePatcher);

export const createSoldoutReport = APIClient.of(CreateSoldoutReport);
