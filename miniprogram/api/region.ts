import { IRegionObject, IDataOne } from './model';
import { fetch } from '../utils/http';


export const getRegionTree = () => fetch<IDataOne<IRegionObject>>('shop/region/tree');
