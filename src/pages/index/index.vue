<template>
    <div>
        <header class="top top-search-box">
            <a href="" class="logo">
                <img :src="'/assets/images/wap_logo.png' | assets" alt="">
            </a>
            <a class="search-entry" @click="tapSearch">
                <i class="fa fa-search"></i>
                <span>搜索商品, 共{{ subtotal ? subtotal.goods : 0 }}款好物</span>
            </a>
            <a v-if="isGuest" @click="tapLogin">登录</a>
            <a v-if="!isGuest" @click="tapMessage">
                <i class="fa fa-comment-dots"></i>
            </a>
        </header>

        <div class="has-header">

            <div class="banner">
                <mt-swipe :auto="4000">
                    <mt-swipe-item v-for="(item, index) in banners" :key="index">
                        <img :src="item.content" width="100%" alt="">
                    </mt-swipe-item>
                </mt-swipe>
            </div>

            <div class="menu-box">
                <a v-for="(item, index) in categories" :key="index" class="menu-item">
                    <img class="menu-icon" :src="item.icon" alt="">
                    <div class="menu-name">{{ item.name }}</div>
                </a>
            </div>
            <div class="home-panel" v-if="items && items.length > 0">
                <div class="panel-header">最新商品</div>
                <div class="goods-list">
                    <div class="item-view" v-for="(item, index) in data.best_products" :key="index" @enter="tapProduct" :item="item" @addCart="tapAddCart">
                        <div class="item-img">
                            <a @click="tapProduct"><img :src="item.thumb" alt=""></a>
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

            <div class="home-panel" v-if="items && items.length > 0">
                <div class="panel-header">热门商品</div>
                <div class="goods-list">
                    <div class="item-view" v-for="(item, index) in data.best_products" :key="index" @enter="tapProduct" :item="item" @addCart="tapAddCart">
                        <div class="item-img">
                            <a @click="tapProduct"><img :src="item.thumb" alt=""></a>
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

            <div class="home-panel" v-if="items && items.length > 0">
                <div class="panel-header">推荐商品</div>
                <div class="goods-list">
                    <div class="item-view" v-for="(item, index) in data.best_products" :key="index" @enter="tapProduct" :item="item" @addCart="tapAddCart">
                        <div class="item-img">
                            <a @click="tapProduct"><img :src="item.thumb" alt=""></a>
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
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app';

const app = getApp<IMyApp>();

class Index implements IPage {
    data: any;

    onLoad() {
        app.globalData;
    }
}

Page(new Index());
</script>
<style lang="scss" scoped>

</style>
