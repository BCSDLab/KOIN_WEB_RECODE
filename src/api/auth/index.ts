import { APIClient } from 'api/apiClient';
import * as AuthAPI from './login';

export const login = APIClient.of(AuthAPI.Login);

export const refresh = APIClient.of(AuthAPI.Refresh);
