<template>
    <div>
        <div class="home-panel" v-if="items && items.length > 0">
            <div class="panel-header">{{ title }}</div>
            <div class="goods-list">
                <GoodsItem v-for="(item, index) in items" :key="index" :item="item" @addCart="tapAddCart"></GoodsItem>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { WxComponent, WxJson, WxMethod } from "../../../../typings/wx/lib.vue";
import { IProduct } from "../../../api/model";

interface IComponentData {
    title?: string,
    items?: Object
}

@WxJson({
    usingComponents: {
        GoodsItem: 'GoodsItem'
    },
    component: true
})
export class GoodsPanel extends WxComponent<IComponentData>  {
    public options = {
        addGlobalClass: true,
    };

    @WxMethod()
    tapAddCart(item: IProduct) {
        this.triggerEvent('addCart', item);
    }
}
</script>
