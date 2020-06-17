<template>
    <div class="score">
        <i class="fa fa-star" v-for="(i, j) in star_list" :key="j" :class="{active: i * 2 <= value}" @click="tapStar" data-i="{{i}}"></i>
    </div>
</template>
<script lang="ts">
import { WxComponent, WxJson, TouchEvent, WxMethod } from "../../../../typings/wx/lib.vue";

interface IComponentData {
    value?: number,
    star_list: number[]
}

@WxJson({
    component: true
})
export class Star extends WxComponent<IComponentData>  {
    public options = {
        addGlobalClass: true,
    };

    public properties = {
        value: Number,
    }

    public data: IComponentData = {
        star_list: [1, 2, 3, 4, 5]
    }

    @WxMethod()
    tapStar(e: TouchEvent) {
        this.triggerEvent('input', {
            value: e.currentTarget.dataset.i as number * 2
        });
    }
}
</script>
<style lang="scss" scoped>

</style>
