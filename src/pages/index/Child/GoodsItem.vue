<template>
    <div class="item-view">
        <div class="item-img">
            <a href="/pages/goods/index?id={{ item.id }}"><img :src="item.thumb" alt="" mode="widthFix"></a>
        </div>
        <div class="item-title">
            {{ item.name }}
        </div>
        <div class="item-actions">
            <span class="item-price">{{ item.price | price }}
            </span>
            <span @click="tapAddCart">加入购物车</span>
        </div>
    </div>
</template>
<script lang="ts">
import { WxComponent, WxJson, WxMethod } from "../../../../typings/wx/lib.vue";

interface IComponentData {
    item?: Object
}

@WxJson({
    component: true
})
export class GoodsPanel extends WxComponent<IComponentData>  {
    public options = {
        addGlobalClass: true,
    };

    @WxMethod()
    tapAddCart() {
        this.triggerEvent('addCart', this.data.item);
    }
}
</script>
