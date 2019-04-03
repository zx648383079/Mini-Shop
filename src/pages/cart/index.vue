<template>
    <div>
        <BackHeader title="我的购物车"></BackHeader>
        <div class="has-header">
            <div class="cart-box" v-if="items && items.length > 0">
                <div class="cart-group-item" v-for="(item, index) in items" :key="index">
                    <div class="group-header">
                        <i :class="['fa', 'check-box', item.checked ? 'active' : '']" @click="toggleCheckGroup(item)"></i>
                        <span>{{ item.name }}</span>
                    </div>
                    <div class="swipe-box goods-list">
                        <SwipeRow name="cart-item goods-item" v-for="(cart, i) in item.goods_list" :key="i" :index="cart.id" ref="swiperow">
                            <i :class="['fa', 'check-box', cart.checked ? 'active' : '']" @click="toggleCheck(item, cart)"></i>
                            <div class="goods-img">
                                <img :src="cart.goods.thumb" alt="">
                            </div>
                            <div class="goods-info">
                                <h4>{{ cart.goods.name }}</h4>
                                <span>{{ cart.price | price }}</span>
                                <div class="number-box">
                                    <i class="fa fa-minus"></i>
                                    <input type="text" name="" v-model="cart.amount">
                                    <i class="fa fa-plus"></i>
                                </div>
                            </div>
                        </SwipeRow>
                    </div>
                </div>
            </div>
            <div class="cart-footer"  v-if="items && items.length > 0">
                <i :class="['fa', 'check-box', checkedAll ? 'active' : '']" @click="toggleCheckAll"></i>
                <span @click="toggleCheckAll">全选</span>

                <div class="cart-amount">
                    <span>{{ total() | price }}</span>
                    <a @click="tapCashier" class="btn">结算</a>
                </div>
            </div>

            <div class="empty-cart-box" v-if="!items || items.length < 1">
                <div v-if="isGuest">
                    <p>登录后可同步购物车中商品</p>
                    <a @click="$router.push('/login')" class="btn">登录</a>
                </div>
                <div v-else>
                    <p>购物车时空的</p>
                    <a @click="$router.push('/')" class="btn">去逛逛</a>
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

export class Index extends WxPage<IPageData> {
    data: any;

    onLoad() {
        app.globalData;
    }
}
</script>
<style lang="scss" scoped>

</style>
