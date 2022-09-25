import { APIClient } from 'utils/ts/apiClient';
import StoreListAPI from './store';

const getStoreList = APIClient.of(StoreListAPI);

export default getStoreList;
