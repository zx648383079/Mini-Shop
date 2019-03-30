import {fetch, post} from '../utils/http';
import { IData, ICart, IPayment, IShipping, ICartItem, IOrder } from './model';

export const getCart = (params?: any) => fetch<IData<ICart>>('shop/cart', params)

export const addGoods = (goods: number, amount: number = 1, properties = []) => post<IData<ICart>>('shop/cart/add', {
    goods,
    amount,
    properties,
});

export const updateItem = (id: number, amount: number = 1) => post<IData<ICart>>('shop/cart/update', {
    id,
    amount,
});

export const deleteItem = (id: number) => post<IData<ICart>>('shop/cart/delete', {
    id,
});

export const getPaymentList = (goods?: number[], shipping?: number) =>
    post<IData<IPayment>>('shop/cashier/payment', {goods, shipping});
export const getShippingList = (goods: number[] | ICartItem[], address: number, type: number = 0) =>
    post<IData<IShipping>>('shop/cashier/shipping', {goods, address, type});

export const previewOrder = (goods: number[] | ICartItem[],
                            address: number, shipping: number = 0, payment: number = 0, type: number = 0) =>
    post<IOrder>('shop/cashier/preview', {goods, address, shipping, payment, type});

export const checkoutOrder = (goods: number[] | ICartItem[],
                                address: number, shipping: number, payment: number, type: number = 0) =>
    post<IOrder>('shop/cashier/checkout', {goods, address, shipping, payment, type});
