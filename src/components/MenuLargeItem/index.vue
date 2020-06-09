<template>
    <div @click="tapGo">
        <i class="fa {{icon}}"></i>
        <span>{{ title }}</span>
        <i class="tip" v-if="count && count > 0">{{ count }}</i>
    </div>
</template>
<script lang="ts">
import { WxJson, WxComponent, WxMethod } from "../../../typings/wx/lib.vue";

@WxJson({
    component: true
})
export class MenuLargeItem extends WxComponent<any>  {
    public options = {
        addGlobalClass: true
    }

    public properties = {
        title: String,
        icon: String,
        uri: String,
        count: Number,
    }
    @WxMethod()
    public tapGo() {
        if (this.data.uri) {
            wx.navigateTo({
                url: this.data.uri
            });
        }
    }
}

</script>
<style lang="scss" scoped>

</style>
