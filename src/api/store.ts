import { fetch, post } from "../utils/http";
import { IStore, IDataOne } from "./model";

export const getStore = (id: number) => fetch<IStore>('shop/store', {
    id,
});


export const toggleCollect = (id: number) => post<IDataOne<boolean>>('shop/store/toggle_collect', {id});