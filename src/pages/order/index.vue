<template>
    <div>
        <div class="tab-bar order-header">
            <a v-for="(item, index) in status_list" :key="index" @click="tapStatus(item)" class="{{status == item.status ? 'active' : ''}}">{{ item.name }}</a>
        </div>

        <div class="order-box">
            <div :loading="isLoading" :more="has_more" @refresh="tapRefresh" @more="tapMore">
                <OrderItem v-for="(item, index) in items" :key="index" item="{{item}}" @receive="tapReceive(item)" @cancel="tapCancel(item)"/>
                <div class="order-empty" v-if="!items || items.length < 1">
                    您还没有订单
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app';
import { WxJson, WxPage } from '../../../typings/wx/lib.wx.page';
import { ORDER_STATUS, IOrder } from '../../api/model';
import { getOrder, receiveOrder, cancelOrder } from '../../api/order';
const app = getApp<IMyApp>();

interface IPageData {
    status_list: any[],
    items: IOrder[],
    status: number,
    has_more: boolean,
    page: number,
    isLoading: boolean
}
@WxJson({
    usingComponents: {
        OrderItem: 'Child/OrderItem'
    },
    navigationBarTitleText: "我的订单",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white",
    enablePullDownRefresh: true,
})
export class Index extends WxPage<IPageData> {

    public data: IPageData = {
        status_list: [
            {
                name: '全部',
                status: 0
            },
            {
                name: '待支付',
                status: ORDER_STATUS.UN_PAY
            },
            {
                name: '待收货',
                status: ORDER_STATUS.SHIPPED
            },
            {
                name: '已完成',
                status: ORDER_STATUS.FINISH
            },
            {
                name: '已取消',
                status: ORDER_STATUS.CANCEL
            },
        ],
        items: [],
        status: 0,
        has_more: true,
        page: 1,
        isLoading: false
    }

    public onLoad(query?: any) {
        if (query && query.status) {
            this.setData({
                status: parseInt(query.status + '') || 0
            });
        }
        this.tapRefresh();
    }

    onPullDownRefresh() {
        this.tapRefresh();
    }

    onReachBottom() {
        this.tapMore();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.data.has_more) {
            return;
        }  
        this.goPage(this.data.page + 1);
    }

    public goPage(page: number) {
        if (this.data.isLoading) {
            return;
        }
        this.setData({
            isLoading: true
        });
        getOrder({
            status: this.data.status,
            page,
        }).then(res => {
            let items = [];
            if (page < 2) {
                items = res.data as never[];
            } else {
                items = [].concat(this.data.items as never[], res.data as never[]);
            }
            this.setData({
                has_more: res.paging.more,
                isLoading: false,
                page,
                items
            });
        });
    }

    public tapStatus(item: any) {
        if (this.data.status == item.status) {
            return;
        }
        this.setData({
            status: item.status
        });
        this.tapRefresh();
    }

    public tapReceive(item: IOrder) {
        let that = this;
        wx.showModal({
            title: '提示',
            content: '确认已收到商品？',
            success() {
                receiveOrder(item.id).then(res => {
                    that.refreshItem(res);
                });
            }
        });
    }

    public refreshItem(item: IOrder) {
        let items = this.data.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].id !== item.id) {
                continue;
            }
            if (this.data.status > 0 && item.status !== this.data.status) {
                items.splice(i, 1);
                break;
            }
            items[i] = item;
            break;
        }
        this.setData({
            items
        });
    }

    public tapCancel(item: IOrder) {
        let that = this;
        wx.showModal({
            title: '提示',
            content: '确认取消此订单？',
            success() {
                cancelOrder(item.id).then(res => {
                    that.refreshItem(res);
                })
            }
        });
    }
}
</script>
<style lang="scss" scoped>
.order-empty {
    font-size: 40px;
    color: #ccc;
    text-align: center;
    padding-top: 20vh;
}
</style>
