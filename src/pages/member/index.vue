<template>
    <div>
        <div class="user-header">
            <div class="avatar">
                <img :src="user ? user.avatar : '/images/avatar.png'">
            </div>
            <div class="name">
                欢迎您，
                <a v-if="user" @click="tapProfile">{{ user.name }}</a>
                <a v-else @click="tapLogin">请登陆</a>
                ~
            </div>
        </div>
        <div class="menu-grid">
            <a @click="$router.push('/order')" class="item">
                <i class="fa fa-users" aria-hidden="true"></i>
                订单
            </a>
            <a @click="$router.push('/collect')" class="item">
                <i class="fa fa-collect" aria-hidden="true"></i>
                关注
            </a>
            <a @click="$router.push('/message')" class="item">
                <i class="fa fa-message" aria-hidden="true"></i>
                消息
            </a>
            <a @click="$router.push('/account/center')" class="item">
                <i class="fa fa-shield" aria-hidden="true"></i>
                安全
            </a>
            <a @click="tapProfile" class="item">
                <i class="fa fa-set" aria-hidden="true"></i>
                设置
            </a>
        </div>
        <div class="menu-large">
            <MenuLargeItem title="待付款" icon="fa-money" :uri="'/order?status=' + ORDER_STATUS.UN_PAY" :count="order_subtotal.un_pay"/>
            <MenuLargeItem title="待收货" icon="fa-shipping-fast" :uri="'/order?status=' + ORDER_STATUS.SHIPPED" :count="order_subtotal.shipped"/>
            <MenuLargeItem title="待评价" icon="fa-comment" uri="/comment" :count="order_subtotal.uncomment"/>
            <MenuLargeItem title="退换货" icon="fa-exchange" uri="/refund" :count="order_subtotal.refunding"/>
        </div>

        <div class="menu-panel">
            <a @click="$router.push('/account')" class="panel-header">
                <i class="fa fa-wallet" aria-hidden="true"></i>
                我的钱包
                <i class="fa fa-chevron-right" aria-hidden="true"></i>
            </a>
            <div class="panel-body">
                <a @click="$router.push('/account')" class="item">
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
                </a><a @click="$router.push('/coupon/my')" class="item">
                    <span class="menu-item-icon">0
                    </span>
                    优惠券
                </a>
            </div>
        </div>

        <div class="menu-list">
            <MenuItem title="签到" icon="fa-et-checking-in" uri="/checkin"/>
            <MenuItem title="我的收货地址" icon="fa-map" uri="/address"/>
            <MenuItem title="浏览历史" icon="fa-history" uri="/product/history"/>
            <MenuItem title="我的推荐" icon="fa-share" uri="/affiliate"/>
            <MenuItem title="帮助" icon="fa-help" uri="/article"/>
        </div>
        
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app';
import { IUser, ORDER_STATUS, IOrderCount } from '../../api/model';
import { getOrderSubtotal } from '../../api/order';

const app = getApp<IMyApp>();

interface IPageData {
    user: IUser | null,
    ORDER_STATUS: any,
    order_subtotal: IOrderCount | null,
}

export class Index extends WxPage<IPageData> {
    public data: IPageData = {
        user: null,
        ORDER_STATUS: ORDER_STATUS,
        order_subtotal: {},
    };

    onLoad() {
        app.getUser().then(res => {
            this.setData({
                user: res
            });
        });
        getOrderSubtotal().then(res => {
            this.setData({
                order_subtotal: res
            });
        });
    }
}
</script>
<style lang="scss" scoped>
page {
    background-color: #f4f4f4;
}
.user-header {
    .name {
        navigator {
            display: inline;
        }
    }
}
</style>
