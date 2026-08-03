import APIClient from 'utils/ts/apiClient';
import { GetDepartmentContacts, GetDepartmentContactsByCategory } from './APIDetail';

export const getDepartmentContacts = APIClient.of(GetDepartmentContacts);

export const getDepartmentContactsByCategory = APIClient.of(GetDepartmentContactsByCategory);
