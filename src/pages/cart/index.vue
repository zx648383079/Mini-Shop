<template>
    <div>
        <BackHeader title="我的购物车"></BackHeader>
        <div class="has-header">
            <PullToRefresh >
                <div class="cart-box" >
                    <div class="cart-group-item" >
                        <div class="group-header">
                            <i ></i>
                            <span>{{ item.name }}</span>
                        </div>
                        <div class="swipe-box goods-list">
                            <SwipeRow name="cart-item goods-item" >
                                <i ></i>
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
                <div class="cart-footer" >
                    <i ></i>
                    <span >全选</span>

                    <div class="cart-amount">
                        <span>{{ total() | price }}</span>
                        <a class="btn">结算</a>
                    </div>
                </div>

                <div class="empty-cart-box" >
                    <div v-if="isGuest">
                        <p>登录后可同步购物车中商品</p>
                        <a class="btn">登录</a>
                    </div>
                    <div v-else>
                        <p>购物车时空的</p>
                        <a class="btn">去逛逛</a>
                    </div>
                </div>
            </PullToRefresh>
        </div>
        <TabBar/>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import { ICart, ICartItem } from '@/api/model';
import { getCart } from '@/api/cart';
import { Getter, Action } from 'vuex-class';
import TabBar from '@/components/TabBar.vue';
import BackHeader from '@/components/BackHeader.vue';
import SwipeRow from '@/components/SwipeRow.vue';
import PullToRefresh from '@/components/PullToRefresh.vue';
import { dispatchSetCart } from '@/store/dispatches';
import { Toast } from 'mint-ui';

@Component({
    components: {
        TabBar,
        BackHeader,
        SwipeRow,
        PullToRefresh,
    },
})
export default class Index extends Vue {
    items: ICart[] = [];
    checkedAll: boolean = false;
    @Getter('isGuest') isGuest?: boolean;
    public isLoading = false;

    public created() {
        this.tapRefresh();
    }

    public tapRefresh() {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        getCart().then(res => {
            this.isLoading = false;
            if (!res.data) {
                return;
            }
            this.items = res.data;
        }); 
    }

    public total(): number {
        let total = 0;
        if (!this.items || this.items.length < 1) {
            return total;
        }
        for (const item of this.items) {
            for (const cart of item.goods_list) {
                if (cart.checked && cart.price) {
                    total += cart.amount * cart.price;
                }
            }
        }
        return total;
    }

    public toggleCheckAll() {
        this.checkedAll = !this.checkedAll;
        for (const item of this.items) {
            item.checked = this.checkedAll;
            for (const cart of item.goods_list) {
                cart.checked = this.checkedAll;
            }
        }
    }

    public toggleCheckGroup(item: ICart) {
        item.checked = !item.checked;
        for (const cart of item.goods_list) {
            cart.checked = item.checked;
        }
        if (!item.checked) {
            this.checkedAll = false;
        }
        this.$forceUpdate();
    }

    public toggleCheck(item: ICart, cart: ICartItem) {
        cart.checked = !cart.checked;
        if (!cart.checked) {
            this.checkedAll = false;
            item.checked = false;
        }
        this.$forceUpdate();
    }

    public tapCashier() {
        const data: ICart[] = [];
        for (const item of this.items) {
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
            Toast('请选择结算的商品');
            return;
        }
        dispatchSetCart(data).then(() => {
            this.$router.push('/cashier');
        });
    }
}
</script>
<style lang="scss" scoped>
.sss {
    padding: 10px;
}
</style>
