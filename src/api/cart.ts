import {fetch, post, put, deleteRequest} from '../utils/http';
import { IData, ICart, IPayment, IShipping, ICartItem, IOrder, ICartDialog } from './model';

export const getCart = (params?: any) => fetch<ICart>('shop/cart', params)

export const addGoods = (goods: number, amount: number = 1, properties = []) => post<ICart | ICartDialog>('shop/cart/add', {
    goods,
    amount,
    properties,
});

export const updateGoods = (goods: number, amount: number = 1, properties = []) => post<ICart | ICartDialog>('shop/cart/update_goods', {
    goods,
    amount,
    properties,
});

export const updateItem = (id: number, amount: number = 1) => put<ICart>('shop/cart/update', {
    id,
    amount,
});

export const deleteItem = (id: number) => deleteRequest<ICart>('shop/cart/delete?id=' + id);

export const deleteAll = () => post<ICart>('shop/cart/clear', {});

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
