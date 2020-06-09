<template>
    <div class="score">
        <i class="fa fa-star" v-for="(i, j) in star_list" :key="j" v-show="i * 2 <= star"></i>
    </div>
</template>
<script lang="ts">
import { WxJson, WxComponent } from "../../../../typings/wx/lib.vue";


interface IComponentData {
    star?: number,
    star_list: number[],
}

@WxJson({
    component: true
})
export class Star extends WxComponent<IComponentData>  {

    public options = {
        addGlobalClass: true,
    }

    public properties = {
        star: Number,
    }

    public data = {
        star_list: [1, 2, 3, 4, 5]
    }
}
</script>
<style lang="scss" scoped>

</style>
