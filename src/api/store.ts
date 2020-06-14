import { fetch } from "../utils/http";
import { IStore } from "./model";

export const getStore = (id: number) => fetch<IStore>('shop/store', {
    id,
});
