<script lang="ts">
import {
    TOKEN_KEY
} from "./utils/types";
import {
    ICategory, IAddress, IOrder, IUser, ILogin, IDataOne, IRegister, ICartGroup, ISite
} from "./api/model";
import { getProfile, login, logout, authLogin, sendFindEmail, register } from "./api/user";
import { getCategories } from "./api/category";
import { getAddressList } from "./api/address";
import { getOrderInfo } from "./api/order";
import { getSiteInfo } from './api/site';
import { WxPage, WxApp, WxAppJson } from "typings/wx/lib.vue";

interface IAppData {
    token: string | null,
    site: ISite | null,
    categories: ICategory[],
    cart: ICartGroup[];
    addressList: IAddress[];
    address: IAddress | null;
    order: IOrder | null;
    user: IUser | null,
}

export interface IMyApp {
    globalData: IAppData,
    getSite(): Promise<ISite>,
    getUser(): Promise<IUser|null>,
    setUser(user: IUser|null): void,
    setToken(token?: string): void,
    loginUser(params: ILogin): Promise<IUser| void>,
    authloginUser(params: any): Promise<IUser| void>;
    logoutUser(): Promise<void>;
    sendFindEmail(email: string): Promise<IDataOne<boolean>>;
    registerUser(params: IRegister): Promise<IUser| void>;
    setCart(cart: ICartGroup[]): void,
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

@WxAppJson({
    pages: [
        "pages/index/index",
        "pages/account/center",
        "pages/account/bind",
        "pages/account/cancel",
        "pages/account/connect",
        "pages/account/driver",
        "pages/address/index",
        "pages/address/edit",
        "pages/article/index",
        "pages/article/detail",
        "pages/article/category",
        "pages/comment/index",
        "pages/comment/create",
        'pages/collect/index',
        "pages/goods/index",
        "pages/goods/history",
        "pages/goods/comment",
        "pages/cart/index",
        "pages/cashier/index",
        "pages/cashier/pay",
        "pages/checkin/index",
        "pages/search/index",
        "pages/search/result",
        "pages/category/index",
        'pages/feedback/index',
        "pages/message/index",
        "pages/message/detail",
        "pages/member/index",
        "pages/member/profile",
        "pages/member/login",
        "pages/member/password",
        "pages/order/index",
        "pages/order/detail",
        "pages/order/logistics",
        "pages/store/index",
        "pages/store/quick",
        "pages/legwork/index",
        "pages/legwork/order",
        "pages/legwork/room",
        "pages/legwork/runner",
    ],
    window: {
        backgroundTextStyle: 'light',
        backgroundColor: '#f4f4f4',
        navigationBarBackgroundColor: '#05a6b1',
        navigationBarTitleText: 'ZoDream Shop',
        navigationBarTextStyle: 'white'
    },
    tabBar: {
        backgroundColor: '#fff',
        borderStyle: 'black',
        selectedColor: '#b4282d',
        color: '#666',
        list: [
            {
                pagePath: "pages/index/index",
                iconPath: "images/icon/home.png",
                selectedIconPath: "images/icon/home_red.png",
                text: "首页"
            },
            {
                pagePath: "pages/category/index",
                iconPath: "images/icon/th.png",
                selectedIconPath: "images/icon/th_red.png",
                text: "分类"
            },
            {
                pagePath: "pages/cart/index",
                iconPath: "images/icon/cart.png",
                selectedIconPath: "images/icon/cart_red.png",
                text: "购物车"
            },
            {
                pagePath: "pages/member/index",
                iconPath: "images/icon/user.png",
                selectedIconPath: "images/icon/user_red.png",
                text: "我的"
            }
        ]
    },
    useExtendedLib: {
        weui: true
    }
})
export class Application extends WxApp<IAppData> implements IMyApp {

    public globalData: IAppData = {
        token: null,
        site: null,
        categories: [],
        cart: [],
        addressList: [],
        address: null,
        order: null,
        user: null,
    }

    public onLaunch() {
        // 展示本地存储能力
        this.globalData.token = wx.getStorageSync(TOKEN_KEY);
    }

    public getSite(): Promise<ISite> {
        return new Promise((resolve, reject) => {
            if (this.globalData.site) {
                resolve(this.globalData.site);
                return;
            }
            getSiteInfo().then(res => {
                this.globalData.site = res;
                resolve(res);
            }).catch(reject);
        });
    }

