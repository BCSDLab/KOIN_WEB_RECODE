import apiClient from 'api';

const login = (body: any) => apiClient.post('/user/login', body);

export default {
  login,
};
