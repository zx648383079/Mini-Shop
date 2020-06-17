import { fetch, post } from "../utils/http";
import { IData, ILegworkService, IPage, ILegworkOrder, IDataOne, IPrePay } from "./model";


export const getServiceList = () => fetch<IData<ILegworkService>>('legwork');

export const createOrder = (param: any) => post<IDataOne<IPrePay>>('legwork/order/create', param);

export const payOrder = (id: number) => post<IDataOne<IPrePay>>('legwork/order/pay', {id});

export const commentOrder = (param: any) => post<IDataOne<boolean>>('legwork/order/comment', param);

export const cancelOrder = (id: number) => post<IDataOne<boolean>>('legwork/order/cancel', {id});

export const getOrderList = (param: any) => fetch<IPage<ILegworkOrder>>('legwork/order', param);

export const getTackingOrders = (param: any) => fetch<IPage<ILegworkOrder>>('legwork/runner', param);

export const runnerTacking = (id: number) => post<IDataOne<boolean>>('legwork/runner/taking', {id});

export const getRunnerOrders = (param: any) => fetch<IPage<ILegworkOrder>>('legwork/runner/order', param);

export const runnerTaken = (id: number) => fetch<IPage<ILegworkOrder>>('legwork/runner/taken', {id});