<template>
    <div class="order-box" v-if="order">
            <div class="status-header">
                <i class="fa fa-money"></i>
                {{ order.status_label }}
            </div>
            <div class="shipping-box">
                {{ order.shipping_status }}
            </div>
            <div class="address-box" v-if="order.address">
                <i class="fa fa-map"></i>
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
                    <div class="hr"></div>
                    <p class="line-item"><span>商品总价</span> <span>{{ order.goods_amount }}</span> </p>
                    <p class="line-item"><span>+运费</span> <span>{{ order.shipping_fee }}</span> </p>
                    <p class="line-item"><span>+支付手续费</span> <span>{{ order.pay_fee }}</span> </p>
                    <p class="line-item"><span>-优惠</span> <span>{{ order.discount }}</span> </p>
                    <p class="line-item"><span>订单总价</span> <span>{{ order.order_amount }}</span> </p>
                </div>
                <div class="order-footer">
                    <div class="order-actions">
                        <span @click="tapPay" v-if="order.status == ORDER_STATUS.UN_PAY">支付</span>
                        <span @click="tapReceive" v-if="order.status == ORDER_STATUS.SHIPPED">确认收货</span>
                        <span @click="tapComment" v-if="order.status == ORDER_STATUS.RECEIVED">评价</span>
                        <span @click="tapRefund" v-if="order.status == ORDER_STATUS.SHIPPED || order.status == ORDER_STATUS.PAID_UN_SHIP">申请退款</span>
                        <span @click="tapRefund" v-if="order.status == ORDER_STATUS.RECEIVED">退换货</span>
                        <span @click="tapRefund" v-if="order.status == ORDER_STATUS.FINISH">售后</span>
                        <span @click="tapCancel" v-if="order.status == ORDER_STATUS.UN_PAY || order.status == ORDER_STATUS.PAID_UN_SHIP">取消</span>
                    </div>
                </div>

    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app.vue';
import { WxPage, WxJson } from '../../../typings/wx/lib.vue';
import { IOrder, ORDER_STATUS } from '../../api/model';
import { receiveOrder, cancelOrder } from '../../api/order';
const app = getApp<IMyApp>();

interface IPageData {
    order: IOrder | null,
    ORDER_STATUS: any
}
@WxJson({
    navigationBarTitleText: "订单详情",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white",
})
export class Detail extends WxPage<IPageData> {

    public data: IPageData = {
        order: null,
        ORDER_STATUS: ORDER_STATUS
    }

    public onLoad(query?: any) {
        const id = parseInt(query.id);
        if (!id) {
            wx.showToast({
                title: '订单错误'
            });
            wx.switchTab({
                url: '/pages/index/index'
            })
            return;
        }
        app.getOrder(id).then(res => {
            this.setData({
                order: res
            });
        });
    }

    public tapPay() {
        if (!this.data.order) {
            return;
        }
        wx.navigateTo({
            url: '/pages/pay/index?id=' + this.data.order.id
        });
    }

    public tapRefund() {
        if (!this.data.order) {
            return;
        }
        wx.navigateTo({
            url: '/pages/refund/create?order=' + this.data.order.id
        });
    }

    public tapComment() {
        if (!this.data.order) {
            return;
        }
        wx.navigateTo({
            url: '/pages/comment/index?id=' + this.data.order.id
        });
    }

    public tapReceive() {
        let that = this;
        wx.showModal({
            title: '提示',
            content: '确认已收到商品？',
            success() {
                if (!that.data.order) {
                    return;
                }
                receiveOrder(that.data.order.id).then(res => {
                    that.setData({
                        order: res
                    });
                });
            }
        });
    }

    public tapCancel() {
        let that = this;
        wx.showModal({
            title: '提示',
            content: '确认取消此订单？',
            success() {
                if (!that.data.order) {
                    return;
                }
                cancelOrder(that.data.order.id).then(res => {
                    that.setData({
                        order: res
                    });
                });
            }
        });
    }
}
</script>
<style lang="scss" scoped>
page {
    background-color: #f4f4f4;
}
</style>
