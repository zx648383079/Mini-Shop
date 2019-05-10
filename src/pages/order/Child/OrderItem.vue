<template>
    <div class="order-item">
        <div class="order-header">
            <span>{{ item.series_number }}</span>
            <span class="status">{{ item.status_label }}</span>
        </div>
        <div class="goods-list" v-if="item.goods">
            <div class="goods-item" v-for="(goods, index) in item.goods" :key="index">
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
            共 {{ item.goods.length }} 件 合计：{{ item.goods_amount }}
        </div>
        <div class="order-footer">
            <div class="order-actions">
                <a @click="tapPay" v-if="item.status == ORDER_STATUS.UN_PAY">支付</a>
                <a @click="tapOrder">详情</a>
                <a @click="tapReceive" v-if="item.status == ORDER_STATUS.SHIPPED">确认收货</a>
                <a @click="tapComment" v-if="item.status == ORDER_STATUS.RECEIVED">评价</a>
                <a @click="tapRefund" v-if="item.status == ORDER_STATUS.SHIPPED || item.status == ORDER_STATUS.PAID_UN_SHIP">申请退款</a>
                <a @click="tapRefund" v-if="item.status == ORDER_STATUS.RECEIVED">退换货</a>
                <a @click="tapRefund" v-if="item.status == ORDER_STATUS.FINISH">售后</a>
                <a @click="tapCancel" v-if="item.status == ORDER_STATUS.UN_PAY || item.status == ORDER_STATUS.PAID_UN_SHIP">取消</a>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { WxComponent, WxJson } from "../../../../typings/wx/lib.wx.page";
import { ORDER_STATUS, IOrder } from "../../../api/model";

interface IComponentPage {
    item: IOrder
}

@WxJson({
    component: true,
})
export class OrderItem extends WxComponent<IComponentPage>  {
    public ORDER_STATUS = ORDER_STATUS;

    public options = {
        addGlobalClass: true,
    };

    public properties = {
        item: Object,
    }

    public tapPay() {
        if (!this.data.item) {
            return;
        }
        wx.navigateTo({
            url: '/pages/pay/index?id=' + this.data.item.id
        });
    }

    public tapOrder() {
        if (!this.data.item) {
            return;
        }
        wx.navigateTo({
            url: 'detail?id=' + this.data.item.id
        });
    }

    public tapRefund() {
        if (!this.data.item) {
            return;
        }
        wx.navigateTo({
            url: '/pages/refund/create?order=' + this.data.item.id
        });
    }

    public tapComment() {
        wx.navigateTo({
            url: 'comment?id=' + this.data.item.id
        });
    }

    public tapReceive() {
        this.triggerEvent('receive')
    }

    public tapCancel() {
        this.triggerEvent('cancel')
    }
}
</script>
<style lang="scss" scoped>

</style>