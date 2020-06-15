<template>
    <div class="store-page">
        <header class="store-header">
            <div class="search-back-box">
                <view class="back" @click="tapBack">
                    <i class="fa fa-chevron-left" aria-hidden="true"></i>
                </view>
                <a class="search-entry" href="/pages/search/index">
                    <i class="fa fa-search" aria-hidden="true"></i>
                    <span>搜索本店商品</span>
                </a>
            </div>
            <div class="store-info">
                <div class="logo">
                    <img :src="store.logo" alt="">
                </div>
                <div class="info">
                    <div class="name">{{ store.name }}</div>
                    <p>{{ store.collect_count }}人收藏</p>
                </div>
                <div class="action">
                    <div class="item" @click="tapCollect">
                        <i :class="['fa', store.is_collected ? 'fa-collect': 'fa-uncollect']"></i>    
                        {{ store.is_collected ? '已收藏' : '收藏' }}
                    </div>
                </div>
            </div>
            <div class="tab-bar">
                <text class="tab-item" v-for="(item, index) in tabList" :key="index" @click="tapTab(index)" :class="tabIndex == index ? 'active' : ''">{{ item.name }}</text>
            </div>
        </header>

        <div class="store-body">
            <div class="goods-list">
                <div class="item" v-for="(item, index) in items" :key="index">
                    <div class="item-img">
                        <a href="/pages/goods/index?id={{ item.id }}"><img :src="item.thumb" alt=""></a>
                    </div>
                    <div class="item-info">
                        <div class="item-title">{{item.name}}</div>
                        <span class="item-price">{{item.price}}</span>
                        <div class="item-actions">
                            <i class="fa fa-minus" v-if="item.amount && item.amount > 0"  @click="tapMinus(index)"></i>
                            <span v-if="item.amount && item.amount > 0">{{ item.amount }}</span>
                            <i class="fa fa-plus" @click="tapPlus(index)"></i>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
        <MiniCart :cart="cart" @change="tapCartChange"></MiniCart>
    </div>
</template>
<script lang="ts">
import { WxPage, WxJson, CustomEvent } from '../../../typings/wx/lib.vue';
import { IProduct, IStore, ICart } from '../../api/model';
import { getList } from '../../api/product';
import { getStore, toggleCollect } from '../../api/store';
import { IMyApp } from '../../app.vue';
import { getCart, updateGoods } from '../../api/cart';
import { LOGIN_PATH } from '../../utils/types';

const app = getApp<IMyApp>();

interface IPageData {
    items: IProduct[],
    hasMore: boolean,
    isLoading: boolean,
    page: number,
    tabIndex: number,
    tabList: any[],
    store: IStore,
    cart: ICart | null,
}
@WxJson({
    usingComponents: {
        MiniCart: '/pages/cart/Child/MiniCart'
    },
    navigationBarTitleText: "快速下单",
    navigationBarBackgroundColor: "#f4f4f4",
    navigationBarTextStyle: "black",
    onReachBottomDistance: 100,
})
export class Quick extends WxPage<IPageData> {
    
    public data: IPageData = {
        store: {
            id: 1,
            logo: '',
            name: '我的店铺',
            collect_count: 0,
            is_collected: false
        },
        items: [],
        hasMore: false,
        isLoading: false,
        page: 1,
        tabIndex: 0,
        tabList: [
            {
                name: '首页',
                status: 0,
            },
            {
                name: '全部商品',
                status: 0,
            },
            {
                name: '促销',
                status: 0,
            },
            {
                name: '动态',
                status: 0,
            },
        ],
        cart: null
    };

    public onLoad(option: any) {
        if (!option || !option.id) {
            this.tapBack();
            return;
        }
        getStore(option.id).then(res => {
            this.setData({
                store: res
            });
        });
        this.tapRefresh();
        getCart().then(res => {
            this.setData({
                cart: res, 
            });
            this.formatAmount(this.data.items)
        });
    }

    public tapCartChange(e: CustomEvent) {
        this.setData({
            cart: e.detail,
        });
        this.formatAmount(this.data.items)
    }

    public tapCollect() {
        if (!this.data.store) {
            return;
        }
        if (!app.globalData.token) {
            return;
        }
        let store = this.data.store;
        toggleCollect(store.id).then(res => {
            store.is_collected = res.data;
            this.setData({
                store
            });
        });
    }

    public onReachBottom() {
        this.tapMore();
    }

    public tapBack() {
        wx.navigateBack({
            delta: -1
        });
    }

    public tapTab(index: number) {
        this.setData({
            tabIndex: index
        });
    }

    /**
     * tapPlus
     */
    public tapPlus(index: number) {
        if (!app.globalData.token) {
            wx.navigateTo({
                url: LOGIN_PATH
            });
            return;
        }
        const data = this.data;
        const item = data.items[index];
        if (!item.amount) {
            item.amount = 0;
        }
        item.amount ++;
        updateGoods(item.id, item.amount).then(res => {
            if (res.dialog) {
                return
            }
            data.cart = res as ICart;
            this.setData(data);
        });
        
    }

    public tapMinus(index: number) {
        if (!app.globalData.token) {
            wx.navigateTo({
                url: LOGIN_PATH
            });
            return;
        }
        const data = this.data;
        const item = data.items[index];
        if (!item.amount) {
            item.amount = 0;
        }
        item.amount = Math.max(0, item.amount - 1);
        updateGoods(item.id, item.amount).then(res => {
            if (res.dialog) {
                return
            }
            data.cart = res as ICart;
            this.setData(data);
        });
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.data.hasMore) {
            return;
        }
        this.goPage(this.data.page + 1);
    }

    public goPage(page: number) {
        if (this.data.isLoading) {
            return;
        }
        this.setData({
            isLoading: true
        });
        getList({
            page,
        }).then(res => {
            wx.stopPullDownRefresh();
            let items = this.data.items;
            if (page < 2) {
                items = [];
            }
            res.data.forEach(item => {
                item.amount = 0;
                if (item.name.length > 20) {
                    item.name = item.name.substr(0, 20) + '...';
                }
                items.push(item);
            });
            this.setData({
                page,
                hasMore: res.paging.more,
                isLoading: false,
            });
            this.formatAmount(items);
        });
    }

    private formatAmount(items: IProduct[]) {
        const maps: {[key: number]: number} = {};
        const cart = this.data.cart;
        if (cart && cart.data) {
            cart.data.forEach(group => {
                group.goods_list.forEach(item => {
                    if (item.product_id && item.product_id > 0) {
                        return;
                    }
                    if (maps[item.goods_id]) {
                        maps[item.goods_id] += item.amount;
                    } else {
                        maps[item.goods_id] = item.amount;
                    }
                });
            })
        }
        for (const item of items) {
            item.amount = maps[item.id] || 0;
        }
        this.setData({items});
    }
}
</script>
<style lang="scss" scoped>
page {
    background-color: #f4f4f4;
}
.tab-bar {
    border-bottom: 1px solid #ccc;
}
.store-body {
    margin-bottom: 80px;
}
.goods-list {
    display: block;
    text-align: left;
    .item {
        position: relative;
        display: grid;
        background-color: #fff;
        grid-template-columns: 100px 1fr;
        margin-bottom: 10px;
        .item-img {
            height: 100px;
            image {
                width: 100px;
                height: 100px;
            }
        }
        .item-price {
            color: red;
        }
        .item-actions {
            position: absolute;
            bottom: 20px;
            right: 20px;
            display: inline-block;
            text {
                display: inline-block;
                padding: 0 5px;
            }
            .fa-minus-circle {
                color: #777;
            }
        }
    }
}
</style>
