import {fetch} from '../utils/http';
import { IData, IArticle, IArticleCategory, IPage } from './model';

export const getArticleList = (params: any) => fetch<IPage<IArticle>>('shop/article', params);

export const getCategories = (parent_id: number = 0) => 
    fetch<IData<IArticleCategory>>('shop/article/category', {parent_id});
export const getArticle = (id: number) => fetch<IArticle>('shop/article', {id});
