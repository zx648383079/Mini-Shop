import {fetch, post} from '../utils/http';
import { IPage, ICoupon, IDataOne } from './model';

export const getCouponList = (param: any = {}) => fetch<IPage<ICoupon>>('shop/coupon', param);

export const getMyCoupon = (param: any = {}) => fetch<IPage<ICoupon>>('shop/coupon/my', param);

export const receiveCoupon = (id: number) => post<IDataOne<boolean>>('shop/coupon/receive', {id});
