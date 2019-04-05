<template>
    <div>
        <BackHeader title="订单详情"/>
        <div class="has-header order-box" v-if="order">
            <div class="status-header">
                <i class="fa fa-money-bill"></i>
                {{ order.status_label }}
            </div>
            <div class="shipping-box">
                {{ order.shipping_status }}
            </div>
            <div class="address-box" v-if="order.address">
                <i class="fa fa-map-marker"></i>
                <p>
                    <span class="name">{{ order.address.name }}</span>
                    <span class="tel">{{ order.address.tel }}</span>
                </p>
                <p>{{ order.address.region_name }} {{ order.address.address }}</p>
            </div>

            <div class="goods-list" v-if="order.goods">
                    <div class="goods-item" v-for="(goods, index) in order.goods" :key="index">
                        <div class="goods-img">
                            <img :src="goods.thumb" alt="">
                        </div>
                        <div class="goods-info">
                            <h4>{{ goods.name }}</h4>
                            <span class="price">{{ goods.price | price }}</span>
                            <span class="amount"> x {{ goods.amount }}</span>
                        </div>
                    </div>
                </div>
                <div class="order-amount">
                    <p class="text-right">共 {{ order.goods.length }} 件 合计：{{ order.goods_amount }}</p>
                    <p class="line-item"><span>订单号</span> <span>{{ order.series_number }}</span> </p>
                    <p class="line-item"><span>下单时间</span> <span>{{ order.created_at }}</span> </p>
                    <p class="line-item" v-if="order.pay_at > 0"><span>支付时间</span> <span>{{ order.pay_at | time }}</span> </p>
                    <p class="line-item" v-if="order.shipping_at > 0"><span>发货时间</span> <span>{{ order.shipping_at | time }}</span> </p>
                    <p class="line-item" v-if="order.receive_at > 0"><span>签收时间</span> <span>{{ order.receive_at | time }}</span> </p>
                    <p class="line-item" v-if="order.finish_at > 0"><span>完成时间</span> <span>{{ order.finish_at | time }}</span> </p>
                    <hr>
                    <p class="line-item"><span>商品总价</span> <span>{{ order.goods_amount }}</span> </p>
                    <p class="line-item"><span>+运费</span> <span>{{ order.shipping_fee }}</span> </p>
                    <p class="line-item"><span>+支付手续费</span> <span>{{ order.pay_fee }}</span> </p>
                    <p class="line-item"><span>-优惠</span> <span>{{ order.discount }}</span> </p>
                    <p class="line-item"><span>订单总价</span> <span>{{ order.order_amount }}</span> </p>
                </div>
                <div class="order-footer">
                    <div class="order-actions">
                       <a @click="tapPay" v-if="order.status == ORDER_STATUS.UN_PAY">支付</a>
                        <a @click="tapReceive" v-if="order.status == ORDER_STATUS.SHIPPED">确认收货</a>
                        <a @click="tapComment" v-if="order.status == ORDER_STATUS.RECEIVED">评价</a>
                        <a @click="tapRefund" v-if="order.status == ORDER_STATUS.SHIPPED || order.status == ORDER_STATUS.PAID_UN_SHIP">申请退款</a>
                        <a @click="tapRefund" v-if="order.status == ORDER_STATUS.RECEIVED">退换货</a>
                        <a @click="tapRefund" v-if="order.status == ORDER_STATUS.FINISH">售后</a>
                        <a @click="tapCancel" v-if="order.status == ORDER_STATUS.UN_PAY || order.status == ORDER_STATUS.PAID_UN_SHIP">取消</a>
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

interface IPageData {
}

export class Index extends WxPage<IPageData> {
    public order: IOrder | null = null;
    public ORDER_STATUS = ORDER_STATUS;

    public created() {
        const id = parseInt(this.$route.params.id);
        if (!id) {
            Toast('订单错误');
            this.$router.push('/');
            return;
        }
        dispatchOrder(id).then(res => {
            this.order = res;
        });
    }

    public tapPay() {
        if (!this.order) {
            return;
        }
        this.$router.push({name: 'pay', params: {id: this.order.id + ''}});
    }

    public tapRefund() {
        if (!this.order) {
            return;
        }
        this.$router.push({name: 'refund-create', params: {order: this.order.id + ''}});
    }

    public tapComment() {
        this.$router.push({name: 'comment'});
    }

    public tapReceive() {
        MessageBox.confirm('确认取消此订单？').then(action => {
            if (action !== 'confirm' || !this.order) {
                return;
            }
            receiveOrder(this.order.id).then(res => {
                this.order = res;
            });
        });
    }

    public tapCancel() {
        MessageBox.confirm('确认取消此订单？').then(action => {
            if (action !== 'confirm' || !this.order) {
                return;
            }
            cancelOrder(this.order.id).then(res => {
                this.order = res;
            });
        });
    }
}
</script>
<style lang="scss" scoped>

</style>
