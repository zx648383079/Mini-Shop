<template>
    <div>
        <div class="checkout-box" v-if="order">
            <div class="money-header">
                <em>￥</em>
                {{ order.order_amount }}
            </div>
            <div class="checkout-amount">
                <p class="line-item"><span>商品总价</span> <span>￥{{ order.goods_amount }}</span> </p>
                <p class="line-item"><span>运费</span> <span>￥{{ order.shipping_fee }}</span> </p>
                <p class="line-item"><span>订单总价</span> <span>￥{{ order.order_amount }}</span> </p>
            </div>
            <div class="payment-item {{payment.id == order.payment_id ? 'active' : ''}}" v-if="payment" @click="tapMainSelected">
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
                    <div class="payment-item {{item.id == order.payment_id ? 'active' : ''}}" v-for="(item, index) in payment_list" :key="index"  @click="tapSelected" data-i="{{index}}">
                        <div class="icon">
                            <i class="fa fa-weixin"></i>
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
} from '../../app.vue';
import { WxPage, WxJson, TouchEvent } from '../../../typings/wx/lib.vue';
import { IOrder, IPayment, ORDER_STATUS, IPrePay } from '../../api/model';
import { getPaymentList } from '../../api/cart';
import { payOrder } from '../../api/order';
const app = getApp<IMyApp>();

interface IPageData {
    order: IOrder | null,
    payment: IPayment | null,
    payment_list: IPayment[]
}
@WxJson({
    navigationBarTitleText: "支付",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})
export class Pay extends WxPage<IPageData> {

    public data: IPageData = {
        order: null,
        payment: null,
        payment_list: []
    }

    public onLoad(query?: any) {
        const id = parseInt(query.id);
        if (!id) {
            wx.showToast({
                title: '订单错误'
            });
            wx.switchTab({
                url: '/pages/index/index'
            });
            return;
        }
        app.getOrder(id).then(res => {
            if (res.status != ORDER_STATUS.UN_PAY) {
                wx.showToast({
                    title: '订单无法支付'
                });
                 wx.switchTab({
                    url: '/pages/index/index'
                });
                return;
            }
            this.setData({
                order: res
            });
            this.refreshPayment();
        });
    }

    /**
     * tapMainSelected
     */
    public tapMainSelected() {
        if (!this.data.order || !this.data.payment) {
            return;
        }
        let order = this.data.order;
        order.payment_id = this.data.payment.id;
        this.setData({
            order
        });
    }

    public tapSelected(e: TouchEvent) {
        if (!this.data.order) {
            return;
        }
        let order = this.data.order;
        order.payment_id = this.data.payment_list[e.currentTarget.dataset.i as number].id;
        this.setData({
            order
        });
    }

    public refreshPayment() {
        getPaymentList().then(res => {
            if (!res.data) {
                return;
            }
            let payment_list = [];
            for (const item of res.data) {
                if (this.data.order && item.id == this.data.order.payment_id) {
                    this.setData({
                        payment: item
                    });
                    continue;
                }
                payment_list.push(item);
            }
            this.setData({
                payment_list
            });
        });
    }

    tapPay() {
        if (!this.data.payment || !this.data.order) {
            wx.showToast({
                title: '请选择支付方式'
            });
            return;
        }
        payOrder(this.data.order.id, this.data.payment.id).then(res => {
            if (res.data) {
                this.doPay(res.data);
            }
        });
    }

    doPay(data: IPrePay) {
        if (!this.data.order) {
            return;
        }
        let order_id = this.data.order.id;
        if (data.success) {
            wx.redirectTo({
                url: '/pages/order/detail?id=' + order_id
            });
            return;
        }
        if (data.url) {
            //data.url
            return;
        }
        if (data.html) {
            // const div = document.createElement('div');
            // div.innerHTML = data.html;
            // document.body.appendChild(div);
            return;
        }
        if (data.params) {
            wx.requestPayment({
                timeStamp: data.params.timeStamp,
                nonceStr: data.params.nonceStr,
                package: data.params.package,
                signType: data.params.signType as any,
                paySign: data.params.paySign,
                success() {
                    wx.showToast({
                        title: '支付成功'
                    });
                    wx.redirectTo({
                        url: '/pages/order/detail?id=' + order_id
                    });
                },
                fail(res) { 
                    wx.showToast({
                        title: '支付失败,'+ res.errMsg
                    });
                    wx.redirectTo({
                        url: '/pages/order/detail?id=' + order_id
                    });
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
