<template>
    <div>
        <div class="tab-bar order-header">
            <span v-for="(item, index) in status_list" :key="index" @click="tapStatus" data-status="{{ item.status }}" class="{{status == item.status ? 'active' : ''}}">{{ item.name }}</span>
        </div>

        <div class="order-box">
            <OrderItem v-for="(item, index) in items" :key="index" item="{{item}}" @receive="tapReceive" @cancel="tapCancel"/>
            <div class="empty-box" v-if="!items || items.length < 1">
                您还没有订单
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { WxJson, WxPage, TouchEvent } from '../../../typings/wx/lib.vue';
import { ORDER_STATUS, IOrder } from '../../api/model';
import { getOrder, receiveOrder, cancelOrder } from '../../api/order';

interface IPageData {
    status_list: any[],
    items: IOrder[],
    status: number,
    hasMore: boolean,
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
    onReachBottomDistance: 10,
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
        hasMore: true,
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
        if (!this.data.hasMore) {
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
            wx.stopPullDownRefresh();
            let items = [];
            if (page < 2) {
                items = res.data as never[];
            } else {
                items = [].concat(this.data.items as never[], res.data as never[]);
            }
            this.setData({
                hasMore: res.paging.more,
                isLoading: false,
                page,
                items
            });
        });
    }

    public tapStatus(e: TouchEvent) {
        let status = e.currentTarget.dataset.status; 
        if (this.data.status == status) {
            return;
        }
        this.setData({
            status: status
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
page {
    background-color: #f4f4f4;
}
.tab-bar {
    text {
        color: #fff;
        &.active {
            border-bottom: 2px solid #333;
        }
    }
}

</style>
