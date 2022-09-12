import { APIClient } from 'utils/ts/apiClient';
import { Login, NicknameDuplicateCheck, Signup } from './APIDetail';

export const login = APIClient.of(Login);

export const nicknameDuplicateCheck = APIClient.of(NicknameDuplicateCheck);

export const signup = APIClient.of(Signup);
