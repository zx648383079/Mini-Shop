<template>
    <div>
        <div class="has-footer">
            <div class="tab-header">
                <div class="tab-item" v-for="(item, index) in statusList" :key="index" :class="{active: index == status}" @click="tapStatus" data-status="{{ index }}">{{ item }}</div>
            </div>

            <div>
                <div class="my-coupon-item" v-for="(item, index) in items" :key="index" :calss="{expired: item.expired}">
                    <div class="price">
                        <em>¥300</em>
                        <p>满168可用</p>
                    </div>
                    <div class="info">
                        <p>{{ item.name }}</p>
                        <div class="time">
                            <span>2018.12.01-2018.12.01</span>
                            <a href="" v-if="!item.expired">立即使用</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <footer class="tab-bar">
            <a href="index">
                <i class="fa fa-gift" aria-hidden="true"></i>
                领券
            </a>
            <a class="active">
                <i class="fa fa-user" aria-hidden="true"></i>
                我的优惠券
            </a>
        </footer>
    </div>
</template>
<script lang="ts">
import { WxJson, WxPage, TouchEvent } from '../../../typings/wx/lib.vue';
import { getMyCoupon } from '../../api/coupon';

interface IPageData {
    statusList: string[],
    status: number,
    items: any[],
    isExpand: boolean,
    hasMore: boolean,
    page: number,
    isLoading: boolean
}
@WxJson({
    navigationBarTitleText: "我的优惠券",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white",
    enablePullDownRefresh: true,
    onReachBottomDistance: 10,
})
export class My extends WxPage<IPageData> {
    public data: IPageData = {
        statusList: [
            '未使用',
            '使用记录',
            '已过期',
        ],
        status: 0,
        items: [],
        isExpand: false,
        hasMore: true,
        page: 1,
        isLoading: false
    }

    public onLoad() {
        this.tapRefresh();
    }
    onPullDownRefresh() {
        this.tapRefresh();
    }

    onReachBottom() {
        this.tapMore();
    }

    /**
     * tapStatus
     */
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
        getMyCoupon({
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
}
</script>
<style lang="scss" scoped>
page {
    background-color: #f4f4f4;
}
.tab-header {
    background-color: #05a6b1;
    color: #fff;
}
</style>
