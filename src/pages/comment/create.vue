<template>
    <div>
        <CommentItem v-for="(item, index) in items" :key="index" :item="item" @commented="tapCommented(index)"/>
    </div>
</template>
<script lang="ts">
import { WxJson, WxPage } from '../../../typings/wx/lib.vue';
import { IOrderGoods } from '../../api/model';
import { getUnCommentGoods } from '../../api/order';

interface IPageData {
    items: IOrderGoods[]
}
@WxJson({
    usingComponents: {
        CommentItem: 'Child/CommentItem'  
    },
    navigationBarTitleText: "评价晒单",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white",
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
            this.setData({
                items: res.data
            });
        });
    }

    public tapCommented(i: number) {
        if (this.items.length < 2) {
            wx.navigateBack({
                delta: 0
            });
            return;
        }
        let items = this.data.items;
        items.splice(i, 1);
        this.setData({
            items
        });
    }
}
</script>
<style lang="scss" scoped>

</style>
