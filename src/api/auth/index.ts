import APIClient from 'utils/ts/apiClient';
import {
  Login,
  NicknameDuplicateCheck,
  Refresh,
  Signup,
  User,
  UpdateUser,
  FindPassword,
} from './APIDetail';

export const login = APIClient.of(Login);

export const nicknameDuplicateCheck = APIClient.of(NicknameDuplicateCheck);

export const signup = APIClient.of(Signup);

export const refresh = APIClient.of(Refresh);

export const getUser = APIClient.of(User);

export const updateUser = APIClient.of(UpdateUser);

export const findPassword = APIClient.of(FindPassword);
