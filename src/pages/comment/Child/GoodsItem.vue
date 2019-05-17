<template>
    <div class="goods-item">
        <div class="goods-img">
            <img :src="item.thumb" alt="">
        </div>
        <div class="goods-info">
            <h4>{{ item.name }}</h4>
            <a v-if="item.comment_id < 1" @click="tapComment" class="comment-btn">评价</a>
        </div>
    </div>
</template>
<script lang="ts">
import { WxJson, WxComponent, WxMethod } from "../../../../typings/wx/lib.wx.page";
import { IOrderGoods } from "../../../api/model";

interface IComponentData {
    item?: IOrderGoods[],
}

@WxJson({
    component: true
})
export class GoodsItem extends WxComponent<IComponentData>  {
    public options = {
        addGlobalClass: true,
    };

    public properties = {
        item: Object,
    }

    @WxMethod()
    tapComment() {
        this.triggerEvent('comment', this.data.item);
    }
}
</script>
<style lang="scss" scoped>

</style>
