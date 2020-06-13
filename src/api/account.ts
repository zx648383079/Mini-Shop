import {fetch, post, } from '../utils/http';
import {IData, IDataOne, IDriver, IConnect, IUser, ICertification, ISubtotal, IPage, IAccountLog, ICard} from './model';

export const getAccountLog = (params: any) => fetch<IPage<IAccountLog>>('shop/account/log', params);

export const getBankCardList = (params: any) => fetch<IPage<ICard>>('shop/account/card', params);

export const getAccountSubtotal = () => fetch<ISubtotal>('shop/account/subtotal');


export const getConnect = () => fetch<IData<IConnect>>('auth/account/connect');

export const getDriver = () => fetch<IData<IDriver>>('auth/account/driver');

export const saveFeedback = (param: any) => post<IDataOne<boolean>>('contact/home/feedback', param);

export const cancelUser = (param: any) => post<IUser>('auth/account/cancel', param);

export const getCertification = () => fetch<IDataOne<ICertification>>('shop/account/certification');