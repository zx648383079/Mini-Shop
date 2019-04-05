<template>
    <div>
        <div class="has-header checkout-box" v-if="order">
            <div class="money-header">
                <em>￥</em>
                {{ order.order_amount }}
            </div>
            <div class="checkout-amount">
                <p class="line-item"><span>商品总价</span> <span>{{ order.goods_amount | price }}</span> </p>
                <p class="line-item"><span>运费</span> <span>{{ order.shipping_fee | price }}</span> </p>
                <p class="line-item"><span>订单总价</span> <span>{{ order.order_amount | price }}</span> </p>
            </div>
            <div class="payment-item" v-if="payment" :class="{active: payment.id == order.payment_id}" @click="tapSelected(payment)">
                <div class="icon">
                    <img :src="payment.icon" alt="">
                </div>
                <div class="name">{{ payment.name }}</div>
                <div class="status">
                    <i class="fa"></i>
                </div>
            </div>
            <div v-if="payment_list && payment_list.length > 0">
                <div class="payment-hr">选择其他支付方式</div>
                <div class="payment-list">
                    <div class="payment-item" v-for="(item, index) in payment_list" :key="index"  :class="{active: item.id == order.payment_id}"  @click="tapSelected(item)">
                        <div class="icon">
                            <i class="fab fa-weixin"></i>
                        </div>
                        <div class="name">{{ item.name }}</div>
                        <div class="status">
                            <i class="fa"></i>
                        </div>
                    </div>
                </div>
            </div>
            

            <div class="fixed-footer">
                <button class="btn" @click="tapPay">立即支付</button> 
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

export class Pay extends WxPage<IPageData> {
    public order: IOrder | null = null;
    public payment: IPayment | null = null;
    public payment_list: IPayment[] = [];

    public created() {
        const id = parseInt(this.$route.params.id);
        if (!id) {
            Toast('订单错误');
            this.$router.push('/');
            return;
        }
        dispatchOrder(id).then(res => {
            if (res.status != ORDER_STATUS.UN_PAY) {
                Toast('订单无法支付');
                this.$router.push('/');
                return;
            }
            this.order = res;
            this.refreshPayment();
        });
    }

    public tapSelected(item: IPayment) {
        if (!this.order) {
            return;
        }
        this.order.payment_id = item.id;
    }

    public refreshPayment() {
        getPaymentList().then(res => {
            if (!res.data) {
                return;
            }
            this.payment_list = [];
            for (const item of res.data) {
                if (this.order && item.id == this.order.payment_id) {
                    this.payment = item;
                    continue;
                }
                this.payment_list.push(item);
            }
        });
    }

    tapPay() {
        if (!this.payment || !this.order) {
            Toast('请选择支付方式');
            return;
        }
        payOrder(this.order.id, this.payment.id).then(res => {
            if (res.data) {
                this.doPay(res.data);
            }
        });
    }

    doPay(data: IPrePay) {
        if (!this.order) {
            return;
        }
        if (data.success) {
            this.$router.replace('/order/' + this.order.id);
            return;
        }
        if (data.url) {
            window.location.href = data.url;
            return;
        }
        if (data.html) {
            const div = document.createElement('div');
            div.innerHTML = data.html;
            document.body.appendChild(div);
            return;
        }
        if (data.params) {
            
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
