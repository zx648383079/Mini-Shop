import { fetch } from "../utils/http";
import { IPage, IUser, ISubtotal } from "./model";

export const getUsers = (param: any) => fetch<IPage<IUser>>('shop/affiliate/user', param);

export const getSubtotal = () => fetch<ISubtotal>('shop/affiliate/subtotal');

export const getOrders = (param: any) => fetch<IPage<any>>('shop/affiliate/order', param);