import { IPage, IComment, ICommentSubtotal } from './model';
import { fetch } from '../utils/http';

export const getCommentList = (param: any) => fetch<IPage<IComment>>('shop/comment', param);

export const getCommentSubtotal =
    (item_id: number, item_type?: number) => fetch<ICommentSubtotal>('shop/comment/count', {item_id, item_type});
