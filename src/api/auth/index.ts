import { APIClient } from 'api/apiClient';
import AuthAPI from './login';

const login = APIClient.of(AuthAPI);

export default login;
