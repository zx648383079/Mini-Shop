import {
    TOKEN_KEY
} from "./utils/types";
import {
    ISubtotal, ICategory, ICart, IAddress, IOrder, IUser, ILogin
} from "./api/model";
import { getSubtotal } from "./api/product";
import { getProfile, login, logout, authLogin } from "./api/user";
import { getCategories } from "./api/category";
import { getAddressList } from "./api/address";
import { getOrderInfo } from "./api/order";
import { WxPage } from "typings/wx/lib.wx.page";

//app.ts
export interface IMyApp {
    globalData: {
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
    getUser(): Promise<IUser|null>,
    setToken(token?: string): void,
    loginUser(params: ILogin): Promise<IUser| void>,
    authloginUser(params: any): Promise<IUser| void>;
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
    setWatcher(page: WxPage<any>): void,
    observe(obj: any, key: string, watchFun: (this: WxPage<any>, newVal: any, oldVal: any) => void, deep: boolean, page: WxPage<any>): void,
}

App<IMyApp>({
    onLaunch() {
        // 展示本地存储能力
        this.globalData.token = wx.getStorageSync(TOKEN_KEY);
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
                resolve(null);
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
    authloginUser(params: any) {
        return authLogin(params).then((res: IUser) => {
            this.setToken(res.token);
            return this.globalData.user = res;
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
                resolve(this.globalData.categories);
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
    /**
     * 设置监听器
     */
    setWatcher(page: any) {
        let data = page.data;
        let watch = page.watch;
        Object.keys(watch).forEach(v => {
            let key = v.split('.'); // 将watch中的属性以'.'切分成数组
            let nowData = data; // 将data赋值给nowData
            for (let i = 0; i < key.length - 1; i++) { // 遍历key数组的元素，除了最后一个！
                nowData = nowData[key[i]]; // 将nowData指向它的key属性对象
            }
            let lastKey = key[key.length - 1];
            // 假设key==='my.name',此时nowData===data['my']===data.my,lastKey==='name'
            let watchFun = watch[v].handler || watch[v]; // 兼容带handler和不带handler的两种写法
            let deep = watch[v].deep; // 若未设置deep,则为undefine
            this.observe(nowData, lastKey, watchFun, deep, page); // 监听nowData对象的lastKey
        })
    },
    /**
     * 监听属性 并执行监听函数
     */
    observe(obj: any, key: string, watchFun: (newVal: any, oldVal: any) => void, deep: boolean, page: WxPage<any>) {
        let val = obj[key];
        // 判断deep是true 且 val不能为空 且 typeof val==='object'（数组内数值变化也需要深度监听）
        if (deep && val != null && typeof val === 'object') { 
            Object.keys(val).forEach(childKey=>{ // 遍历val对象下的每一个key
                this.observe(val,childKey,watchFun,deep,page); // 递归调用监听函数
            })
        }
        let that = this;
        Object.defineProperty(obj, key, {
            configurable: true,
            enumerable: true,
            set: function(value) {
                // 用page对象调用,改变函数内this指向,以便this.data访问data内的属性值
                watchFun.call(page,value,val); // value是新值，val是旧值
                val = value;
                if(deep){ // 若是深度监听,重新监听该对象，以便监听其属性。
                    that.observe(obj, key, watchFun, deep, page); 
                }
            },
            get: function() {
                return val;
            }     
        })
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