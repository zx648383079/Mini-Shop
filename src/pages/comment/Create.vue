<template>
    <div>
        <CommentItem v-for="(item, index) in items" :key="index" :item="item" @commented="tapCommented(index)"/>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app';
import { WxJson, WxPage } from '../../../typings/wx/lib.wx.page';
import { IOrderGoods } from '../../api/model';
import { getUnCommentGoods } from '../../api/order';
const app = getApp<IMyApp>();

interface IPageData {
    items: IOrderGoods[]
}
@WxJson({
    navigationBarTitleText: "评价晒单",
    navigationBarBackgroundColor: "#f4f4f4",
    navigationBarTextStyle: "black"
})
export class Create extends WxPage<IPageData> {
    items: IOrderGoods[] = [];

    onLoad(query?: any) {
        getUnCommentGoods(query).then(res => {
            if (!res.data || res.data.length < 1) {
                wx.navigateBack({
                    delta: 0
                });
                return;
            }
            this.items = res.data;
        });
    }

    public tapCommented(i: number) {
        if (this.items.length < 2) {
            wx.navigateBack({
                delta: 0
            });
            return;
        }
        this.items.splice(i, 1);
    }
}
</script>
<style lang="scss" scoped>

</style>
