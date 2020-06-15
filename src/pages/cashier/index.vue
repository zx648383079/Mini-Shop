<template>
    <div>
        <div class="has-footer checkout-box">
            <AddressLine :address="address" @click="tapAddress"/>

            <PaymentLine v-model="payment" :items="payment_list"/>
            
            <div class="goods-list" v-for="(item, index) in cart" :key="index">
                <div class="group-header">
                    <span>{{ item.name }}</span>
                </div>
                <div class="goods-item" v-for="(goods, i) in item.goods_list" :key="i">
                    <div class="goods-img">
                        <img :src="goods.goods.thumb" alt="">
                    </div>
                    <div class="goods-info">
                        <h4>{{ goods.goods.name }}</h4>
                        <span class="price">￥{{ goods.price }}</span>
                        <span class="amount"> x {{ goods.amount }}</span>
                    </div>
                </div>
                <ShippingLine v-model="shipping" :items="shipping_list"/>
                
            </div>

            <InvoiceLine v-model="invoice"/>
            <CouponLine v-model="coupon"/>
            

            <div class="checkout-amount" v-if="order">
                <p class="line-item"><span>商品总价</span> <span data-key="goods_amount">￥{{ order.goods_amount }}</span> </p>
                <p class="line-item"><span>+运费</span> <span data-key="shipping_fee">￥{{ order.shipping_fee }}</span> </p>
                <p class="line-item"><span>+支付手续费</span> <span data-key="pay_fee">￥{{ order.pay_fee }}</span> </p>
                <p class="line-item"><span>-优惠</span> <span data-key="discount">￥{{ order.discount }}</span> </p>
                <p class="line-item"><span>订单总价</span> <span data-key="order_amount">￥{{ order.order_amount }}</span> </p>
            </div>

            <div class="address-tip" v-if="address">
                {{ address.region.full_name }} {{ address.address }}
            </div>
            <div class="checkout-footer" v-if="order">
                <span data-key="order_amount">{{ order.order_amount }}</span>
                <div @click="tapCheckout" class="btn">立即支付</div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app.vue';
import { WxPage, WxJson, CustomEvent } from '../../../typings/wx/lib.vue';
import { IAddress, IOrder, IPayment, IShipping, ICartItem, ICartGroup } from '../../api/model';
import { getPaymentList, getShippingList, previewOrder, checkoutOrder } from '../../api/cart';
const app = getApp<IMyApp>();

interface IPageData {
    address: IAddress | null,
    address_list: IAddress[],
    cart: ICartGroup[],
    order: IOrder| null,
    payment_list: IPayment[],
    payment: IPayment| null,
    shipping_list: IShipping[],
    shipping: IShipping| null,
    cart_box: ICartBox | null,
    invoice: any,
    coupon: any
}

interface ICartBox {
    type: number,
    goods: ICartItem[] | number[];
}
@WxJson({
    usingComponents: {
        AddressLine: 'Child/AddressLine',
        CouponLine: 'Child/CouponLine',
        InvoiceLine: 'Child/InvoiceLine',
        PaymentLine: 'Child/PaymentLine',
        ShippingLine: 'Child/ShippingLine',
    },
    navigationBarTitleText: "结算",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})
export class Index extends WxPage<IPageData> {

    public data: IPageData = {
        address: null,
        address_list: [],
        cart: [],
        order: null,
        payment_list: [],
        payment: null,
        shipping_list: [],
        shipping: null,
        cart_box: null,
        invoice: null,
        coupon: null
    };

    public onLoad() {
        let cart = app.globalData.cart;
        if (!cart || cart.length < 1) {
            wx.switchTab({
                url: '/pages/cart/index'
            });
            return;
        }
        this.setData({
            cart: cart.map(item => {
                item.goods_list = this.formatName(item.goods_list);
                return item;
            }),
            cart_box: this.getGoodsIds(cart)
        });
        app.getAddress().then(res => {
            this.setData({
                address: res || null,
                address_list: app.globalData.addressList
            });
            this.onAddressChanged();
        });
        getPaymentList().then(res => {
            if (res.data) {
                this.setData({
                    payment_list: res.data
                });
            }
        });
    }

    public onAddressChanged() {
        this.refreshPrice();
        if (!this.data.address || !this.data.cart_box) {
            return;
        }
        getShippingList(this.data.cart_box.goods, this.data.address.id, this.data.cart_box.type).then(res => {
            if (res.data) {
                this.setData({
                    shipping_list: res.data
                });
            }
        })
    }

    public paymentChanged(e: CustomEvent) {
        this.setData({
            payment: e.detail
        });
        this.refreshPrice();
    }

    public shippingChanged(e: CustomEvent) {
        this.setData({
            shipping: e.detail
        });
        this.refreshPrice();
    }

    public refreshPrice() {
        if (!this.data.address || !this.data.cart_box) {
            return;
        }
        previewOrder(
            this.data.cart_box.goods, 
            this.data.address.id, 
            this.data.shipping ? this.data.shipping.id : 0, this.data.payment ? this.data.payment.id : 0, this.data.cart_box.type).then(res => {
            this.setData({
                order: res
            });
        });
    }

    public tapCheckout() {
        if (!this.data.address || !this.data.cart_box || !this.data.shipping || !this.data.payment) {
            return;
        }
        checkoutOrder(
            this.data.cart_box.goods, 
            this.data.address.id, this.data.shipping.id, this.data.payment.id, this.data.cart_box.type).then(res => {
            app.globalData.cart = [];
            app.globalData.order = res;
            wx.navigateTo({
                url: 'pay?id=' + res.id
            });
        });
    }

    public tapAddress() {
        if (!this.data.address_list || this.data.address_list.length < 1) {
            wx.navigateTo({
                url: '/pages/address/edit?back=1'
            });
            return;
        }
        wx.navigateTo({
            url: '/pages/address/index?selected=' + (this.data.address ? this.data.address.id : '0')
        });
    }



    public getGoodsIds(carts: ICartGroup[]): ICartBox {
        if (!carts || carts.length < 1) {
            return {type: 0, goods: []};
        }
        let goods: ICartItem[] = [],
            cart: number[]  = [],
            type: number = -1;
        for (const group of carts) {
            for (const item of group.goods_list) {
                if (type == -1) {
                    type = item.id && item.id > 0 ? 0 : 1; 
                }
                if (type > 0) {
                    goods.push({
                        goods_id: item.goods_id,
                        amount: item.amount,
                    });
                    continue;
                }
                cart.push(item.id as number);
            }
        }
        return type > 0 ? {type, goods} : {type, goods: cart};
    }

    private formatName(res: any[]): any[] {
        return res.map(item => {
            if (item.goods.name.length > 15) {
                item.goods.name = item.goods.name.substr(0, 15) + '...';
            }
            if (item.buttons) {
                item.buttons = undefined;
            }
            return item;
        });
    }
}
</script>
<style lang="scss" scoped>
page {
    background-color:#f4f4f4;
}
.address-tip {
    background-color: bisque;
    color: red;
    line-height: 30px;
    position: fixed;
    bottom: 40px;
    left: 0;
    width: 100%;
    z-index: 97;
}
.has-footer {
    margin-bottom: 5.625rem;
}
</style>
