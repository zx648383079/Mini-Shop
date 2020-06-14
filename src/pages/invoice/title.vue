<template>
    <div class="slide-box">
        <div class="swipe-box title-list">
            <div class="item" v-for="(item, index) in items" :key="index" :index="item.id">
                <MpSlideView buttons="{{ item.buttons }}" bindbuttontap="slideButtonTap" >
                    <div class="title-item">
                        <div class="name">{{ item.title }}</div>
                        <p v-if="item.title_type > 0">发票类型：{{ item.type < 1 ? '增值税普通发票' : '增值税专用发票' }}</p>
                        <p v-if="item.title_type > 0">税务登记号：{{ item.tax_no }}</p>
                    </div>
                </MpSlideView>
            </div>
        </div>
        <div class="empty-box" v-if="!items || items.length < 1">
            发票抬头为空
        </div>

        <a href="edit" class="add-btn">添加</a>
    </div>
</template>
<script lang="ts">
import { WxJson, WxPage, CustomEvent } from '../../../typings/wx/lib.vue';
import { IInvoiceTitle } from '../../api/model';
import { getTitleList, deleteTitle } from '../../api/invoice';

interface IPageData {
    items: IInvoiceTitle[],
    page: number,
    hasMore: boolean,
    isLoading: boolean,
}
@WxJson({
    usingComponents: {
        MpSlideView: 'weui-miniprogram/slideview/slideview'
    },
    navigationBarTitleText: "发票抬头",
    navigationBarBackgroundColor: "#f4f4f4",
    navigationBarTextStyle: "black",
    onReachBottomDistance: 10,
    enablePullDownRefresh: true,
})
export class Index extends WxPage<IPageData> {
    public data: IPageData = {
        items: [],
        page: 1,
        hasMore: true,
        isLoading: false,
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

    slideButtonTap(e: CustomEvent) {
        let data = this.data;
        const id = e.detail.data as number;
        deleteTitle(id).then(_ => {
            for (let i = 0; i < data.items.length; i++) {
                if (data.items[i].id === id) {
                    data.items.splice(i, 1);
                    break;
                }
            }
            this.setData(data);
        });
    }

    public tapMore() {
        if (!this.data.hasMore) {
            return;
        }
        this.goPage(this.data.page + 1);
    }

    /**
     * refresh
     */
    public tapRefresh() {
        this.goPage(1);
    }

    public goPage(page: number) {
        let data = this.data;
        if (data.isLoading) {
            return;
        }
        data.isLoading = true;
        this.setData(data);
        getTitleList({
            page,
        }).then(res => {
            wx.stopPullDownRefresh();
            data.hasMore = res.paging.more;
            data.isLoading = false;
            if (!res.data) {
                this.setData(data);
                return;
            }
            data.items = [].concat(data.items as never[], res.data as never[]);
            data.items = this.formatButton(data.items);
            this.setData(data);
        });
    }

    private formatButton(res: any[]): any[] {
        return res.map(item => {
            item.buttons = [
                {
                    type: 'warn',
                    text: '删除',
                    data: item.id,
                }
            ];
            return item;
        });
    }
}
</script>
<style lang="scss" scoped>
page {
    background-color: #f4f4f4;
}
</style>
