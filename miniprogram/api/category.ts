import {fetch} from '../utils/http';
import { IData, ICategory, ICategoryObject } from './model';

export const getCategories = (parent: number = 0) => fetch<IData<ICategory>>('shop/category', {parent});

export const getCategory = (id: number, extra?: string) => fetch<ICategory>('shop/category', {id, extra});

export const getCategoryLevel = () => fetch<IData<ICategory>>('shop/category/level');

export const getCategoryTree = () => fetch<IData<ICategoryObject>>('shop/category/tree');
