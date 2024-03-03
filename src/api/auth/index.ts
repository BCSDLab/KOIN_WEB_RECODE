import APIClient from 'utils/ts/apiClient';
import {
  Login, NicknameDuplicateCheck, Refresh, Signup,
} from './APIDetail';

export const login = APIClient.of(Login);

export const nicknameDuplicateCheck = APIClient.of(NicknameDuplicateCheck);

export const signup = APIClient.of(Signup);

export const refresh = APIClient.of(Refresh);
