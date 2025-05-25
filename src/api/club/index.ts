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

export const putClubLike = APIClient.of(AddClubLike);

export const deleteClubLike = APIClient.of(CancelClubLike);
