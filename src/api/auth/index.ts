import APIClient from 'utils/ts/apiClient';
import {
  Login,
  NicknameDuplicateCheck,
  Refresh,
  Signup,
  User,
  UserAcademicInfo,
  UpdateUser,
  FindPassword,
  DeleteUser,
  CheckPassword,
  UpdateAcademicInfo,
} from './APIDetail';

export const login = APIClient.of(Login);

export const nicknameDuplicateCheck = APIClient.of(NicknameDuplicateCheck);

export const signup = APIClient.of(Signup);

export const refresh = APIClient.of(Refresh);

export const getUser = APIClient.of(User);

export const getUserAcademicInfo = APIClient.of(UserAcademicInfo);

export const updateUser = APIClient.of(UpdateUser);

export const deleteUser = APIClient.of(DeleteUser);

export const findPassword = APIClient.of(FindPassword);

export const checkPassword = APIClient.of(CheckPassword);

export const updateAcademicInfo = APIClient.of(UpdateAcademicInfo);
