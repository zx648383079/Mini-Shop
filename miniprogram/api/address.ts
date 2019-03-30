import { IAddress, IData, IDataOne } from './model';
import { fetch, post, deleteRequest } from '../utils/http';


export const getAddressList = () => fetch<IData<IAddress>>('shop/address');

export const getAddress = (id: number) => fetch<IAddress>('shop/address', {id});

export const createAddress = (param: any) => post<IAddress>('shop/address/create', param);

export const updateAddress = (param: any) => post<IAddress>('shop/address/update', param);
export const defaultAddress = (id: number) => post<IAddress>('shop/address/default', {id});

export const deleteAddress = (id: number) => deleteRequest<IDataOne<boolean>>('shop/address/delete?id=' + id);


