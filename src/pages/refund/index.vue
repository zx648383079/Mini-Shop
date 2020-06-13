<template>
    <div>
        <div class="tab-bar order-header">
                <a v-for="(item, index) in status_list" :key="index" @click="tapStatus" data-status="{{ item.status }}" :class="status == item.status ? 'active' : ''">{{ item.name }}</a>
        </div>

        <div class="order-box">
            <div>
                <div class="goods-list">
                    <div class="goods-item" v-for="(item, index) in items" :key="index">
                        <div class="goods-img">
                            <img :src="item.thumb" alt="">
                        </div>
                        <div class="goods-info">
                            <h4>{{ item.name }}</h4>
                            <span class="amount"> x {{ item.amount }}</span>
                            <a class="action" @click="tapApply(item)">申请售后</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { WxPage, WxJson, TouchEvent } from '../../../typings/wx/lib.vue';
import { IOrderGoods } from '../../api/model';
import { getRefundGoodsList } from '../../api/order';

interface IPageData {
    status_list: any[],
    items: IOrderGoods[],
    status: number,
    has_more: boolean,
    page: number,
    isLoading: boolean
}
@WxJson({
    navigationBarTitleText: "售后管理",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white",
    enablePullDownRefresh: true,
    onReachBottomDistance: 10,
})
export class Index extends WxPage<IPageData> {
    public data: IPageData = {
        status_list: [
            {
                name: '售后申请',
                status: 0
            },
            {
                name: '处理中',
                status: 1
            },
            {
                name: '记录',
                status: 2
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
        this.setData({
            items: [],
            isLoading: false,
            has_more: true
        });
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
        getRefundGoodsList({
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

    /**
     * tapApply
     */
    public tapApply(item: IOrderGoods) {
        wx.navigateTo({
            url: 'create?goods=' + item.id
        });
    }
}
</script>
<style lang="scss" scoped>
.order-box {
    .goods-list {
        .goods-item {
            margin-bottom: 10px;
            .goods-info {
                .amount {
                    position: static;
                }
                .action {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    display: block;
                    border: 1px solid red;
                    border-radius: 10px;
                    line-height: 30px;
                    padding: 0 10px;
                    font-size: 16px;
                }
            }
        }
    }
}

</style>
