<template>
    <div>
        <div class="has-footer">
            <div>
                <div class="legwork-item" v-for="(item, index) in items" :key="index">
                    <div class="order-header">
                        <span>{{ item.id }}</span>
                        <span class="status">{{ item.status_label }}</span>
                    </div>
                     <div class="order-amount">
                        <span>【{{ item.service.name }}】</span>
                        <span class="amount">x {{ item.amount }}</span>
                        <span class="price">
                            服务费：￥{{ item.order_amount }}
                        </span>
                    </div>
                    <div class="order-footer">
                        <div class="order-actions">
                            <span @click="tapTaking(index)">接单</span>
                        </div>
                    </div>
                </div>
                <div class="empty-box" v-if="items.length < 1">
                    没有可接的单哦
                </div>
            </div>
        </div>

        <footer class="tab-bar">
            <a class="active">
                <i class="fa fa-gift" aria-hidden="true"></i>
                接单大厅
            </a>
            <a href="runner" open-type="redirect">
                <i class="fa fa-user" aria-hidden="true"></i>
                已接的单
            </a>
        </footer>
    </div>
</template>
<script lang="ts">
import { WxPage, WxJson } from '../../../typings/wx/lib.vue';
import { ILegworkOrder } from '../../api/model';
import { getTackingOrders, runnerTacking } from '../../api/legwork';

interface IPageData {
    items: ILegworkOrder[],
    hasMore: boolean,
    page: number,
    isLoading: boolean
}
@WxJson({
    navigationBarTitleText: "接单大厅",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white",
    enablePullDownRefresh: true,
    onReachBottomDistance: 10,
})
export class Room extends WxPage<IPageData> {
    public data: IPageData = {
        items: [],
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
        let data = this.data;
        if (data.isLoading) {
            return;
        }
        data.isLoading = true;
        this.setData(data);
        getTackingOrders({
            page
        }).then(res => {
            wx.stopPullDownRefresh();
            data.hasMore = res.paging.more;
            data.isLoading = false;
            data.items = page < 2 ? res.data : [].concat(data.items as never[], res.data as never[]);
            this.setData(data);
        }, () => {
            this.setData({
                isLoading: false
            });
        })
    }

    public tapTaking(i: number) {
        let data = this.data;
        const item = data.items[i];
        runnerTacking(item.id).then(_ => {
            wx.showToast({
                title: '已接单'
            });
            this.tapRefresh();
        })
    }

}
</script>
<style lang="scss" scoped>
page {
    background-color: #f4f4f4;
}

</style>