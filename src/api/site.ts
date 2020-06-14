import { ISite } from "./model";
import { fetch } from "../utils/http";


export const getSiteInfo = () => fetch<ISite>('shop/home/index');