    public getUser() {
        return new Promise<IUser|null>((resolve, reject) => {
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
    }

    public setUser(user: IUser| null) {
        if (user && user.token && user.token.length > 0 && user.id && user.id > 0) {
            this.setToken(user.token);
        }
        this.globalData.user = user;
    }

    public setToken(token?: string) {
        this.globalData.token = token && token.length > 0 ? token : null;
        if (!this.globalData.token) {
            wx.removeStorageSync(TOKEN_KEY);
            this.globalData.user = null;
            return;
        }
        wx.setStorageSync(TOKEN_KEY, token);
    }
    
    public loginUser(params: ILogin) {
        return login(params).then((res: IUser) => {
            this.setToken(res.token);
            this.globalData.user = res;
        });
    }
    
    public authloginUser(params: any) {
        return authLogin(params).then((res: IUser) => {
            this.setToken(res.token);
            return this.globalData.user = res;
        });
    }

    public registerUser(params: IRegister) {
        return register(params).then((res: IUser) => {
            this.setUser(res);
            return res;
        });
    }

    public sendFindEmail(email: string) {
        return sendFindEmail(email);
    }
    
    public logoutUser(): Promise<void> {
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
    }
    
    public setCart(cart: ICartGroup[]) {
        this.globalData.cart = cart;
    }
    
    public getCategories(): Promise<ICategory[]> {
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
    }
    
    public getAddressList(): Promise<IAddress[]> {
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
    }
    
    public setAddressList(data: IAddress[]) {
        this.globalData.addressList = data;
    }
    
    public getAddress(): Promise<IAddress> {
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
    }
    
    public setAddress(address: IAddress) {
        this.globalData.address = address;
    }
    
    public setAddressIfEmpty(address: IAddress) {
        if (this.globalData.address) {
            return;
        }
        this.globalData.address = address;
    }
    
    public setOrder(order: IOrder) {
        this.globalData.order = order;
    }
    
    public getOrder(id: number): Promise<IOrder> {
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
    }
    /**
     * 设置监听器
     */
    public setWatcher(page: any) {
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
    }
    /**
     * 监听属性 并执行监听函数
     */
    public observe(obj: any, key: string, watchFun: (newVal: any, oldVal: any) => void, deep: boolean, page: WxPage<any>) {
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
    }
}
</script>
<style lang="scss">
$debc: #e4e4e4;
$title: 16px;
$subtitle: 13px;
$smsub: 12px;
$margin: 10px;
$gray: #81838e;
$border: #e1e1e1;
$padding: 10px;
$fontfamily: 'Microsoft Yahei';
$headerBg: #05a6b1;
$white: #fff;
$hr: 1px solid #ccc;
$bg: #f4f4f4;
$red: #d22222;
$lineHeight: 2.5rem;

@import 'icon';

@mixin lineItem() {
    .line-item {
        position: relative;
        line-height: 1.875rem;

        .fa {
            position: absolute;
            right: 0.3125rem;
            top: 0;
        }

        text {
            &:nth-child(2) {
                float: right;
                margin-right: 1.25rem;
            }
        }
    }
}

@mixin menuA() {
    display: block;
    padding: 0.625rem;
    background: $white;
    margin-top: 0.125rem;

    .fa:nth-child(2),
    .fa-chevron-right {
        float: right;
        margin-right: 0.625rem;
        line-height: 20px;
        margin-top: 3px;
    }
}

//flex box
@mixin flexbox($jc:space-between, $ai:center, $fd:row, $fw:nowrap) {
    display: flex;
    flex: 1;
    justify-content: $jc;
    align-items: $ai;
    flex-direction: $fd;
    flex-wrap: $fw;
}

// width height
@mixin wh($w:100%, $h:100%) {
    width: $w;
    height: $h;
}

@mixin radius($radius:50%) {
    border-radius: $radius;
    border: 1px solid #eee;
}

// 背景图片地址和大小
@mixin bg($url) {
    background-image: url($url);
    background-repeat: no-repeat;
    background-size: 100% 100%;
}

@mixin prefix-animation($animation-name) {
    animation: $animation-name;
}

@mixin prefix-keyframes($animation-name) {
    @keyframes #{$animation-name} {
        @content;
    }
}

@mixin prefix-content($content-name, $content-txt) {
    #{$content-name}: $content-txt;
}

.dialog-bg {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 910;
}

.dialog {
    position: fixed;
    z-index: 920;

    &.dialog-content,
    &.dialog-box {
        background: #fff;
        min-width: 260px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
        @include prefix-animation(dialog-box 0.5s);

        .dialog-header {
            position: relative;
            background: #333;
            color: #fff;
            height: 40px;
            line-height: 30px;
            text-align: center;
            padding: 5px 10px;
            border-bottom: 1px solid #ccc;

            .dialog-title {
                cursor: move;
            }

            .fa {
                width: 30px;
                height: 30px;
                border: none;
                position: absolute;
                top: 0;
                color: #fff;
                line-height: 30px;
            }

            .fa-arrow-left {
                left: 0;
                background: #333;
                color: #fff;
                top: 5px;
            }

            .dialog-close {
                right: 0;
                background: #333;
                color: #fff;
                top: 6px;

                &:hover {
                    @include prefix-content(transform, rotateZ(180deg));
                }
            }
        }

        .dialog-body {
            min-height: 100px;
            overflow: auto;
            padding: 10px;
            box-sizing: border-box;
        }

        .dialog-footer {
            button {
                width: 50%;
                border: none;
                line-height: 30px;
                background: #333;
                color: #fff;
                padding: 0;
                margin: 0;

                &:focus {
                    outline: -webkit-focus-ring-color auto 0px;
                }
            }

            .dialog-yes {
                width: 30%;
                background: #333;
                color: #fff;
                padding: 3px;
                border: none;
                margin-right: 5px;
                line-height: 30px;
            }

            .dialog-close {
                width: 30%;
                background: #333;
                color: #fff;
                padding: 3px;
                border: none;
                line-height: 30px;
            }
        }
    }

    &.dialog-box,
    &.dialog-content {
        .dialog-header {
            .dialog-title {
                text-align: left;
            }
        }

        .dialog-footer {
            border-top: 1px solid #ccc;
            padding: 2px;
            text-align: right;
        }
    }

    &.dialog-content {
        top: 0;
        left: 0;
        right: 0;

        .dialog-footer {
            text-align: center
        }
    }

    &.dialog-closing {
        @include prefix-animation(dialog-closing .5s);
    }
}

@include prefix-keyframes(dialog-message) {
    0% {
        @include prefix-content(transform, scaleY(0.1));
    }

    45% {
        @include prefix-content(transform, scaleY(1.3));
    }

    80% {
        @include prefix-content(transform, scaleY(0.8));
    }

    100% {
        @include prefix-content(transform, scaleY(1));
    }
}

@include prefix-keyframes(dialog-box) {
    0% {
        @include prefix-content(transform, scale(0.7));
    }

    45% {
        @include prefix-content(transform, scale(1.05));
    }

    80% {
        @include prefix-content(transform, scale(0.95));
    }

    100% {
        @include prefix-content(transform, scale(1));
    }
}

@include prefix-keyframes(dialog-tip) {

    from,
    60%,
    75%,
    90%,
    to {
        animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
    }

    from {
        opacity: 0;
        @include prefix-content(transform, translate3d(0, 3000px, 0));
    }

    60% {
        opacity: 1;
        @include prefix-content(transform, translate3d(0, -20px, 0));
    }

    75% {
        @include prefix-content(transform, translate3d(0, 10px, 0));
    }

    90% {
        @include prefix-content(transform, translate3d(0, -5px, 0));
    }

    to {
        @include prefix-content(transform, translate3d(0, 0, 0));
    }
}

@include prefix-keyframes(dialog-closing) {
    0% {
        opacity: 1;
        @include prefix-content(transform, scale(1));
    }

    20% {
        @include prefix-content(transform, scale(1.2));
    }

    55% {
        @include prefix-content(transform, scale(0.8));
    }

    100% {
        opacity: 0;
        @include prefix-content(transform, scale(.2));
    }
}

.hide {
    display: none;
}

.btn {
    padding: 0 30px;
    // background: #ff77ff;
    border: none;
    display: inline-block;
    text-decoration: none;
    // line-height: 30px;
    margin: 0 8px;
    vertical-align: middle;
}

.form-inline {
    .input-group {
        display: block;
        border-bottom: 1px solid #777;
        min-height: $lineHeight;

        input[type="text"],
        input[type="email"],
        input[type="tel"],
        input[type="password"],
        input[type="url"],
        input[type="number"],
        select,
        textarea {
            border: none;
            background: transparent;
            height: $lineHeight;
            box-sizing: border-box;

            &.height-auto {
                height: auto;
            }
        }

    }

    .btn {
        line-height: $lineHeight;
        margin-top: 8px;
    }
}

.scroll-nav {
    position: relative;
    height: 45px;
    background-color: #05a6b1;
    color: #fff;
    z-index: 10;
    .nav-ul {
        padding-right: 35px;
        font-size: 0;
        font-family: none;
        white-space: nowrap;
        overflow: hidden;
        overflow-x: auto;
        background-color:  #05a6b1;
    }
    .nav-li {
        min-width: 3.75rem;
        padding: 0 5px;
        text-align: center;
        font-size: 13px;
        display: inline-block;
        vertical-align: top;
        text {
            display: inline-block;
            height: 45px;
            line-height: 45px;
            color: #fff;
        }
        &.active {
            text {
                color: #e4393c;
                border-bottom: 2px solid #e4393c;
            }
        }
    }
    .nav-arrow {
        position: absolute;
        top: 0;
        right: 0;
        width: 35px;
        height: 45px;
        line-height: 45px;
        text-align: center;
        background-color: #05a6b1;
        &::before {
            content: "\e649";
        }
    }
    &.unfold {
        .nav-ul {
            padding-right: 0;
            white-space: normal;
            padding-right: 30px;
        }
        .nav-arrow {
            &::before {
                content: "\e64c";
            }
        }
    }
}

header,
.header {
    width: 100%;
    height: 2.75rem;
    border-bottom: 0.0625rem solid #e1e1e1;

    .brand {
        width: 20%;
        font-size: 1.875rem;
        margin-left: 0.625rem;
        float: left;
    }

    .search-box {
        padding: 5px;
        line-height: 36px;
        display: grid;
        grid-template-columns: 1fr 54px;

        .form-box {
            position: relative;
        }

        .fa {
            position: absolute;
            top: 0px;
            z-index: 99;
            color: #666;

            &.fa-search {
                left: 5px;
            }

            &.fa-close {
                right: 5px;
            }
        }

        input {
            margin-top: 0.125rem;
            width: 100%;
            font-size: 20px;
            padding: 4px 29px;
            box-sizing: border-box;
            background-color: $bg;
            border: 0;
            height: 32px;
            color: #333;
            text-align: left;
        }

        .cancel-btn {
            color: $white;
        }

        .home-btn {
            font-size: 28px;

            .fa {
                position: static;
                color: $white;
            }
        }

        &.under-search {
            grid-template-columns: 54px 1fr;
        }
    }
}

.search-entry {
    background-color: #ededed;
    border-radius: 2px;
    font-size: 15px;
    color: #666;
    line-height: 36px;
    height: 35px;
    overflow: hidden;
    display: block;
    margin: 5px;
}

.top {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: $headerBg;
    color: $white;
    text-align: center;
    z-index: 99;
    border: 0;

    .back,
    .right,
    .right-text,
    .btn {
        top: 50%;
        margin-top: -1rem;
        font-size: 1.5625rem;
        color: $white;
    }

    .back {
        position: absolute;
        left: 0.625rem;

    }

    .btn {
        position: absolute;
        right: 0;
        margin: 0;
        line-height: 2.75rem;
        top: 0;
        padding: 0 0.3125rem;
    }

    .right,
    .right-text {
        position: absolute;
        right: 0.625rem;
    }

    .right-text {
        font-size: 1rem;
        line-height: 30px;
    }

    .title {
        line-height: 2.75rem;
    }

    .top-tab {
        navigator {
            color: #fff;
            line-height: 44px;
            padding: 0 0.3125rem;
            display: inline-block;
            height: 44px;

            &.active {
                border-bottom: 4px solid;
            }
        }
    }

    .logo {
        image {
            max-width: 100%;
            max-height: 44px;
            vertical-align: middle;
        }
    }

    &.top-search-box {
        display: grid;
        grid-template-columns: 110px 1fr 54px;
        padding: 5px 0;

        .logo {
            image {
                max-height: 33px;
            }
        }

        .search-entry {
            margin: 0;
        }

        navigator {
            line-height: 36px;
            color: $white;
        }
    }

    &.main-header-box {
        display: grid;
        grid-template-columns: 54px 1fr 54px 54px;

        .home-btn,
        .search-btn,
        .top-cart {
            font-size: 28px;
            line-height: 44px;
        }

        .top-cart {
            position: relative;

            .tip {
                display: block;
                position: absolute;
                right: 0;
                top: 0;
                width: 1rem;
                height: 1rem;
                color: $white;
                background: #e1454b;
                font-size: 0.625rem;
                line-height: 1rem;
                border-radius: 50%;
                font-style: normal;
            }
        }
    }

    &.fixed {
        position: absolute;
    }
}

.checkout-footer,
.cart-footer,
.fixed-footer,
footer,
.footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 99;
}

footer,
.footer {
    height: 3rem;
    background: $white;
    border: 0.0625rem solid #e1e1e1;

    navigator,
    .item {
        width: 25%;
        text-align: center;
        display: block;
        float: left;
        padding-top: 0.25rem;
        box-sizing: border-box;
        position: relative;
        font-size: .9rem;
        text-decoration: none;

        .tip {
            display: block;
            position: absolute;
            right: 1.875rem;
            top: 0;
            width: 1rem;
            height: 1rem;
            color: $white;
            background: #e1454b;
            font-size: 0.625rem;
        }

        &.active {
            color: #4693d0;
        }

        .fa {
            font-size: 1.5rem;
            display: block;
        }
    }

    &.comment {
        background: rgba(23, 12, 23, .7);

        navigator {
            width: 100%;
            text-align: center;
        }
    }

    &.goods-navbar {
        .btn {
            width: 29%;
            padding: 0;
            text-align: center;
            line-height: 3.125rem;
            margin: 0;
            &.btn-orange {
                background: #ff9600;
            }
        }
        navigator {
            width: 14%;
            margin: 0;
        }
    }
}

.tab-bar {
    display: flex;
    justify-content: space-around;
    flex-flow: row nowrap;
    position: fixed;
    z-index: 5;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 3rem;
    background: $white;
    border-top: $hr;

    navigator {
        position: relative;
        text-align: center;
        color: #666;

        text {
            display: block;
            margin-top: .09333rem;
            font-size: .32rem;
            color: #666;
            line-height: 1;
        }

        .fa {
            font-size: 1.5rem;
            display: block;
        }

        .tip {
            position: absolute;
            top: 0;
            right: -0.75rem;
            background: #f00;
            color: $white;
            border-radius: 50%;
            text-align: center;
            line-height: 1.1875rem;
            font-size: 0.75rem;
            width: 1.25rem;
            height: 1.25rem;
            font-style: normal;
        }

        &.active {

            text,
            .fa {
                color: #b4282d;
            }
        }
    }

    &.order-header {
        line-height: 3rem;
        height: 3rem;
        position: static;
        background: $headerBg;
        border: none;

        navigator {
            color: $white;

            &.active {
                border-bottom: 5px solid #b4282d;
            }
        }
    }
}

.has-header {
    margin-top: 2.75rem;
}

.has-footer {
    margin-bottom: 3.125rem;
}

.goods-list {
    position: relative;
    width: 100%;
    max-width: 100%;
    margin-top: 0.9375rem;
    text-align: center;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: .5rem;

    .item-view {
        position: relative;
        display: block;
        box-sizing: border-box;
        background-color: $white;

        .item-img {
            image {
                width: 100%;

            }
        }

        .item-title {
            display: block;
            width: 100%;
            height: 1.5rem;
            text-align: center;
            color: #404245;
            font-size: 0.8125rem;
            font-weight: normal;
            line-height: 2rem;
            overflow: hidden;
        }

        .item-actions {
            .item-price {
                color: #e1454b;
            }

            .item-btn {}
        }
    }
}


.home-panel {
    margin-top: 20px;

    .panel-header {
        border-bottom: $hr;
        border-top: $hr;
        line-height: 40px;
        text-align: center;
        background-color: $white;
    }

    .goods-list {
        margin-top: 0;
    }
}

.slide-box {
    .goods-list {
        text-align: left;

        .goods-item {
            background-color: $white;
            padding: 5px;

            .goods-img {
                display: inline-block;

                image {
                    width: 70px;
                    height: 70px;
                }
            }

            .goods-info {
                display: inline-block;
                height: 5rem;
                vertical-align: top;
                overflow: hidden;
            }
        }
    }
}

.search-tip-box {
    display: block;
    padding-left: 10px;
    background-color: $white;

    view {
        height: 30px;
        line-height: 30px;

        &:not(:last-of-type) {
            border-bottom: $hr;
        }
    }
}

.search-recommend-box {
    .panel {
        padding: 0 10px 10px;
        background-color: $white;
        margin-bottom: 5px;

        .panel-header {
            height: 30px;
            line-height: 30px;

            .fa {
                float: right;
                margin-top: 8px;
            }
        }

        .panel-body {
            text {
                border: $hr;
                border-radius: 2px;
                color: #333;
                padding: 0 2px;
                line-height: 16px;
            }
        }
    }
}

.menu-box {
    position: relative;
    display: block;
    width: 100%;
    background-color: $white;
    overflow: hidden;
    border-bottom: #e2e2e2 0.0625rem solid;

    .menu-item {
        position: relative;
        float: left;
        display: block;
        width: 20%;
        border: none;
        box-sizing: border-box;
        padding: 0.75rem 0;
        text-decoration: none;

        .menu-icon {
            display: block;
            width: 2.75rem;
            height: 2.75rem;
            margin: 0 auto;
            overflow: hidden;
        }

        .menu-name {
            display: block;
            width: 100%;
            height: 1.5rem;
            line-height: 1.5rem;
            box-sizing: border-box;
            border: none;
            overflow: hidden;
            color: #404245;
            font-size: 0.875rem;
            font-weight: normal;
            text-align: center;
            margin-top: 0.25rem;
        }
    }
}

.category-page {
    padding-left: 90px;
    .category-menu {
        padding-top: 44px;
        box-sizing:border-box;
        position: absolute;
        width: 90px;
        z-index: 3;
        left: 0;
        height: 100%;
        top: 0;
        display: block;
        box-sizing: border-box;
        border-right: #e2e2e2 0.0625rem solid;
        .menu-item {
            display: block;
            width: 100%;
            height: 3.75rem;
            color: #404245;
            font-size: 1rem;
            font-weight: normal;
            line-height: 3.75rem;
            text-align: center;
            box-sizing: border-box;
            border-bottom: #e2e2e2 0.0625rem solid;

            &.active {
                border-left: #55595f 0.25rem solid;
                background-color: $white;
            }
        }
    }

    .category-main {
        position: absolute;
        top: 0;
        height: 100%;
        right: 0;
        left: 0;
        padding-top: 44px;
        box-sizing:border-box;
        padding-left: 90px;
        >.item {
            display: none;

            &.active {
                display: block;
            }
        }
    }

    .goods-list {
        margin-top: 0;
    }

    .header {
        line-height: 40px;
        background-color: $white;
        padding-left: 10px;
    }

    .banner {
        image {
            width: 100%;
        }
    }
}

.tree-grid {
    .tree-item {
        list-style: none;

        navigator {
            line-height: 40px;
            background-color: $white;
            padding-left: 10px;
            display: block;
            border-top: $hr;
        }
    }

    .tree-item-chidren {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;

        .tree-item {
            navigator {
                text-align: center;
            }
        }
    }
}



.check-box {
    font-size:1rem;
    &::before {
        content: "\e72f";
    }

    &.active {
        &::before {
            content: "\e731";
        }
    }
}

.toggle-box {
    &::before {
        content: "\f204";
    }

    &.active {
        &::before {
            content: "\f205";
        }
    }
}

.number-box {
    input {
        display: inline-block;
        width: 3.125rem;
        text-align: center;
        border: none;
    }
}

.cart-box {
    .cart-group-item {
        margin: 5px 0;
        background-color: #fff;

        .group-header {
            line-height: 30px;
            padding: 0 5px;
        }

        .goods-list {
            margin-top: 0;
        }
    }

    .goods-list {
        display: block;

        .goods-item {
            position: relative;
            background-color: $white;

            .check-box {
                font-size: 1rem;
                width: 2rem;
                text-align: center;
                position: relative;
                top: -2rem;
            }

            .number-box {
                position: absolute;
                right: 10px;
                bottom: 10px;
            }

            .goods-info {

                margin: 0;

                h4 {
                    overflow: hidden;
                    height: 2.7rem;
                }
            }
        }
    }

    .cart-item {
        margin-bottom: 10px;
    }
}

.cart-footer {
    background-color: $white;
    line-height: 2.5rem;
    padding-left: 5px;
    .check-box {
        font-size: 1rem;
        width: 3.125rem;
        text-align: center;
    }

    span {
        line-height: 1.875rem;
    }

    .cart-amount {
        float: right;

        .btn {
            margin-right: 0;
            background-color: #b4282d;
            color: $white;
            line-height: 2.5rem;
        }
    }
}

.empty-cart-box {
    text-align: center;
    padding-top: 30vh;
    line-height: 50px;

    p {
        font-size: 30px;
        color: #ccc;
    }

    .btn {
        background-color: transparent;
        border: 1px solid;
    }
}

.checkout-box,
.order-box {
    .address-box {
        padding: 0 2rem 0 3.75rem;
        position: relative;

        .fa {
            position: absolute;
            font-size: 2.5rem;
            top: 0;

            &.fa-map {
                left: 10px;
            }

            &.fa-chevron-right {
                right: 0.3125rem;
            }
        }

        .name {
            font-size: 1.875rem;
        }

        .tel {}

        .default {
            background: #f00;
            color: $white;
            padding: 0.125rem 0.4375rem;
        }

        &.empty-address {
            height: 3.875rem;

            h3 {
                line-height: 3.875rem;
            }
        }
    }

    .goods-list {
        .goods-item {
            .goods-info {
                display: inline-block;
                height: 5rem;
                vertical-align: top;
                overflow: hidden;

                .amount {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                }
            }
        }
    }
}

.checkout-box,
.order-box,
.comment-list-box,
.collect-page {
    .goods-list {
        text-align: left;
        display: block;
        margin-top: 0;

        .goods-item {
            position: relative;
            background-color: $white;
            display: grid;
            grid-template: 70px / 80px 1fr;
            padding: 5px;

            .goods-img {
                display: inline-block;

                image {
                    width: 70px;
                    height: 70px;
                }
            }

            .goods-info {
                display: inline-block;
                height: 70px;
                vertical-align: top;
                overflow: hidden;
                margin-bottom: 0;
                position: relative;
            }
        }
    }
}

.checkout-box {
    .money-header {
        padding: 20px;
        text-align: center;
        font-size: 40px;
        background: $headerBg;
        color: $white;

        em {
            font-style: normal;
            font-size: 20px;
        }
    }

    .address-box {
        border-bottom: 0.0625rem solid;
    }

    @include lineItem();

    .shipping-box,
    .payment-box {
        border-bottom: 0.0625rem solid;
        line-height: 2rem;

        .dialog-select-input {
            border: none;
            line-height: 2rem;
            height: 2rem;
        }
    }
}

.checkout-footer {
    text-align: right;
    border-top: 0.0625rem solid $red;
    background-color: $white;

    .btn {
        margin: 0 0 0 0.3125rem;
        line-height: 2.5rem;
        background-color: $red;
        color: $white;
    }
}

.goods-gallary-box {
    image {
        height: 22.5rem;
        max-width: 100%;
    }
}

.goods-info {
    margin-bottom: 20px;
    background-color: $white;

    .goods-header {
        position: relative;

        .goods-name {
            margin-right: 3.125rem;
            font-size: 16px;
            padding: 5px 0;
        }

        .goods-collect {
            position: absolute;
            top: 0;
            right: 0;
            width: 3.125rem;
            height: 3.125rem;
            text-align: center;

            .like-icon {
                display: block;
                font-style: normal;
                font-size: 26px;
                &::before {
                    content: "\e6b4";
                }
            }

            &.active {
                .like-icon {
                    color: $red;
                    &::before {
                        content: "\e6b3";
                    }
                }
            }
        }
    }

    .goods-price {
        color: #B4282D;
        font-weight: 700;
        font-size: 20px;
    }

    .promote-line {
        display: grid;
        grid-template-columns: 50px 1fr 35px;
        border-top: 1px solid #ddd;
        line-height: 40px;
    }
}

.comment-box {
    background-color: $white;
    border-bottom: $hr;

    .comment-header {
        position: relative;
        border-bottom: $hr;
        padding: 10px;
        font-size: 20px;

        .fa {
            position: absolute;
            right: 0;
            font-size: 28px;
        }
    }

    .comment-subtotal {
        line-height: 40px;
        padding-left: 10px;

        .score {
            display: inline-block;
        }
    }

    .comment-stats {
        padding: 10px;

        navigator {
            border-radius: 2px;
            background: #fdf0f0;
            margin: 0 10px 7px 0;
            padding: 0 5px;
            height: 25px;
            line-height: 25px;
            font-size: 10px;
            color: #666;
            display: inline-block;
        }
    }

    .comment-more {
        text-align: center;
        display: block;
    }

    .comment-item {
        .item-header {
            display: grid;
            grid-template-columns: 39px 1fr 110px;

            .avatar {
                image {
                    width: 39px;
                    height: 39px;
                }
            }
        }

        .score {
            margin-bottom: 10px;
        }

        .time {
            color: #666;

            .attr {
                display: inline-block;
            }
        }

        .content {
            line-height: 20px;
            font-size: 14px;
            color: #333;
            margin-bottom: 10px;
            word-break: break-word;
        }

        .image-box {
            margin: 10px 0;

            view {
                display: inline-block;
                margin-right: 10px;
                list-style-type: none;
                width: 80px;
                height: 80px;
                text-align: center;

                image {
                    margin: auto;
                    max-height: 100%;
                    max-width: 100%;
                }
            }
        }
    }
}

.recomment-box {
    background-color: $white;

    .recommend-header {
        line-height: 40px;
        padding-left: 10px;
    }

    .goods-list {
        grid-template-columns: 1fr 1fr 1fr;
        grid-gap: 5px;
        margin-top: 0;
    }
}

.tab-box {
    .tab-header {}

    .tab-body {
        .tab-item {
            display: none;

            &.active {
                display: block;
            }
        }
    }
}

.tab-box.goods-content {
    margin-top: 20px;

    .tab-header {
        background-color: $white;

        .tab-item {
            width: 33%;
            line-height: 40px;
            height: 40px;

            &.active {
                border: none;
            }
        }
    }

    image {
        max-width: 100%;
        display: block;
    }
}

.static-properties-box {
    display: table;
    width: 100%;

    dl {
        display: table-row;

        dt,
        dd {
            display: table-cell;
            line-height: 30px;
        }

        dt {
            font-size: 700;
        }
    }
}

.activity-box {
    display: grid;
    grid-template: 50px / 80px 1fr 120px;
    background-color: #ff553f;
    color: #fff;

    .price {
        font-size: 26px;
        text-align: center;
        padding-top: 7px;

        em {
            font-size: 12px;
            font-style: normal;
        }
    }

    .info {
        .old-price {
            color: #ccc;
            text-decoration: line-through solid #999;
        }

        .time-block {
            vertical-align: middle;
            line-height: 15px;
            font-size: 10px;
        }
    }

    .countdown {
        text-align: center;
        background-color: #f7f7f7;
        padding-top: 7px;

        .text {
            color: #333;
            font-size: 10px;
        }

        .time {
            color: #e93b3d;
            font-size: 12px;

            span {
                background-color: #fff;
                border: 1px solid #ccc;
            }
        }
    }
}

.cart-dialog {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 110;
    background-color: rgba(0, 0, 0, .7);

    .dialog-body {
        position: absolute;
        transform: translate3d(0, 0, 0);
        width: 100%;
        min-height: 375px;
        max-height: 475px;
        bottom: 0;
        background-color: $white;
        transition: transform .2s cubic-bezier(0, 0, .25, 1), -webkit-transform .2s cubic-bezier(0, 0, .25, 1);
    }

    .dialog-footer {
        position: absolute;
        bottom: 0;
        display: flex;
        background-color: $white;
        width: 100%;

        .dailog-yes {
            height: 50px;
            line-height: 50px;
            color: $white;
            font-size: 16px;
            text-align: center;
            background-color: #e4393c;
            display: block;
            width: 100%;
            flex: 1;
        }
    }

    .dialog-header {
        height: 70px;
        padding: 0 0 10px 110px;
        background-color: $white;
        position: relative;
        line-height: 46px;
        font-size: 16px;
        color: #333;

        image {
            position: absolute;
            left: 10px;
            top: -20px;
            border-radius: 2px;
            width: 90px;
            height: 90px;
        }

        .price {
            display: inline-block;
            height: 40px;
            line-height: 40px;
            color: #e4393c;
            font-size: 10px;
        }

        .selected-property,
        .stock {
            word-break: break-all;
            font-size: 12px;
            color: #333;
            line-height: 1.4em;
            padding-right: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .dialog-close {
            position: absolute;
            top: 0;
            right: 0;
            padding: 10px;
        }
    }

    .property-box {
        margin-bottom: 50px;
        overflow-y: auto;
        max-height: 60vh;

        .number-box {
            float: right;
        }

        .group {
            .group-header {
                font-size: 12px;
                color: #999;
                margin: 0 10px;
                height: 40px;
                line-height: 40px;
            }

            .group-body {
                overflow: hidden;
                margin-bottom: 3px;

                span {
                    display: inline-block;
                    padding: 0 10px;
                    min-width: 20px;
                    max-width: 270px;
                    overflow: hidden;
                    height: 30px;
                    line-height: 30px;
                    text-align: center;
                    margin-left: 10px;
                    margin-bottom: 10px;
                    border-radius: 4px;
                    color: #333;
                    background-color: #f7f7f7;
                    font-size: 14px;
                    cursor: pointer;

                    &.active {
                        background-color: #e4393c;
                        color: $white;
                    }

                    &.disable {
                        background-color: #bbb;
                        color: #fff;
                        cursor: not-allowed;
                    }
                }
            }
        }

        .count-box {
            padding: 0 10px;

            span {
                font-size: 12px;
                color: #999;
            }
        }
    }
}

.menu-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    background-color: $white;

    .item {
        border-right: 0.0625rem dotted #4693d0;
        text-align: center;
        box-sizing: border-box;
        line-height: $lineHeight;

        &:nth-child(5n) {
            border: 0;
        }
    }
}

.menu-large {
    display: grid;
    grid-template-columns: 1fr 1fr;

    .item {
        border-right: 0.0625rem dotted #4693d0;
        border-top: 0.0625rem dotted #4693d0;
        height: 4.375rem;
        text-align: center;
        position: relative;

        .fa {
            font-size: 3.125rem;
            margin-top: 0.625rem;
        }

        text {
            line-height: 44px;
            vertical-align: text-bottom;
            display: inline-block;
        }

        .tip {
            position: absolute;
            top: 0;
            left: 50%;
            background: #f00;
            color: $white;
            border-radius: 50%;
            text-align: center;
            line-height: 1.1875rem;
            font-size: 0.75rem;
            width: 1.25rem;
            height: 1.25rem;
            font-style: normal;
        }

        &:nth-child(even) {
            border-right: 0;
        }

        &:first-child,
        &:nth-child(2) {
            border-top: 0;
        }
    }
}

.menu-panel {
    .panel-header {
        @include menuA();
    }

    .panel-body {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;

        navigator {
            display: inline-block;
            border-right: 0.0625rem dotted #4693d0;
            text-align: center;

            .menu-item-icon {
                font-size: 3.125rem;
                display: block;
            }

            &:last-child {
                border-right: 0;
            }
        }
    }
}



.menu-list {
    background: $white;
    padding: 0 0.625rem;

    .item {
        @include menuA();
        margin-top: 0;
        padding: 0.625rem 0;

        &:not(:last-child),
        &.line {
            border-bottom: $hr;
        }
    }
}

.profile-box,
.account-box {
    margin-bottom: 2rem;
    background-color: $white;
    padding: 0 10px;
    @include lineItem();

    .avatar-item {
        line-height: 5rem;

        .fa {
            top: 0;
        }

        .avatar {
            width: 5rem;
            height: 5rem;
            border-radius: 50%;
            padding: 5px;
            box-sizing: border-box;
            image {
                width: 70px;
                height: 70px;
            }
        }
    }

    .line-item {
        border-top: $hr;
    }
}

.account-box {
    .line-item {
        line-height: 2rem;

        .fab {
            margin-right: 10px;
        }

        &:first-child {
            border-top: none;
        }
    }
}

.btn {
    &.del-btn {
        margin: 0.875rem;
        box-sizing: border-box;
        padding: 0.375rem;
        display: block;
        text-align: center;
        background-color: $red;
        color: $white;
    }
}

.slide-box {
    .btn {
        display: block;
        padding: 0;
        margin: 0;
        background-color: transparent;
    }
}

.share-box {
    text-align: center;
}

.form-inline {
    .input-group {
        input {
            width: 100%;
        }

        span {
            line-height: 1.875rem;
        }

        textarea {
            width: 100%;
            height: 5rem;
        }
    }

    .input-radio {
        line-height: 1.875rem;
        position: relative;

        .fa {
            position: absolute;
            right: 0.625rem;
            font-size: 1.5625rem;
            top: 0.125rem;
        }
        .switch {
            float: right;
        }
    }
}

.fixed-footer {
    .btn {
        width: 100%;
        margin: 0;
        line-height: 40px;
        background: $red;
        color: $white;
    }
}

.address-list {
    .address-item {
        position: relative;

        .address-first {
            position: absolute;
            top: 0.9375rem;
            left: 0.3125rem;
            width: 3.125rem;
            height: 3.125rem;
            line-height: 3.125rem;
            border-radius: 50%;
            background: #333;
            color: $white;
            text-align: center;

            image {
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }

        .address-info {
            margin-left: 3.75rem;

            h3 {
                line-height: 40px;
            }

            .name {
                font-size: 1.875rem;
            }

            .tel {}

            .default {
                background: #f00;
                color: $white;
                padding: 0.125rem 0.4375rem;
            }
        }

        &.selected {
            .address-first {
                background-color: transparent;
                color: #f00;

                &::before {
                    font-family: "Font Awesome 5 Free";
                    font-style: normal;
                    font-size: 26px;
                    font-weight: 900;
                    content: "\f058";
                }

                span {
                    display: none;
                }
            }
        }
    }
}

.order-box {
    .order-item {
        background-color: $white;

        .order-header {
            line-height: 30px;

            .status {
                float: right;
            }
        }

        .order-amount {
            text-align: right;
        }

        .goods-list {
            .goods-item {
                background-color: $bg;
            }

            .goods-info {
                background-color: $bg;
                margin: 0;
            }
        }
    }

    .goods-list {
        margin-top: 0;

        .goods-item {
            padding: 5px;

            &:not(:last-of-type) {
                padding-bottom: 0px;
            }
        }

        .goods-info {
            margin: 0;
        }
    }

    .order-footer {
        text-align: right;

        .order-actions {
            line-height: 30px;

            navigator,
            text {
                padding: 0 5px;
            }
        }
    }

    @include lineItem();

    .line-item {
        span:nth-child(2) {
            margin-right: 0;
        }
    }

    .text-right {
        text-align: right;
    }

    .status-header {
        padding: 10px 20px 30px;
        background-color: $headerBg;
        color: $white;
        text-align: center;
        font-size: 30px;
        .fa {
            font-size: 30px;
        }
    }
}

.login-type-box,
.login-box,
.register-box {
    text-align: center;
    padding: 10px;

    .logo {
        padding: 30px 0;
    }

    .btn,
    button {
        display: block;
        margin: 0 0 10px;
        line-height: 40px;
        height: 40px;
        color: $white;
        border: 1px solid #b4282d;
        background-color: #b4282d;

        &.btn-none {
            background-color: $white;
            color: #b4282d;
        }
    }

    button {
        width: 100%;
    }

    .login-oauth-box {
        position: absolute;
        left: 0;
        width: 100%;
        bottom: 40px;
        text-align: center;
        font-size: 20px;

        navigator {
            display: inline-block;
            padding: 0 10px;

            &:not(:last-child) {
                border-right: $hr;
            }
        }
    }

    .input-group {
        text-align: left;
    }

    .unlogin {
        line-height: 40px;
        text-align: left;
    }

    .input-group {
        .checkbox {
            label::before {
                top: 3px;
            }
        }
    }
}

.input-box,
.code-input {
    border-bottom: $hr;
    input {
        height: 40px;
        border: 0;
        background: transparent;
        width: 100%;
        outline: none;
        text-align: left;
    }
}

.code-input {
    display: grid;
    grid-template-columns: 1fr 80px;

    navigator,
    text {
        border: 1px solid;
        font-size: 12px;
        line-height: 40px;
    }
}

.register-box {
    button {
        margin-top: 10px;
    }
}

.more-load {
    text-align: center;
    line-height: 30px;
    color: #767676;
}

.coupon-item {
    display: grid;
    grid-template-columns: 75px 1fr 75px;
    height: 114px;
    background-color: $white;
    margin-bottom: 10px;

    .thumb {
        padding-top: 20px;

        image {
            width: 75px;
            height: 75px;
        }
    }

    .info {
        position: relative;
        padding-top: 10px;

        .discount {
            position: absolute;
            left: 0;
            bottom: 7px;

            dd {
                font-size: 18px;
                color: #7eacf4;
                margin-bottom: -5px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            dt {
                font-size: 12px;
                color: #7eacf4;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

        .price {
            color: #7eacf4;
            font-size: 14px;
            position: absolute;
            left: 0;
            bottom: 0;
            font-family: font_helvetica;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            em {
                display: inline-block;
                vertical-align: -2px;
                margin-right: 6px;
                font-size: 30px;
                font-style: normal;
            }
        }
    }

    .action {
        background-color: #7eacf4;
        text-align: center;

        i {
            color: $white;
            font-size: 12px;
            font-style: normal;
        }

        .status-icon {
            margin: 20px 14px 0;
            padding: 9px 0;
            display: block;
            font-size: 12px;
            box-sizing: border-box;
            border: 2px solid $white;
            color: $white;
            border-radius: 50%;
            width: 50px;
            height: 50px;
        }
    }
}

.tab-header {
    display: flex;
    justify-content: space-around;
    flex-flow: row nowrap;
    line-height: 40px;
    background-color: $white;

    .tab-item {
        &.active {
            border-bottom: 2px solid #b4282d;
            color: #b4282d;
        }
    }
}

.my-coupon-item {
    display: grid;
    grid-template-columns: 100px 1fr;
    height: 114px;
    background-color: $white;
    margin: 5px 0;

    .price {
        background-color: #b4282d;
        color: $white;
        text-align: center;
        padding: 30px 0 0;

        em {
            font-style: normal;
            font-size: 30px;
        }
    }

    .info {
        padding-top: 10px;
        position: relative;

        .time {
            position: absolute;
            bottom: 35px;
            line-height: 20px;
            width: 100%;
            font-size: 12px;

            navigator {
                color: #f00;
                border: 1px solid #f00;
                border-radius: 5px;
                padding: 0 3px;
                float: right;
            }
        }
    }

    &.expired {
        .price {
            background-color: #999;
        }
    }
}

.search-back-box {
    background: $headerBg;
    color: $white;
    position: relative;
    height: 44px;
    padding: 5px 5px 0 40px;

    .back {
        position: absolute;
        font-size: 1.5625rem;
        color: $white;
        left: 0.625rem;
        top: 0;
    }

    .search-entry {
        margin: 0;
        text-align: center;
    }
}

.store-header {
    height: auto;
    border-bottom: none;

    .tab-bar {
        position: static;
        padding-top: 14px;
        border-top: none;
        height: 2rem;
        navigator,
        .tab-item {
            display: inline-block;
            &.active {
                border-bottom: 2px solid #333;
            }
        }
    }

    .store-info {
        display: grid;
        grid-template-columns: 50px 1fr 60px;
        grid-gap: 8px;
        padding: 30px 8px 8px;

        .logo {
            image {
                width: 50px;
                height: 50px;
            }
        }

        .info {
            padding-top: 6px;

            .name {
                font-size: 16px;
                font-weight: 700;
            }
        }

        .action {
            padding-top: 20px;

            .item {
                background: #e93b3d;
                border: 1px solid #e93b3d;
                border-radius: 50px;
                overflow: hidden;
                padding: 0 7px;
                line-height: 23px;
                white-space: nowrap;
                font-size: 12px;
                color: $white;
                display: inline-block;
            }
        }
    }
}

.store-page {
    .store-header {
        position: absolute;
        top: 0;
        z-index: 7;
        background-color: $bg;
        width: 100%;
    }
    .store-body {
        margin-top: 190px;
    }
    &.min,
    &.min-up {
        .store-header {
            position: fixed;
        }
    }
    &.min {
        .store-header {
            .search-back-box,
            .store-info {
                display: none;
            }
        }

    }
    &.min-up {
        .store-header {
            .store-info {
                display: none;
            }
        }
    }
}


.log-hr,
.payment-hr {
    line-height: 30px;
    padding-left: 20px;
}

.log-item,
.order-mini-item {
    position: relative;
    background-color: $white;
    padding: 0 20px;

    .info {
        padding: 10px 80px 10px 0;

        p {
            font-size: 12px;
            color: #767676;
        }

        .name {
            font-size: 16px;
        }
    }

    .amount {
        color: #f00;
        font-size: 20px;
        position: absolute;
        right: 20px;
        top: 14px;
    }

    &:not(:last-of-type) {
        .info {
            border-bottom: $hr;
        }
    }
}

.order-mini-item {
    .check-box {
        position: absolute;
        top: 20px;
    }

    .info {
        padding-left: 30px;
    }
}

.has-double-footer {
    margin-bottom: 88px;
}

.invoice-footer {
    display: grid;
    grid-template: 44px 44px / 1fr 100px;
    position: fixed;
    bottom: 0;
    width: 100%;
    padding-left: 20px;
    background-color: $white;
    box-sizing: border-box;
    >view {

        &:first-child,
        &:nth-child(2) {
            line-height: 44px;
        }

        &:nth-child(2) {
            text-align: right;
        }

        &:nth-child(2),
        &:nth-child(3) {
            font-size: 12px;

            p {
                line-height: 22px;

                &:first-child {
                    color: $red;
                }
            }
        }
    }

    .btn {
        width: 100%;
        line-height: 44px;
        text-align: center;
        background-color: $red;
        color: $white;
        display: block;
        padding: 0;
    }
}

.payment-item {
    display: grid;
    grid-template: 40px / 40px 1fr 40px;
    grid-gap: 10px;
    line-height: 40px;
    background: $white;

    .icon {
        text-align: center;

        image {
            width: 40px;
            height: 40px;
        }
    }

    &.active {
        .status {
            i {
                &::before {
                    content: "\f00c";
                }
            }
        }
    }
}

.payment-list {
    .payment-item {
        &:not(:last-of-type) {
            border-bottom: $hr;
        }
    }
}

.account-header,
.affiliate-header {
    background-color: $headerBg;
    padding: 20px;
    color: $white;

    .money {
        font-size: 40px;
        font-weight: 700;
        line-height: 60px;
    }

    view {
        color: #ccc;
        font-size: 12px;
        line-height: 20px;
    }
}

.affiliate-header {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;

    >view:first-child {
        border-right: $hr;
    }
}

.comment-list-box {
    .comment-btn {
        border: 1px solid;
        padding: 0 10px;
        line-height: 20px;
        position: absolute;
        bottom: 0;
        right: 0;
    }
}

.comment-form-item {
    position: relative;

    .goods-img {
        position: absolute;
        top: 10px;
        left: 10px;

        image {
            width: 70px;
            height: 70px;
        }
    }

    .comment-star {
        margin-left: 100px;
        padding: 40px 0;

        .fa {
            font-size: 20px;

            &.active {
                color: $red;
            }
        }
    }

    .comment-input {
        textarea {
            width: 100%;
            resize: none;
            height: 100px;
        }
    }

    .input-radio {
        line-height: 1.875rem;
        position: relative;

        .fa {
            position: absolute;
            right: 0.625rem;
            font-size: 1.5625rem;
            top: 0.125rem;
        }
    }

    .btn {
        background-color: $red;
        color: $white;
        width: 80%;
        margin: 0 auto;
        display: block;
    }
}

.multi-image-box {
    border: 1px dotted;
    padding: 5px;

    .image-item {
        display: inline-block;
        position: relative;
        background-color: #fff;

        .fa {
            position: absolute;
            top: 0;
            right: 0;
            background: rgba(#333, .2);
            border-radius: 50%;
            display: block;
            width: 20px;
            height: 20px;
            text-align: center;
            line-height: 20px;
        }

        image {
            width: 60px;
            height: 60px;
        }
    }

    .add-item {
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        font-size: 40px;
        vertical-align: top;
    }
}

.dialog.dialog-content {
    bottom: 0px;
    top: 38%;

    .dialog-header {
        background-color: $white;
        color: #333;
        border: none;

        .dialog-close {
            background-color: $white;
            color: #333;
        }

        .dialog-title {
            font-weight: 700;
        }
    }

    .dialog-footer {
        border: none;

        .dialog-yes {
            background-color: $red;
            width: 80%;
            margin: 0 auto;
        }
    }

    .money-input {
        text {
            line-height: 30px;
            display: inline-block;
        }
        input {
            display: inline-block;
            height: 50px;
            font-size: 30px;
            outline: 0;
            border: none;
            width: 80%;
        }
    }

    .row-input {

        input,
        .select-input {
            // width: 100%;
            height: 36px;
            outline: 0;
            border: 1px solid #eee;
            padding: 0 10px;
        }
        .select-input {
            line-height: 36px;
            position: relative;
            &::after {
                font-family: "iconfont";
                content: '\e649';
                position: absolute;
                right: 5px;
                top: 0;
                color: #777;
            }
        }
    }
}

.title-list {
    .title-item {
        background-color: $white;
        padding-left: 10px;

        .name {
            font-weight: 700;
            font-size: 16px;
            line-height: 30px;
        }

        p {
            font-size: 12px;
            color: #767676;
            line-height: 20px;
        }
    }
}

.form-table {
    .input-group {
        display: grid;
        grid-template-columns: 100px 1fr;
        background-color: $white;

        >label:first-child {
            padding: 0;
            width: auto;
            line-height: 36px;
        }

        >view {
            width: auto;
            padding-left: 10px;

            input,
            input[type="text"],
            select {
                width: 100%;
                height: 36px;
                outline: 0;
                border: 1px solid #eee;
                background-color: transparent;
            }
        }
    }
}

.add-btn {
    text-align: center;
    line-height: 40px;
    background-color: #b4282d;
    color: #fff;
    width: 80%;
    display: block;
    margin: 40px auto 0;
}
.hr {
    border-bottom: 1px solid #333;
}

.fixed-icon {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: aquamarine;
    color: #fff;
    line-height: 40px;
    text-align: center;
    .fa {
        font-size: 30px;
    }
}

.large-header {
    background-color: $headerBg;
    color: $white;
    height: 100px;
    position: relative;
    margin-bottom: 20px;
    .title {
        padding: 40px 0 0 20px;
        font-size: 30px;
    }
    .fa {
        position: absolute;
        bottom: -20px;
        font-size: 30px;
        display: block;
        width: 40px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        right: 20px;
        border-radius: 50%;
        background-color: #1d8686;
    }
}

.empty-box {
    line-height: 40px;
    text-align: center;
    font-size: 30px;
    color: #999;
    margin-top: 30vh;
}

.no-more-tip {
    text-align: center;
    color: #ccc;
    line-height: 60px;
}
</style>