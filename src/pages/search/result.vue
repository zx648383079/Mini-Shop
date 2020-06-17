<template>
    <div>
        <div>
            <header class="header top">
                <div class="search-box under-search">
                    <a class="home-btn" href="/pages/index/index" open-type="switchTab">
                        <i class="fa fa-home"></i>
                    </a>
                    <div class="form-box" @click="tapEnterSearch">
                        <i class="fa fa-search" ></i>
                        <view class="search-input">{{keywords}}</view>
                        <i class="fa fa-close" @click="tapNewSearch"></i>
                    </div>
                </div>
            </header>
            <div class="has-header">
                <div >
                    <div class="goods-list">
                        <div class="item-view" v-for="(item, index) in items" :key="index"  wx:key="id">
                            <div class="item-img">
                                <a href="/pages/goods/index?id={{ item.id }}"><img :src="item.thumb" alt="" mode="widthFix"></a>
                            </div>
                            <div class="item-title">
                                {{ item.name }}
                            </div>
                            <div class="item-actions">
                                <span class="item-price">￥{{ item.price }}
                                </span>
                                <span @click="tapAddCart" data-id="{{ item.id }}">加入购物车</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="empty-box" v-if="items.length < 1">
                        暂无商品
                </div>
            </div>
        </div>
        <CartDialog :mode="mode" :product="goods" @close="tapCloseDialog"/>
    </div>
</template>
<script lang="ts">
import { IProduct } from '../../api/model';
import { WxPage, WxJson, TouchEvent } from '../../../typings/wx/lib.vue';
import { getList } from '../../api/product';
import { IMyApp } from '../../app.vue';
import { LOGIN_PATH } from '../../utils/types';
import { addGoods } from '../../api/cart';

const app = getApp<IMyApp>();

interface IPageData {
    items: IProduct[],
    keywords: string,
    category: number,
    brand: number,
    page: number,
    hasMore: boolean,
    isLoading: false,
    mode: number,
    goods: IProduct | null,
}

@WxJson({
    usingComponents: {
        CartDialog: '/pages/goods/Child/CartDialog'
    },
    navigationBarTitleText: "搜索",
    navigationBarBackgroundColor: "#f4f4f4",
    navigationBarTextStyle: "black",
    enablePullDownRefresh: true,
    onReachBottomDistance: 10
})
export class Result extends WxPage<IPageData> {

    public data: IPageData = {
        items: [],
        keywords: '',
        category: 0,
        brand: 0,
        page: 1,
        hasMore: true,
        isLoading: false,
        mode: 0,
        goods: null
    };

    public onLoad(query?: any) {
        this.setData(Object.assign(this.data, query || {}));
        this.tapRefresh();
    }

    onPullDownRefresh() {
        this.tapRefresh();
    }

    onReachBottom() {
        this.tapMore();
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
            page: page,
            keywords: this.data.keywords,
            category: this.data.category,
            brand: this.data.brand,
        }).then(res => {
            wx.stopPullDownRefresh();
            this.setData({
                page: page,
                hasMore: res.paging.more,
                isLoading: false,
                items: page < 2 ? res.data :  [].concat(this.data.items as never[], res.data as never[])
            });
        });
    }

    public tapCloseDialog() {
        this.setData({
            mode: 0
        });
    }

    public tapProduct(item: IProduct) {
        wx.navigateTo({url: '/pages/goods/index?id=' + item.id});
    }
    public tapAddCart(e: TouchEvent) {
        if (!app.globalData.token) {
            wx.navigateTo({
                url: LOGIN_PATH
            })
            return;
        }
        let id = e.currentTarget.dataset.id as number;
        if (this.data.goods && this.data.goods.id == id) {
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

    public tapSearch(keywords: string) {
        this.setData({
            keywords: keywords
        });
        this.tapRefresh();
    }

    public tapEnterSearch() {
        wx.navigateTo({
            url: '/pages/search/index'
        });
    }
    public tapNewSearch() {
        wx.navigateBack({
            delta: 0
        });
    }
}
</script>
<style lang="scss" scoped>
page {
    background-color: #f4f4f4;
}
.home-btn {
    .fa {
        font-size: 28px;
    }
}
.search-input {
    display: block;
    background-color: #fff;
    line-height: 35px;
    color: #333;
    text-align: left;
    padding: 0 24px;
    height: 35px;
}
</style>