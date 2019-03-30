import {fetch} from '../utils/http'
import { IPage, IProduct, IHomeProduct, IData, ISubtotal } from './model';

export const getList = (params: any) => fetch<IPage<IProduct>>('shop/goods', params);

export const getInfo = (id: number) => fetch<IProduct>('shop/goods', {
    id,
});

export const getRecommend = (id: number) => fetch<IData<IProduct>>('shop/goods/recommend', {
    id,
});

export const getHome = () => fetch<IHomeProduct>('shop/goods/home');

export const getHotKeywords = () => fetch<IData<string>>('shop/search/keywords');

export const getTips = (keywords: string) => fetch<IData<string>>('shop/search/tips', {
    keywords,
});

export const getSubtotal = () => fetch<ISubtotal>('shop/goods/count');
