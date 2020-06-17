<template>
    <div>
        <div class="has-footer">
            <div class="tab-bar order-header">
                <span v-for="(item, index) in status_list" :key="index" @click="tapStatus" data-status="{{ item.status }}" class="{{status == item.status ? 'active' : ''}}">{{ item.name }}</span>
            </div>

            <div>
                <div class="order-item" v-for="(item, index) in items" :key="index">
                    <div class="order-header">
                        <span>{{ item.id }}</span>
                        <span class="status">{{ item.status_label }}</span>
                    </div>
                     <div class="order-amount">
                        <span>【{{ item.service.name }}】</span>
                        <span class="price">
                            服务费：￥{{ item.order_amount }}
                        </span>
                    </div>
                    <div class="order-remark" v-if="item.status >= 10 && item.status <= 60">
                        <p class="line-item" v-for="(line, j) in item.remark" :key="j">
                            <span>{{ line.label }}</span>
                            <span class="val">{{ line.value }}</span>
                        </p>
                    </div>
                    <div class="order-footer">
                        <div class="order-actions">
                            <span @click="tapTaken(index)" v-if="item.status == 40">结单</span>
                        </div>
                    </div>
                </div>
                <div class="empty-box" v-if="items.length < 1">
                    还没有接单哦
                </div>
            </div>
        </div>

        <footer class="tab-bar">
            <a href="room" open-type="redirect">
                <i class="fa fa-gift" aria-hidden="true"></i>
                接单大厅
            </a>
            <a class="active">
                <i class="fa fa-user" aria-hidden="true"></i>
                已接的单
            </a>
        </footer>
    </div>
</template>
<script lang="ts">
import { WxPage, WxJson, TouchEvent } from '../../../typings/wx/lib.vue';
import { ILegworkOrder } from '../../api/model';
import { runnerTaken, getRunnerOrders } from '../../api/legwork';

interface IPageData {
    status_list: any[],
    items: ILegworkOrder[],
    status: number,
    hasMore: boolean,
    page: number,
    isLoading: boolean
}
@WxJson({
    navigationBarTitleText: "已接的单",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white",
    enablePullDownRefresh: true,
    onReachBottomDistance: 10,
})
export class Runner extends WxPage<IPageData> {
    public data: IPageData = {
        status_list: [
            {
                name: '全部',
                status: 0
            },
            {
                name: '待执行',
                status: 40
            },
            {
                name: '待评价',
                status: 60
            },
            {
                name: '已完成',
                status: 80
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
        getRunnerOrders({
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

    public tapTaken(i: number) {
        let data = this.data;
        const item = data.items[i];
        runnerTaken(item.id).then(_ => {
            wx.showToast({
                title: '此单成功结单',
            });
            this.tapRefresh();
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
.order-item {
    background-color: #fff;
    margin-bottom: 10px;
    .order-header {
        line-height: 30px;

        .status {
            float: right;
        }
    }

    .order-amount {
        background-color: #f4f4f4;
        .price {
            float: right;
        }
    }
    .order-actions {
        text-align: right;
        text {
            margin-left: 5px;
        }
    }
}

.order-remark {
    border: 1px double #ccc;
    .line-item {
        color: #777;
        .val {
            float: right;
        }
    }
}
</style>