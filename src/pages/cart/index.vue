<template>
    <div>
        <div class="cart-box" v-if="items && items.length > 0">
            <div class="cart-group-item" v-for="(item, index) in items" :key="index">
                <div class="group-header">
                    <i class="fa check-box {{ item.checked ? 'active' : ''}}" @click="toggleCheckGroup" data-group="{{ index }}"></i>
                    <span>{{ item.name }}</span>
                </div>
                <SwipeRowBox class="swipe-box goods-list">
                    <SwipeRow name="cart-item goods-item" v-for="(cart, i) in item.goods_list" :key="i" :index="cart.id" right-width="150">
                        <div slot="content" class="swipe-content">
                            <i class="fa check-box {{ cart.checked ? 'active' : ''}}" @click="toggleCheck" data-group="{{ index }}" data-cart="{{ i }}"></i>
                            <div class="goods-img">
                                <img :src="cart.goods.thumb" alt="">
                            </div>
                            <div class="goods-info">
                                <h4>{{ cart.goods.name }}</h4>
                                <span>{{ cart.price | price }}</span>
                                <div class="number-box">
                                    <i class="fa fa-minus"></i>
                                    <input type="text" name="" value="{{cart.amount}}">
                                    <i class="fa fa-plus"></i>
                                </div>
                            </div>
                        </div>
                        <div slot="right" class="actions-right">
                            <i class="fa fa-trash" @click="tapRemove"></i>
                        </div>
                    </SwipeRow>
                </SwipeRowBox>
            </div>
        </div>
        <div class="cart-footer"  v-if="items && items.length > 0">
            <i class="fa check-box {{ checkedAll ? 'active' : ''}}" @click="toggleCheckAll"></i>
            <span @click="toggleCheckAll">全选</span>

            <div class="cart-amount">
                <span>{{ total() | price }}</span>
                <span @click="tapCashier" class="btn">结算</span>
            </div>
        </div>

        <div class="empty-cart-box" v-if="!items || items.length < 1">
            <div v-if="isGuest">
                <p>登录后可同步购物车中商品</p>
                <a href="/pages/member/login" class="btn">登录</a>
            </div>
            <div v-else>
                <p>购物车时空的</p>
                <a href="/pages/index/index" class="btn">去逛逛</a>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app.vue';
import { ICart, ICartItem } from '../../api/model';
import { getCart } from '../../api/cart';
import { WxPage, WxJson, TouchEvent } from '../../../typings/wx/lib.vue';

const app = getApp<IMyApp>();

interface IPageData {
    items: ICart[],
    checkedAll: boolean,
    isGuest: boolean,
    isLoading: boolean
}
@WxJson({
    usingComponents: {
        SwipeRowBox: '/components/SwipeRow/box',
        SwipeRow: '/components/SwipeRow/index'
    },
    navigationBarTitleText: "购物车",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})
export class Index extends WxPage<IPageData> {
    data: IPageData = {
        items: [],
        checkedAll: false,
        isGuest: true,
        isLoading: false
    };

    onLoad() {
        this.setData({
            isGuest: !app.globalData.token
        });
        this.tapRefresh();
    }

    public tapRefresh() {
        if (this.data.isLoading) {
            return;
        }
        this.setData({
            isLoading: true
        });
        getCart().then(res => {
            this.setData({
                isLoading: false,
                items: !res.data ? [] : res.data
            });
        }); 
    }

    public total(): number {
        let total = 0;
        if (!this.data.items || this.data.items.length < 1) {
            return total;
        }
        for (const item of this.data.items) {
            for (const cart of item.goods_list) {
                if (cart.checked && cart.price) {
                    total += cart.amount * cart.price;
                }
            }
        }
        return total;
    }

    public toggleCheckAll() {
        let check = !this.data.checkedAll;
        let items = this.data.items;
        for (const item of items) {
            item.checked = check;
            for (const cart of item.goods_list) {
                cart.checked = check;
            }
        }
        this.setData({
            items: items,
            checkedAll: check
        });
    }

    public toggleCheckGroup(e: TouchEvent) {
        let items = this.data.items;
        let item = items[e.currentTarget.dataset.group as number];
        item.checked = !item.checked;
        for (const cart of item.goods_list) {
            cart.checked = item.checked;
        }
        let check = this.data.checkedAll;
        if (!item.checked) {
            check = false;
        }
        this.setData({
            items: items,
            checkedAll: check
        });
    }

    public toggleCheck(e: TouchEvent) {
        let items = this.data.items;
        let item = items[e.currentTarget.dataset.group as number];
        let cart = item.goods_list[e.currentTarget.dataset.cart as number];
        cart.checked = !cart.checked;
        let check = this.data.checkedAll;
        if (!cart.checked) {
            check = false;
            item.checked = false;
        }
        this.setData({
            items: items,
            checkedAll: check
        });
    }

    public tapCashier() {
        const data: ICart[] = [];
        for (const item of this.data.items) {
            const items: ICartItem[] = [];
            for (const cart of item.goods_list) {
                if (cart.checked) {
                    items.push(cart);
                }
            }
            if (items.length > 0) {
                item.goods_list = items;
                data.push(item);
            }
        }
        if (data.length < 1) {
            wx.showToast({
                title: '请选择结算的商品'
            })
            return;
        }
        app.setCart(data);
        wx.navigateTo({
            url: '/pages/cashier/index'
        });
    }
}
</script>
<style lang="scss" scoped>
.swipe-content {
    width: 750rpx;
    margin: 0;
}
.actions-right {
    height: 100px;
    display: flex;
    direction: row;
    text-align: center;
    vertical-align: middle;
    line-height: 100px;
    .fa-trash {
        background-color: red;
        color: #fff;
        width: 150rpx; 
    }
}
</style>
