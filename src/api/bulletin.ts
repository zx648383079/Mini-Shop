import { IPage, IBulletinUser, IDataOne } from './model';
import { fetch, put, deleteRequest } from '../utils/http';

export const getBulletinList = (param: any) => fetch<IPage<IBulletinUser>>('auth/bulletin', param)


export const getBulletin = (id: number) => fetch<IBulletinUser>('auth/bulletin/info', {id});

export const readBulletin = (id: number) => put<IDataOne<boolean>>('auth/bulletin/read', {id});

export const readAllBulletin = () => put<IDataOne<boolean>>('auth/bulletin/read_all', {});

export const deleteBulletin = (id: number) => deleteRequest<IDataOne<boolean>>('auth/bulletin/delete?id=' + id);
