<template>
    <div>
        <header class="top top-search-box">
            <div class="logo">
                <img src="/images/wap_logo.png" alt="">
            </div>
            <a class="search-entry" href="/pages/search/index">
                <i class="fa fa-search"></i>
                <span>搜索商品, 共{{ subtotal ? subtotal.goods : 0 }}款好物</span>
            </a>
            <a v-if="isGuest" href="/pages/member/login">登录</a>
            <a v-if="!isGuest" href="/pages/message/index">
                <i class="fa fa-message"></i>
            </a>
        </header>

        <div class="has-header">
            <div class="banner">
                <swiper autoplay="{{ true }}"
                    interval="{{ 3000 }}"
                    duration="{{ 500 }}">
                    <block wx:for="{{ banners }}" wx:key="id">
                        <swiper-item>
                            <image src="{{ item.content }}" class="slide-image"/>
                        </swiper-item>
                    </block>
                </swiper>
            </div>

            <div class="menu-box">
                <a v-for="(item, index) in categories" :key="index" class="menu-item" wx:key="id">
                    <img class="menu-icon" :src="item.icon" alt="">
                    <div class="menu-name">{{ item.name }}</div>
                </a>
            </div>
            <div class="home-panel" v-if="data.new_products && data.new_products.length > 0">
                <div class="panel-header">最新商品</div>
                <div class="goods-list">
                    <div class="item-view" v-for="(item, index) in data.new_products" :key="index"  wx:key="id" @enter="tapProduct" :item="item" @addCart="tapAddCart">
                        <div class="item-img">
                            <a href="/pages/goods/index?id={{ item.id }}"><img :src="item.thumb" alt="" mode="widthFix"></a>
                        </div>
                        <div class="item-title">
                            {{ item.name }}
                        </div>
                        <div class="item-actions">
                            <span class="item-price">{{ item.price | price }}
                            </span>
                            <span @click="tapAddCart" data-id="{{ item.id }}">加入购物车</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="home-panel" v-if="data.hot_products && data.hot_products.length > 0">
                <div class="panel-header">热门商品</div>
                <div class="goods-list">
                    <div class="item-view" v-for="(item, index) in data.hot_products" :key="index"  wx:key="id" @enter="tapProduct" :item="item" @addCart="tapAddCart">
                        <div class="item-img">
                            <a href="/pages/goods/index?id={{ item.id }}"><img :src="item.thumb" alt="" mode="widthFix"></a>
                        </div>
                        <div class="item-title">
                            {{ item.name }}
                        </div>
                        <div class="item-actions">
                            <span class="item-price">{{ item.price | price }}
                            </span>
                            <span @click="tapAddCart" data-id="{{ item.id }}">加入购物车</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="home-panel" v-if="data.best_products && data.best_products.length > 0">
                <div class="panel-header">推荐商品</div>
                <div class="goods-list">
                    <div class="item-view" v-for="(item, index) in data.best_products" :key="index"  wx:key="id" @enter="tapProduct" :item="item" @addCart="tapAddCart">
                        <div class="item-img">
                            <a href="/pages/goods/index?id={{ item.id }}"><img :src="item.thumb" alt="" mode="widthFix"></a>
                        </div>
                        <div class="item-title">
                            {{ item.name }}
                        </div>
                        <div class="item-actions">
                            <span class="item-price">{{ item.price | price }}
                            </span>
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
import {
    IMyApp
} from '../../app';
import { IAd, ICategory, IProduct, ISubtotal, IHomeProduct } from '../../api/model';
import { getHome, getInfo } from '../../api/product';
import { getBanners } from '../../api/ad';
import { WxPage, WxJson, TouchEvent } from '../../../typings/wx/lib.wx.page';

const app = getApp<IMyApp>();

interface IPageData {
    banners: IAd[];
    categories: ICategory[];
    data: IHomeProduct;
    subtotal: ISubtotal| null;
    mode: number;
    goods: IProduct | null,
    isGuest: boolean;
}
@WxJson({
    usingComponents: {
        CartDialog: '/pages/goods/Child/CartDialog'
    },
    navigationBarTitleText: "首页",
    navigationBarBackgroundColor: "#f4f4f4",
    navigationBarTextStyle: "black"
})
export class Index extends WxPage<IPageData> {
    public data: IPageData = {
        banners: [],
        categories: [],
        data: {},
        subtotal: null,
        mode: 0,
        goods: null,
        isGuest: true
    };

    onLoad() {
        this.setData({
            isGuest: !app.globalData.token
        });
        getHome().then(res => {
            this.setData({
                data: res
            });
        });
        app.getCategories().then(res => {
            this.setData({
                categories: res
            });
        });
        getBanners().then(res => {
             if (!res.data) {
                return;
            }
            this.setData({
                banners: res.data
            });
        });
        app.getSubtotal().then(res => {
            this.setData({
                subtotal: res
            });
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
        getInfo(id).then(res => {
            this.setData({
                goods: res,
                mode: 1
            });
        });
    }

    public tapCloseDialog() {
        this.setData({
            mode: 0
        });
    }
}
</script>
<style lang="scss" scoped>
.banner {
    swiper {
        height: 50vw;
    }
    .slide-image {
        height: 50vw;
        width: 100%;
    }
}
.has-header {
    background-color: #f4f4f4;
    margin-top:46px;
}
</style>
