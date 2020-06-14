<template>
    <div>
        <div class="has-double-footer">
            <div class="order-mini-item" v-for="(item, index) in items" :key="index">
                <i class="fa check-box" :class="{active: item.checked}" @click="toggleCheck(index)"></i>
                <div class="info">
                    <div class="name">{{ item.series_number }}</div>
                    <p>{{ item.created_at }}</p>
                </div>
                <div class="amount">
                    ￥{{ item.goods_amount }}
                </div>
            </div>
            <div class="empty-box" v-if="!items || items.length < 1">
                可开票订单为空
            </div>
        </div>
        <div class="invoice-footer" v-if="items && items.length > 0">
            <div @click="toggleCheckAll">
                <i class="fa check-box" :class="{active: checkedAll}"></i>
                全选
            </div>
            <div>
                已选择{{ selectedCount }}笔订单
            </div>
            <div>
                <p>可开票金额￥{{ total }}</p>
                <p>已选金额￥{{ selectedMoney }}</p>
            </div>
            <div>
                <div class="btn" @click="tapApplay">立即开票</div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { WxJson, WxPage } from '../../../typings/wx/lib.vue';
import { IOrder } from '../../api/model';
import { getOrderList } from '../../api/invoice';

interface IPageData {
    items: IOrder[];
    checkedAll: boolean;
    selectedCount: number;
    selectedMoney: number;
    total: number;
}
@WxJson({
    navigationBarTitleText: "申请开票",
    navigationBarBackgroundColor: "#f4f4f4",
    navigationBarTextStyle: "black"
})
export class Apply extends WxPage<IPageData> {
    public data: IPageData = {
        items: [],
        checkedAll: false,
        selectedCount: 0,
        selectedMoney: 0,
        total: 0
    };

    onLoad() {
        getOrderList().then(res => {
            if (!res.data) {
                return;
            }
            this.setData({
                items: res.data
            });
        });
    }

    public toggleCheckAll() {
        this.data.checkedAll = !this.data.checkedAll;
        for (const item of this.data.items) {
            item.checked = this.data.checkedAll;
        }
        this.refresh();
    }

    public toggleCheck(i: number) {
        const item = this.data.items[i];
        item.checked = !item.checked;
        if (!item.checked) {
            this.data.checkedAll = false;
        }
        this.refresh();
    }

    private refresh() {
        const data = this.data;
        data.total = 0;
        data.selectedCount = 0;
        data.selectedMoney = 0;
        for (const item of data.items) {
            data.total += item.goods_amount;
            if (!item.checked) {
                continue;
            }
            data.selectedCount ++;
            data.selectedMoney += item.goods_amount;
        }
        this.setData(data);
    }

    public tapApplay() {

    }
}
</script>
<style lang="scss" scoped>
page {
    background-color: #f4f4f4;
}
</style>
