import APIClient from 'utils/ts/apiClient';
import {
  ClubCategories,
  ClubList,
  HotClub,
  AddClubLike,
  CancelClubLike,
} from './APIDetail';

export const getClubCategories = APIClient.of(ClubCategories);

export const getClubList = APIClient.of(ClubList);

export const getHotClub = APIClient.of(HotClub);

export const putAddClubLike = APIClient.of(AddClubLike);

export const deleteCancelLike = APIClient.of(CancelClubLike);
