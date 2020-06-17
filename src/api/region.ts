import { IRegionObject, IDataOne } from './model';
import { fetch } from '../utils/http';


export const getRegionTree = () => fetch<IDataOne<IRegionObject>>('shop/region/tree');


export const getRegionChildren = (id: number = 0) => fetch<IDataOne<IRegionObject>>('shop/region', {id});