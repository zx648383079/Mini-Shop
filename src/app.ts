import {
    TOKEN_KEY
} from "./utils/types";
import {
    ISubtotal, ICategory, ICart, IAddress, IOrder, IUser, ILogin
} from "./api/model";
import { getSubtotal } from "./api/product";
import { getProfile, login, logout } from "./api/user";
import { getCategories } from "./api/category";
import { getAddressList } from "./api/address";
import { getOrderInfo } from "./api/order";

//app.ts
export interface IMyApp {
    userInfoReadyCallback ? (res: wx.UserInfo) : void
    globalData: {
        userInfo ? : wx.UserInfo,
        token: string | null,
        subtotal: ISubtotal | null,
        categories: ICategory[],
        cart: ICart[];
        addressList: IAddress[];
        address: IAddress | null;
        order: IOrder | null;
        user: IUser | null,
    },
    getSubtotal(): Promise<ISubtotal>,
    getUser(): Promise<IUser>,
    setToken(token?: string): void,
    loginUser(params: ILogin): Promise<IUser| void>,
    logoutUser(): Promise<void>;
    setCart(cart: ICart[]): void,
    getCategories(): Promise<ICategory[]>,
    getAddressList(): Promise<IAddress[]>,
    setAddressList(data: IAddress[]): void,
    getAddress(): Promise<IAddress>,
    setAddress(address: IAddress): void,
    setAddressIfEmpty(address: IAddress): void,
    setOrder(order: IOrder): void,
    getOrder(id: number): Promise<IOrder>,
}

App<IMyApp>({
    onLaunch() {
        // 展示本地存储能力
        this.globalData.token = wx.getStorageSync(TOKEN_KEY);
        // 登录
        wx.login({
            success(_res) {
                // console.log(_res.code)
                // 发送 _res.code 到后台换取 openId, sessionKey, unionId
            }
        })
        // 获取用户信息
        wx.getSetting({
            success: (res) => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo
                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res.userInfo)
                            }
                        }
                    })
                }
            }
        })
    },
    getSubtotal() {
        return new Promise((resolve, reject) => {
            if (this.globalData.subtotal) {
                resolve(this.globalData.subtotal);
                return;
            }
            getSubtotal().then(res => {
                this.globalData.subtotal = res;
                resolve(res);
            }).catch(reject);
        });
    },
    getUser() {
        return new Promise((resolve, reject) => {
            if (this.globalData.user) {
                resolve(this.globalData.user);
                return;
            }
            const token = wx.getStorageSync<string>(TOKEN_KEY);
            if (!token) {
                resolve();
                return;
            }
            getProfile().then((res: IUser) => {
                this.globalData.user = res;
                resolve(res);
            }).catch(reject);
        });
    },
    setToken(token?: string) {
        this.globalData.token = token ? token : null;
        if (!token) {
            wx.removeStorageSync(TOKEN_KEY);
            this.globalData.user = null;
            return;
        }
        wx.setStorageSync(TOKEN_KEY, token);
    },
    loginUser(params: ILogin) {
        return login(params).then((res: IUser) => {
            this.setToken(res.token);
            this.globalData.user = res;
        });
    },
    logoutUser() {
        return new Promise((resolve, reject) => {
            const token = wx.getStorageSync<string>(TOKEN_KEY);
            if (!token) {
                resolve();
                return;
            }
            logout().then(() => {
                this.setToken();
                resolve();
            }).catch(reject);
        });
    },
    setCart(cart: ICart[]) {
        this.globalData.cart = cart;
    },
    getCategories() {
        return new Promise((resolve, reject) => {
            if (this.globalData.categories && this.globalData.categories.length > 0) {
                resolve(this.globalData.categories);
                return;
            }
            getCategories().then(res => {
                this.globalData.categories = res.data ? res.data : [];
                resolve(res.data);
            }).catch(reject);
        });
    },
    getAddressList() {
        return new Promise((resolve, reject) => {
            if (this.globalData.addressList && this.globalData.addressList.length > 0) {
                resolve(this.globalData.addressList);
                return;
            }
            getAddressList().then(res => {
                this.globalData.addressList = res.data || [];
                resolve(res.data);
            }).catch(reject);
        });
    },
    setAddressList(data: IAddress[]) {
        this.globalData.addressList = data;
    },
    getAddress() {
        return new Promise((resolve, reject) => {
            if (this.globalData.address) {
                resolve(this.globalData.address);
                return;
            }
            this.getAddressList().then(res => {
                for (const item of res) {
                    if (item.is_default) {
                        this.setAddress(item);
                        resolve(item);
                        return;
                    }
                }
                resolve();
            }).catch(reject);
        });
    },
    setAddress(address: IAddress) {
        this.globalData.address = address;
    },
    setAddressIfEmpty(address: IAddress) {
        if (this.globalData.address) {
            return;
        }
        this.globalData.address = address;
    },
    setOrder(order: IOrder) {
        this.globalData.order = order;
    },
    getOrder(id: number) {
        return new Promise((resolve, reject) => {
            if (this.globalData.order && this.globalData.order.id === id) {
                resolve(this.globalData.order);
                return;
            }
            getOrderInfo(id).then(res => {
                this.setOrder(res);
                resolve(res);
                return;
            }).catch(reject);
        });
    },
    globalData: {
        token: null,
        subtotal: null,
        categories: [],
        cart: [],
        addressList: [],
        address: null,
        order: null,
        user: null,
    }
})