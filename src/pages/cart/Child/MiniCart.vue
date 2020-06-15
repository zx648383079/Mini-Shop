<template>
    <div class="cart-mini" v-if="cart">
        <div class="popup-cell" v-for="(item, index) in cart.promotion_cell" :key="index">
            {{ item.popup_tip }}
            <a v-if="item.link" decode="true">
                <span decode="true">{{ item.link.text }}&gt;</span>
            </a>
        </div>
        <div class="goods-box" v-show="expaned">
            <div class="header">
                已选商品
                <span class="right" @click="tapClear">
                    <i class="fa fa-trash"></i>
                    清空
                </span>
            </div>
            <div class="group-item" v-for="(group, j) in cart.data" :key="j">
                <div class="item" v-for="(item, index) in group.goods_list" :key="index">
                    <div class="name">{{ item.goods.name }}</div>
                    <div class="price">￥{{ item.price }}</div>
                    <div class="item-actions">
                        <i class="fa fa-minus-circle" v-if="item.amount && item.amount > 0"  @click="tapMinus(index, j)"></i>
                        <span class="amount-input" v-if="item.amount && item.amount > 0">{{ item.amount }}</span>
                        <i class="fa fa-plus-circle" @click="tapPlus(index, j)"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="mini-footer">
            <div class="icon" @click="tapExpand">
                <i class="fa fa-cart"></i>
                <span class="amount-tip" v-if="cart && cart.subtotal.count > 0">{{ cart.subtotal.count > 99 ? '99+' : cart.subtotal.count }}</span>
            </div>
            <div class="subtotal">
                <div class="price">{{ cart.data.length > 0 ? '￥' + cart.subtotal.total : '未选购商品' }}</div>
                <p class="tip" v-if="cart.promotion_cell && cart.promotion_cell.length > 0">另需配送费</p>
                <p class="tip" v-else>已包邮</p>
            </div>
            <div class="checkout">
                {{ cart.checkout_button.text }}
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { WxJson, WxComponent, WxMethod } from "../../../../typings/wx/lib.vue";
import { ICart } from "../../../api/model";
import { updateItem, deleteAll } from "../../../api/cart";

interface IComponentData {
    cart?: ICart,
    expaned: boolean,
}

@WxJson({
    component: true
})
export default class FixedCart extends WxComponent<IComponentData> {

    public options = {
        addGlobalClass: true,
    };

    public properties = {
        cart: Object,
    }

    public data: IComponentData = {
        expaned: false,
    };

    @WxMethod()
    public notifyCart(cart: ICart) {
        this.triggerEvent('change', cart);
    }

    @WxMethod()
    public tapPlus(i: number, j: number) {
        let cart = this.data.cart;
        if (!cart) {
            return;
        }
        const item = cart.data[j].goods_list[i];
        if (!item.amount) {
            item.amount = 0;
        }
        item.amount ++;
        updateItem(item.id as number, item.amount).then(res => {
            this.notifyCart(res);
        });
    }

    @WxMethod()
    public tapMinus(i: number, j: number) {
        let cart = this.data.cart;
        if (!cart) {
            return;
        }
        const item = cart.data[j].goods_list[i];
        if (!item.amount) {
            item.amount = 0;
        }
        item.amount = Math.max(0, item.amount - 1);
        updateItem(item.id as number, item.amount).then(res => {
            this.notifyCart(res);
        });
    }

    
    @WxMethod()
    public tapExpand() {
        let cart = this.data.cart;
        if (!cart || cart.data.length < 1) {
            return;
        }
        let data = this.data;
        data.expaned = !data.expaned;
        this.setData(data);
    }

    @WxMethod()
    public tapClear() {
        deleteAll().then(res => {
            this.setData({
                expaned: false
            });
            this.notifyCart(res);
        });
    }
}
</script>
<style lang="scss" scoped>
navigator {
    display: inline-block;
}
.cart-mini {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    .popup-cell {
        background-color: rgba($color: #e9f16c, $alpha: .7);
        text-align: center;
        font-size: 12px;
        line-height: 20px;
        navigator {
            color: red;
        }
    }
    .goods-box {
        background-color: #ccc;
        .header {
            line-height: 40px;
            height: 40px;
            .right {
                float: right;
                font-size: 12px;
                color: #333;
            }
        }
        .group-item {
            background-color: #fff;
        }
        .item {
            display: grid;
            grid-template-columns: 1fr 40px 80px;
            line-height: 40px;
            border-bottom: 1px solid #eee;
            .name {
                word-break: keep-all;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space:nowrap;
            }
            .price {
                color: red;
            }
            .item-actions {
                text-align: center;
                .amount-input {
                    display: inline-block;
                    padding: 0 5px;
                }
                .fa-minus-circle {
                    color: #777;
                }
            }
        }
    }
    .mini-footer {
        display: grid;
        grid-template-columns: 60px 1fr 80px;
        background-color: rgba($color: #333, $alpha: .9);
        color: #fff;
        height: 50px;
        .icon {
            position: relative;
            font-size: 30px;
            text-align: center;
            line-height: 50px;
            .fa {
                font-size: 30px;
            }
            .amount-tip {
                font-size: 12px;
                position: absolute;
                top: -2px;
                right: 0px;
                color: #fff;
                background-color: red;
                border-radius: 50%;
                display: block;
                width: 20px;
                height: 20px;
                text-align: center;
                line-height: 20px;
            }
        }
        .subtotal {
            padding: 5px 0;
            .tip {
                font-size: 12px;
                color: #ccc;
            }
        }
        .checkout {
            background-color: #1dc267;
            line-height: 50px;
            text-align: center;
        }
    }
}
</style>