<template>
    <div>
        <div class="log-hr">
            2018年12月
        </div>
        <div class="log-item" v-for="(item, index) in items" :key="index">
            <div class="info">
                <div class="name">已签收</div>
                <p>11-11</p>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { WxPage, WxJson } from '../../../typings/wx/lib.vue';

interface IPageData {
}
@WxJson({
    navigationBarTitleText: "物流信息",
    navigationBarBackgroundColor: "#f4f4f4",
    navigationBarTextStyle: "black"
})
export class Logistics extends WxPage<IPageData> {
    items = [1];
}
</script>
<style lang="scss" scoped>

</style>
