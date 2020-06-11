<template>
    <div>
        <div class="user-header">
            <div class="avatar">
                <img :src="user ? user.avatar : '/images/avatar.png'">
            </div>
            <div class="name">
                欢迎您，
                <a v-if="user" href="profile">{{ user.name }}</a>
                <a v-else href="login">请登陆</a>
                ~
            </div>
        </div>
        <div class="menu-grid" v-if="user">
            <a href="/pages/order/index" class="item">
                <i class="fa fa-users" aria-hidden="true"></i>
                订单
            </a>
            <a href="/pages/collect/index" class="item">
                <i class="fa fa-collect" aria-hidden="true"></i>
                关注
            </a>
            <a href="/pages/message/index" class="item">
                <i class="fa fa-message" aria-hidden="true"></i>
                消息
            </a>
            <a href="/pages/account/center" class="item">
                <i class="fa fa-shield" aria-hidden="true"></i>
                安全
            </a>
            <a href="profile" class="item">
                <i class="fa fa-set" aria-hidden="true"></i>
                设置
            </a>
        </div>
        <div class="menu-large" v-if="user">
            <MenuLargeItem class="item" title="待付款" icon="fa-money" uri="/pages/order/index?status={{ORDER_STATUS.UN_PAY}}" count="{{order_subtotal.un_pay}}"/>
            <MenuLargeItem class="item" title="待收货" icon="fa-shipping-fast" uri="/pages/order/index?status={{ORDER_STATUS.SHIPPED}}" count="{{order_subtotal.shipped}}"/>
            <MenuLargeItem class="item" title="待评价" icon="fa-comment" uri="/pages/comment/index" count="{{order_subtotal.uncomment}}"/>
            <MenuLargeItem class="item" title="退换货" icon="fa-exchange" uri="/pages/refund/index" count="{{order_subtotal.refunding}}"/>
        </div>

        <div class="menu-panel" v-if="user">
            <a href="/pages/account/index" class="panel-header">
                <i class="fa fa-wallet" aria-hidden="true"></i>
                我的钱包
                <i class="fa fa-chevron-right" aria-hidden="true"></i>
            </a>
            <div class="panel-body">
                <a href="/pages/account/index" class="item">
                    <span class="menu-item-icon">0
                    </span>
                    余额
                </a><a href="" class="item">
                    <span class="menu-item-icon">0
                    </span>
                    积分
                </a><a href="" class="item">
                    <span class="menu-item-icon">0
                    </span>
                    红包
                </a><a href="/pages/coupon/my" class="item">
                    <span class="menu-item-icon">0
                    </span>
                    优惠券
                </a>
            </div>
        </div>

        <div class="menu-list">
            <MenuItem class="item" title="扫一扫" icon="fa-scan" @click="tapScan" v-if="user"/>
            <MenuItem class="item" title="签到" icon="fa-et-checking-in" uri="/pages/checkin/index" v-if="user"/>
            <MenuItem class="item" title="我的收货地址" icon="fa-map" uri="/pages/address/index" v-if="user"/>
            <MenuItem class="item" title="浏览历史" icon="fa-history" uri="/pages/goods/history"/>
            <MenuItem class="item" title="我的推荐" icon="fa-share" uri="/pages/affiliate/index" v-if="user"/>
            <MenuItem class="item" title="帮助" icon="fa-help" uri="/pages/article/index"/>
        </div>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app.vue';
import { IUser, ORDER_STATUS, IOrderCount } from '../../api/model';
import { getOrderSubtotal } from '../../api/order';
import { WxPage, WxJson } from '../../../typings/wx/lib.vue';

const app = getApp<IMyApp>();

interface IPageData {
    user: IUser | null,
    ORDER_STATUS: any,
    order_subtotal: IOrderCount | null,
}
@WxJson({
    usingComponents: {
        MenuLargeItem: "/components/MenuLargeItem/index",
        MenuItem: "/components/MenuItem/index"
    },
    navigationBarTitleText: "",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})
export class Index extends WxPage<IPageData> {
    public data: IPageData = {
        user: null,
        ORDER_STATUS: ORDER_STATUS,
        order_subtotal: {},
    };

    onLoad() {
        
    }

    public onShow() {
        app.getUser().then(res => {
            this.setData({
                user: res
            });
            if (res) {
                this.tapSubtotal();
            }
        }).catch(_ => {
            app.setToken();
        });
    }

    tapSubtotal() {
        getOrderSubtotal().then(res => {
            this.setData({
                order_subtotal: res
            });
        });
    }

    public tapScan() {
        wx.scanCode({
            scanType: ['qrCode'],
            onlyFromCamera: true,
            success(res) {
                wx.navigateTo({
                    url: '/pages/authorize/index?token=' + encodeURIComponent(res.result)
                });
            }
        });
    }
}
</script>
<style lang="scss" scoped>
page {
    background-color: #f4f4f4;
}
.user-header {
    position: relative;
    padding-top: 1.5625rem;
    padding-bottom: 1.875rem;
    background: #05a6b1;

    .avatar {
        width: 5.625rem;
        height: 5.625rem;
        margin: 0 auto;
        text-align: center;
        line-height: 0;
        position: relative;

        image {
            width: 100%;
            height: 100%;
            border-radius: 100%;
        }

        &::after {
            content: "";
            width: 6.25rem;
            height: 6.25rem;
            border: 0.125rem solid #99e3ff;
            border-radius: 100%;
            position: absolute;
            left: -0.4125rem;
            top: -0.4125rem;
            z-index: 0;
        }
    }

    .name {
        text-align: center;
        padding-top: 0.625rem;
        color: #fff;
        navigator {
            display: inline;
        }
    }
}
</style>
