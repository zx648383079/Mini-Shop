<template>
    <div>
        <BackHeader title="我的订单"/>
        <div class="has-header">
            <div class="tab-bar order-header">
                <a v-for="(item, index) in status_list" :key="index" @click="tapStatus(item)" :class="status == item.status ? 'active' : ''">{{ item.name }}</a>
            </div>

            <div class="order-box">
                <PullToRefresh :loading="isLoading" :more="has_more" @refresh="tapRefresh" @more="tapMore">
                    <OrderItem v-for="(item, index) in items" :key="index" :item="item" @receive="tapReceive(item)" @cancel="tapCancel(item)"/>
                    <div class="order-empty" v-if="!items || items.length < 1">
                        您还没有订单
                    </div>
                </PullToRefresh>
            </div>
        </div>

    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app';
import { WxJson, WxPage } from '../../../typings/wx/lib.wx.page';
const app = getApp<IMyApp>();

interface IPageData {
}
@WxJson({
    navigationBarTitleText: "我的订单",
    navigationBarBackgroundColor: "#f4f4f4",
    navigationBarTextStyle: "black"
})
export class Index extends WxPage<IPageData> {
    public status_list = [
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
    ];
    public items: IOrder[] = [];
    public status = 0;
    public has_more = true;
    public page = 1;
    public isLoading = false;

    public created() {
        if (this.$route.query && this.$route.query.status) {
            this.status = parseInt(this.$route.query.status + '') || 0;
        }
        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.has_more) {
            return;
        }  
        this.goPage(this.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        getOrder({
            status: this.status,
            page,
        }).then(res => {
            this.has_more = res.paging.more;
            this.isLoading = false;
            if (this.page < 2) {
                this.items = res.data as never[];
                return;
            }
            this.items = [].concat(this.items as never[], res.data as never[]);
        });
    }

    public tapStatus(item: any) {
        if (this.status == item.status) {
            return;
        }
        this.status = item.status;
        this.tapRefresh();
    }

    public tapReceive(item: IOrder) {
        MessageBox.confirm('确认取消此订单？').then(action => {
            if (action !== 'confirm') {
                return;
            }
            receiveOrder(item.id).then(res => {
                this.refreshItem(res);
            });
        });
    }

    public refreshItem(item: IOrder) {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].id !== item.id) {
                continue;
            }
            if (this.status > 0 && item.status !== this.status) {
                this.items.splice(i, 1);
                break;
            }
            this.items[i] = item;
            break;
        }
        this.$forceUpdate();
    }

    public tapCancel(item: IOrder) {
        MessageBox.confirm('确认取消此订单？').then(action => {
            if (action !== 'cancel') {
                return;
            }
            cancelOrder(item.id).then(res => {
                this.refreshItem(res);
            })
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
