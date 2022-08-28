import { APIClient } from 'utils/ts/apiClient';
import AuthAPI from './login';

const login = APIClient.of(AuthAPI);

export default login;
