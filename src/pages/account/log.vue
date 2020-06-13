<template>
    <div>
        <div v-for="(item, index) in formatItems" :key="index" :class="item.id ? 'log-item' : ''">
            <div class="log-hr" v-if="!item.id">
                {{ item.remark }}
            </div>
            <div v-else>
                <div class="info">
                    <div class="name">{{ item.remark }}</div>
                    <p>{{ item.created_at }}</p>
                </div>
                <div class="amount">
                    {{ item.money > 0 ? '+' + item.money : item.money }}
                </div>
            </div>
        </div>
         <div class="empty-box" v-if="!items || items.length < 1">
            明细为空
        </div>
    </div>
</template>
<script lang="ts">
import { IAccountLog } from '../../api/model';
import { WxPage, WxJson } from '../../../typings/wx/lib.vue';
import { getAccountLog } from '../../api/account';

interface IPageData {
    items: IAccountLog[],
    formatItems: any[],
    page: number,
    hasMore: boolean,
    isLoading: boolean,
}
@WxJson({
    navigationBarTitleText: "明细",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white",
    onReachBottomDistance: 10,
    enablePullDownRefresh: true
})
export class Card extends WxPage<IPageData> {
    
    public data: IPageData = {
        items: [],
        formatItems: [],
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
        if (data.isLoading || !data.hasMore) {
            return;
        }
        data.isLoading = true;
        this.setData(data);
        getAccountLog({
            page,
        }).then(res => {
            wx.stopPullDownRefresh();
            data.hasMore = res.paging.more;
            data.isLoading = false;
            if (!res.data) {
                return;
            }
            data.items = [].concat(data.items as never[], res.data as never[]);
            data.formatItems = this.formatTime(data.items);
            this.setData(data);
        });
    }


    public formatTime(items: any[]) {
        const data = [];
        let last: string = '';
        for (const item of items) {
            let match = (item.created_at + '').match(/(\d{4})-(\d{2})(-\d{2} \d{2}:\d{2})/);
            if (!match) {
                continue;
            }
            let current = match[1] + '年' + match[2] + '月';
            item.created_at = match[2] + match[3];
            if (last == current) {
                data.push(item);
                continue;
            }
            last = current;
            data.push({remark: last}, item);
        }
        return data;
    }
}
</script>
<style lang="scss" scoped>

</style>
