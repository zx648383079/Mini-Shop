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
                    <view class="item">
                        <i :class="['fa', is_collected ? 'fa-collect': 'fa-uncollect']"></i>    
                        收藏
                    </view>
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
        <MiniCart></MiniCart>
    </div>
</template>
<script lang="ts">
import { WxPage, WxJson } from '../../../typings/wx/lib.vue';
import { IProduct, IStore } from '../../api/model';
import { getList } from '../../api/product';
import { getStore } from '../../api/store';

interface IPageData {
    items: IProduct[],
    hasMore: boolean,
    isLoading: boolean,
    page: number,
    tabIndex: number,
    tabList: any[],
    store: IStore
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
        const data = this.data;
        const item = data.items[index];
        if (!item.amount) {
            item.amount = 0;
        }
        item.amount ++;
        this.setData(data);
    }

    public tapMinus(index: number) {
        const data = this.data;
        const item = data.items[index];
        if (!item.amount) {
            item.amount = 0;
        }
        item.amount = Math.max(0, item.amount - 1);
        this.setData(data);
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
.tab-bar {
    border-bottom: 1px solid #ccc;
}
.goods-list {
    display: block;
    text-align: left;
    .item {
        position: relative;
        display: grid;
        background-color: #fff;
        grid-template-columns: 100px 1fr;
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
