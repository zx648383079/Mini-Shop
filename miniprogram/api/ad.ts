import {fetch} from '../utils/http';
import { IData, IAd } from './model';

export const getAds = (position: number) => fetch<IData<IAd>>('shop/ad', {
    position,
});

export const getBanners = () => fetch<IData<IAd>>('shop/ad/banner');
