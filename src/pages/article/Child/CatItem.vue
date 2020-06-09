<template>
    <div class="item-list">
        <div class="item" v-for="(item, index) in items" :key="index" @click="tapItem" data-i="{{ index }}">
            {{ item.name }}
            <i class="fa fa-chevron-right" aria-hidden="true"></i>
        </div>
    </div>
</template>
<script lang="ts">
import { WxJson, WxComponent, TouchEvent, WxMethod } from "../../../../typings/wx/lib.vue";
import { IArticleCategory } from "../../../api/model";

interface IComponentData {
    items?: IArticleCategory[],
}

@WxJson({
    component: true,
})
export class CatItem extends WxComponent<IComponentData>  {
    public options = {
        addGlobalClass: true,
    };

    public properties = {
        items: Object,
    }
    @WxMethod()
    public tapItem(e: TouchEvent) {
        if (!this.data.items) {
            return;
        }
        this.triggerEvent('click', this.data.items[e.currentTarget.dataset.i as number]);
    }
}
</script>
<style lang="scss" scoped>

</style>
