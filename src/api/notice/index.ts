import APIClient from 'utils/ts/apiClient';
import { GetArticles, GetHotArticles, GetArticle } from './APIDetail';

export const getArticles = APIClient.of(GetArticles);

export const getArticle = APIClient.of(GetArticle);

export const getHotArticles = APIClient.of(GetHotArticles);
