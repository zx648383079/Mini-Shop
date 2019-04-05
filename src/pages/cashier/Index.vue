<template>
    <div>
        <div class="has-header has-footer checkout-box">
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
                        <span class="price">{{ goods.price | price }}</span>
                        <span class="amount"> x {{ goods.amount }}</span>
                    </div>
                </div>
                <ShippingLine v-model="shipping" :items="shipping_list"/>
                
            </div>

            <InvoiceLine v-model="invoice"/>
            <CouponLine v-model="coupon"/>
            

            <div class="checkout-amount" v-if="order">
                <p class="line-item"><span>商品总价</span> <span data-key="goods_amount">{{ order.goods_amount | price }}</span> </p>
                <p class="line-item"><span>+运费</span> <span data-key="shipping_fee">{{ order.shipping_fee | price }}</span> </p>
                <p class="line-item"><span>+支付手续费</span> <span data-key="pay_fee">{{ order.pay_fee | price }}</span> </p>
                <p class="line-item"><span>-优惠</span> <span data-key="discount">{{ order.discount | price }}</span> </p>
                <p class="line-item"><span>订单总价</span> <span data-key="order_amount">{{ order.order_amount | price }}</span> </p>
            </div>

            <div class="address-tip" v-if="address">
                {{ address.region.full_name }} {{ address.address }}
            </div>
            <div class="checkout-footer" v-if="order">
                <span data-key="order_amount">{{ order.order_amount | price }}</span>
                <a @click="tapCheckout" class="btn">立即支付</a>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app';
const app = getApp<IMyApp>();

interface IPageData {
}

interface ICartBox {
    type: number,
    goods: ICartItem[] | number[];
}
export class Index extends WxPage<IPageData> {
    public address: IAddress | null = null;
    address_list?: IAddress[];
    cart?: ICart[];
    public order: IOrder| null = null;
    public payment_list: IPayment[] = [];
    public payment: IPayment| null = null;
    public shipping_list: IShipping[] = [];
    public shipping: IShipping| null = null;
    public cart_box: ICartBox | null = null;
    public invoice = null;
    public coupon = null;

    public created() {
        if (!this.cart || this.cart.length < 1) {
            this.$router.push('/cart');
            return;
        }
        this.cart_box = this.getGoodsIds();
        dispatchAddress().then(res => {
            this.address = res;
        });
        getPaymentList().then(res => {
            if (res.data) {
                this.payment_list = res.data;
            }
        });
    }

    @Watch('address')
    public onAddressChanged() {
        this.refreshPrice();
        if (!this.address || !this.cart_box) {
            return;
        }
        getShippingList(this.cart_box.goods, this.address.id, this.cart_box.type).then(res => {
            if (res.data) {
                this.shipping_list = res.data;
            }
        })
    }

    @Watch('payment')
    public onPaymentChanged() {
        this.refreshPrice();
    }

    @Watch('shipping')
    public onShippingChanged() {
        this.refreshPrice();
    }

    public refreshPrice() {
        if (!this.address || !this.cart_box) {
            return;
        }
        previewOrder(this.cart_box.goods, this.address.id, this.shipping ? this.shipping.id : 0, this.payment ? this.payment.id : 0, this.cart_box.type).then(res => {
            this.order = res;
        });
    }

    public tapCheckout() {
        if (!this.address || !this.cart_box || !this.shipping || !this.payment) {
            return;
        }
        checkoutOrder(this.cart_box.goods, this.address.id, this.shipping.id, this.payment.id, this.cart_box.type).then(res => {
            dispatchSetCart([]);
            dispatchSetOrder(res);
            this.$router.replace('/pay/' + res.id);
        });
    }

    public tapAddress() {
        if (!this.address_list || this.address_list.length < 1) {
            this.$router.push({path: '/address/create', query: {back: '1'}});
            return;
        }
        this.$router.push({name: 'address', query: {selected: (this.address ?this.address.id + '' : '0')}});
    }



    public getGoodsIds(): ICartBox {
        if (!this.cart) {
            return {type: 0, goods: []};
        }
        let goods: ICartItem[] = [],
            cart: number[]  = [],
            type: number = -1;
        for (const group of this.cart) {
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
}
</script>
<style lang="scss" scoped>
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
