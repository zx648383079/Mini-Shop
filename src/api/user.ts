import {fetch, post, deleteRequest, put, uploadFile} from '../utils/http';
import {IUser, ILogin, IPage, ICollect, IDataOne, IRegister} from './model';

export const getProfile = () => fetch<IUser>('auth/user');

export const getCollect = (params: any) => fetch<IPage<ICollect>>('shop/collect', params);

export const toggleCollect = (id: number) => post<IDataOne<boolean>>('shop/collect/toggle', {id});

export const removeCollect = (id: number) => deleteRequest<IDataOne<boolean>>('shop/collect/delete?id=' + id);

export const login = (param: ILogin) => post<IUser>('auth/login', param);

export const authLogin = (param: any) => post<IUser>('auth/oauth/mini', param);

export const logout = () => fetch('auth/logout');

export const register = (param: IRegister) => post<IUser>('auth/register', param);

export const sendFindEmail = (email: string) => post<IDataOne<boolean>>('auth/password/send_find_email', {
    email
});

export const sendMobileCode = (mobile: string, type: string = 'login') => post<IDataOne<boolean>>('auth/password/send_mobile_code', {
    mobile,
    type
});

export const resetPassword = (email: string, code: string,  password: string, confirm_password: string) => post<IDataOne<boolean>>('auth/password/reset', {
    email,
    code,
    password,
    confirm_password
});

export const updatePassword = (old_password: string, password: string, confirm_password: string) => post<IDataOne<boolean>>('auth/password/update', {
    old_password,
    password,
    confirm_password
});

export const updateProfile = (param: any) => put<IUser>('auth/user/update', param);


export const uploadAvatar = (img: string) => uploadFile<IUser>(img, {url: 'auth/user/avatar'});
