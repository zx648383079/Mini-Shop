<template>
    <div>
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
                    <div class="item-view" v-for="(item, index) in items" :key="index">
                        <div class="item-img">
                            <a href="/pages/goods/index?id={{ item.id }}"><img :src="item.thumb" mode="widthFix"></a>
                        </div>
                        <div class="item-title">
                            {{item.name}}
                        </div>
                        <div class="item-actions">
                            <span class="item-price">￥{{item.price}}</span>
                            <span @click="tapAddCart" data-id="{{ item.id }}">加入购物车</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <CartDialog :mode="mode" :product="goods" @close="tapCloseDialog"/>
    </div>
</template>
<script lang="ts">
import { WxPage, WxJson, TouchEvent } from '../../../typings/wx/lib.vue';
import { IProduct, IStore } from '../../api/model';
import { getList } from '../../api/product';
import { getStore, toggleCollect } from '../../api/store';
import { IMyApp } from '../../app.vue';
import { addGoods } from '../../api/cart';

const app = getApp<IMyApp>();

interface IPageData {
    items: IProduct[],
    hasMore: boolean,
    isLoading: boolean,
    page: number,
    tabIndex: number,
    tabList: any[],
    store: IStore,
    goods: IProduct | null,
    mode: number,
}

@WxJson({
    usingComponents: {
        CartDialog: '/pages/goods/Child/CartDialog'
    },
    navigationBarTitleText: "店铺",
    navigationBarBackgroundColor: "#f4f4f4",
    navigationBarTextStyle: "black"
})
export class Index extends WxPage<IPageData> {
    public data: IPageData = {
        store: {
            id: 0,
            logo: '',
            name: '我的店铺',
            collect_count: 1,
            is_collected: false
        },
        items: [],
        hasMore: false,
        isLoading: false,
        page: 1,
        tabIndex: 0,
        mode: 0,
        goods: null,
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
        ]
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

    public tapAddCart(e: TouchEvent) {
        let id = e.currentTarget.dataset.id as number;
        if (this.data.goods && this.data.goods.id === id) {
            this.setData({
                mode: 1
            });
            return;
        }
        addGoods(id, 1).then(res => {
            if (!res.dialog) {
                wx.showToast({
                    title: '已成功加入购物车'
                });
                return;
            }
            this.setData({
                goods: res.data,
                mode: 1
            });
        });
    }

    public tapCloseDialog() {
        this.setData({
            mode: 0
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
                items.push(item);
            });
            this.setData({
                page,
                hasMore: res.paging.more,
                isLoading: false,
                items
            });
        });
    }
}
</script>
<style lang="scss" scoped>
page {
    background-color: #f4f4f4;
}
</style>
