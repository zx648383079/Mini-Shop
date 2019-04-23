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
                        <span class="search-input">{{keywords}}</span>
                        <i class="fa fa-close" @click="tapNewSearch"></i>
                    </div>
                </div>
            </header>
            <div class="has-header">
                <div :loading="isLoading" :more="has_more"   bind:refresh="tapRefresh" bind:more="tapMore">
                    <div class="goods-list">
                        <div class="item-view" v-for="(item, index) in items" :key="index"  wx:key="id" @enter="tapProduct" :item="item" @addCart="tapAddCart">
                            <div class="item-img">
                                <a @click="tapProduct"><img :src="item.thumb" alt="" mode="widthFix"></a>
                            </div>
                            <div class="item-title">
                                {{ item.name }}
                            </div>
                            <div class="item-actions">
                                <span class="item-price">{{ item.price | price }}
                                </span>
                                <span @click="tapAddCart">加入购物车</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <CartDialog :mode="mode" :product="goods" @close="mode = 0"/>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app';
import { IProduct } from '../../api/model';
import { WxPage, WxJson } from '../../../typings/wx/lib.wx.page';
import { getList, getInfo } from '../../api/product';
const app = getApp<IMyApp>();

interface IPageData {
    items: IProduct[],
    keywords: string,
    category: number,
    brand: number,
    page: number,
    has_more: boolean,
    isLoading: false,
    mode: number,
    goods: IProduct | null,
}

@WxJson({
    navigationBarTitleText: "搜索",
    navigationBarBackgroundColor: "#f4f4f4",
    navigationBarTextStyle: "black",
    enablePullDownRefresh: true,
})
export class Index extends WxPage<IPageData> {

    public data: IPageData = {
        items: [],
        keywords: '',
        category: 0,
        brand: 0,
        page: 1,
        has_more: true,
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
        if (!this.data.has_more) {
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
            this.setData({
                page: page,
                has_more: res.paging.more,
                isLoading: false,
                items: page < 2 ? res.data :  [].concat(this.data.items as never[], res.data as never[])
            });
        });
    }
    public tapProduct(item: IProduct) {
        wx.navigateTo({url: '/pages/goods/index?id=' + item.id});
    }
    public tapAddCart(item: IProduct) {
        if (this.data.goods && this.data.goods.id == item.id) {
            this.setData({
                mode: 1
            });
            return;
        }
        getInfo(item.id).then(res => {
            this.setData({
                goods: res,
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
}
</style>