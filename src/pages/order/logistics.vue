<template>
    <div>
        <div v-for="(item, index) in formatItems" :key="index" :class="item.id ? 'log-item' : ''">
            <div class="log-hr" v-if="!item.id">
                {{ item.content }}
            </div>
            <div v-else>
                <div class="info">
                    <div class="name">{{ item.content }}</div>
                    <p>{{ item.created_at }}</p>
                </div>
            </div>
        </div>
         <div class="empty-box" v-if="!items || items.length < 1">
            暂无物流信息
        </div>
    </div>
</template>
<script lang="ts">
import { WxPage, WxJson } from '../../../typings/wx/lib.vue';
import { ILogistics } from '../../api/model';
import { orderLogistics } from '../../api/order';

interface IPageData {
    items: ILogistics[],
    formatItems: any[],
    isLoading: boolean,
    orderId: number,
}
@WxJson({
    navigationBarTitleText: "物流信息",
    navigationBarBackgroundColor: "#f4f4f4",
    navigationBarTextStyle: "black",
    enablePullDownRefresh: true
})
export class Logistics extends WxPage<IPageData> {
    public data: IPageData = {
        items: [],
        formatItems: [],
        isLoading: false,
        orderId: 0,
    }

    public onLoad(option: any) {
        if (!option || option.id < 1) {
            wx.navigateBack({
                delta: 0
            });
            return;
        }
        this.setData({
            orderId: option.id
        });
        this.tapRefresh();
    }

    onPullDownRefresh() {
        this.tapRefresh();
    }

    public tapRefresh() {
        let data = this.data;
        if (data.isLoading) {
            return;
        }
        data.isLoading = true;
        this.setData(data);
        orderLogistics(data.orderId).then(res => {
            wx.stopPullDownRefresh();
            data.isLoading = false;
            if (res.data) {
                data.items = res.data;
                data.formatItems = this.formatTime(data.items);
            }
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
            data.push({content: last}, item);
        }
        return data;
    }
}
</script>
<style lang="scss" scoped>

</style>
