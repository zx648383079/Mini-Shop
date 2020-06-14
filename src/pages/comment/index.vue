<template>
    <div>
        <div class="tab-bar order-header">
            <a v-for="(item, index) in status_list" :key="index" @click="tapStatus" data-status="{{item.status}}" :class="status == item.status ? 'active' : ''">{{ item.name }}</a>
        </div>

        <div class="comment-list-box">
            <div :loading="isLoading" :more="hasMore" @refresh="tapRefresh" @more="tapMore">
                <div class="goods-list">
                    <GoodsItem v-for="(item, index) in items" :key="index" :item="item" @comment="tapComment"/>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { WxJson, WxPage, TouchEvent, CustomEvent } from '../../../typings/wx/lib.vue';
import { IOrderGoods } from '../../api/model';
import { getCommentGoods } from '../../api/order';
interface IPageData {
    status_list: any[],
    items: IOrderGoods[],
    status: number,
    hasMore: boolean,
    page: number,
    isLoading: boolean
}
@WxJson({
    usingComponents: {
        GoodsItem: 'Child/GoodsItem'
    },
    navigationBarTitleText: "评价管理",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white",
    enablePullDownRefresh: true,
    onReachBottomDistance: 10,
})
export class Index extends WxPage<IPageData> {
    public data: IPageData = {
        status_list: [
            {
                name: '待评价',
                status: 0
            },
            {
                name: '已评价',
                status: 1
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
        this.setData({
            items: [],
            isLoading: false,
            hasMore: true
        });
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
        getCommentGoods({
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

    public tapComment(item: CustomEvent) {
        console.log(item);
        
        wx.navigateTo({
            url: 'create?goods=' + item.detail.id 
        });
    }
}
</script>
<style lang="scss" scoped>
page {
    background-color: #f4f4f4;
}
</style>
