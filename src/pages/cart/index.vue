<template>
    <div>
        <div class="cart-box slide-box" v-if="items && items.length > 0">
            <div class="cart-group-item" v-for="(item, index) in items" :key="index">
                <div class="group-header">
                    <i class="fa check-box {{ item.checked ? 'active' : ''}}" @click="toggleCheckGroup" data-group="{{ index }}"></i>
                    <span>{{ item.name }}</span>
                </div>
                <div class="goods-list">
                    <MpSlideView v-for="(cart, i) in item.goods_list" :key="i" buttons="{{ cart.buttons }}" bindbuttontap="slideButtonTap">
                        <div class="cart-item goods-item">
                            <i class="fa check-box {{ cart.checked ? 'active' : ''}}" @click="toggleCheck" data-group="{{ index }}" data-cart="{{ i }}"></i>
                            <div class="goods-img">
                                <img :src="cart.goods.thumb" alt="">
                            </div>
                            <div class="goods-info">
                                <h4>{{ cart.goods.name }}</h4>
                                <span>￥{{ cart.price }}</span>
                                <div class="number-box">
                                    <i class="fa fa-minus"></i>
                                    <input type="text" name="" value="{{cart.amount}}">
                                    <i class="fa fa-plus"></i>
                                </div>
                            </div>
                        </div>
                    </MpSlideView>
                </div>
            </div>
        </div>
        <div class="cart-footer"  v-if="items && items.length > 0">
            <i class="fa check-box {{ checkedAll ? 'active' : ''}}" @click="toggleCheckAll"></i>
            <span @click="toggleCheckAll">全选</span>

            <div class="cart-amount">
                <span>{{ total }}</span>
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
                <a href="/pages/index/index" open-type="switchTab" class="btn">去逛逛</a>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app.vue';
import { ICartItem, ICartGroup } from '../../api/model';
import { getCart, deleteItem } from '../../api/cart';
import { WxPage, WxJson, TouchEvent, CustomEvent } from '../../../typings/wx/lib.vue';

const app = getApp<IMyApp>();

interface IPageData {
    items: ICartGroup[],
    checkedAll: boolean,
    isGuest: boolean,
    isLoading: boolean,
    total: number;
    checkId: number[];
}
@WxJson({
    usingComponents: {
        MpSlideView: 'weui-miniprogram/slideview/slideview'
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
        isLoading: false,
        total: 0,
        checkId: []
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
            this.formatCart(res.data);
        }); 
    }

    public formatCart(cart: ICartGroup[]) {
        this.setData({
            isLoading: false,
            items: !cart ? [] : cart.map(item => {
                item.checked = this.isCheckGroup(item);
                item.goods_list = this.formatButton(item.goods_list);
                return item;
            })
        });
        this.refresh();
    }

    public refresh() {
        let total = 0;
        if (!this.data.items || this.data.items.length < 1) {
            this.setData({
                total
            });
            return;
        }
        for (const item of this.data.items) {
            for (const cart of item.goods_list) {
                if (cart.checked && cart.price) {
                    total += cart.amount * cart.price;
                }
            }
        }
        this.setData({
            total
        });
    }

    public toggleCheckAll() {
        let check = !this.data.checkedAll;
        let items = this.data.items;
        let checkId: number[] = [];
        for (const item of items) {
            item.checked = check;
            for (const cart of item.goods_list) {
                cart.checked = check;
                if (check) {
                    checkId.push(cart.id as number);
                }
            }
        }
        this.setData({
            items: items,
            checkedAll: check,
            checkId,
        });
        this.refresh();
    }

    public toggleCheckGroup(e: TouchEvent) {
        let items = this.data.items;
        let item = items[e.currentTarget.dataset.group as number];
        item.checked = !item.checked;
        let checkId = this.data.checkId;
        for (const cart of item.goods_list) {
            cart.checked = item.checked;
            const i = checkId.indexOf(cart.id as number);
            if (item.checked && i < 0) {
                checkId.push(cart.id as number);
            } else if (!item.checked && i >= 0) {
                checkId.splice(i, 1);
            }
        }
        let check = this.data.checkedAll;
        if (!item.checked) {
            check = false;
        }
        this.setData({
            items: items,
            checkedAll: check,
            checkId
        });
        this.refresh();
    }

    public toggleCheck(e: TouchEvent) {
        let items = this.data.items;
        let item = items[e.currentTarget.dataset.group as number];
        let cart = item.goods_list[e.currentTarget.dataset.cart as number];
        cart.checked = !cart.checked;
        let check = this.data.checkedAll;
        let checkId = this.data.checkId;
        const i = checkId.indexOf(cart.id as number);
        if (cart.checked && i < 0) {
            checkId.push(cart.id as number);
        } else if (!cart.checked && i >= 0) {
            checkId.splice(i, 1);
        }
        if (!cart.checked) {
            check = false;
            item.checked = false;
        }
        this.setData({
            items: items,
            checkedAll: check,
            checkId
        });
        this.refresh();
    }

    public slideButtonTap(e: CustomEvent) {
        deleteItem(e.detail.data).then(res => {
            this.formatCart(res.data);
        });
    }

    public tapCashier() {
        const data: ICartGroup[] = [];
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
                icon: 'none',
                title: '请选择结算的商品'
            })
            return;
        }
        app.setCart(data);
        wx.navigateTo({
            url: '/pages/cashier/index'
        });
    }

    private isCheckItem(item: any) {
        return this.data.checkId.indexOf(item.id) >= 0;
    }

    private isCheckGroup(item: ICartGroup) {
        for (let index = 0; index < item.goods_list.length; index++) {
            if (!this.isCheckItem(item.goods_list[index])) {

                return false;
            }
        }
        return true;
    }

    private formatButton(res: any[]): any[] {
        return res.map(item => {
            if (item.goods.name.length > 15) {
                item.goods.name = item.goods.name.substr(0, 15) + '...';
            }
            item.checked = this.isCheckItem(item);
            item.buttons = [
                {
                    type: 'warn',
                    text: '删除',
                    data: item.id,
                }
            ];
            return item;
        });
    }
}
</script>
<style lang="scss" scoped>
page {
    background-color:#f4f4f4;
}
.cart-group-item {
    margin-bottom:10px;
}
</style>
