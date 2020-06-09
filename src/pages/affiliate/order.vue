<template>
    <div>
        <div class="log-hr">
            2018年12月
        </div>
        <div class="log-item" v-for="(item, index) in items" :key="index">
            <div class="info">
                <div class="name">12312332312</div>
                <p>222</p>
            </div>
            <div class="amount">
                +10
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { WxPage, WxJson } from '../../../typings/wx/lib.vue';

interface IPageData {
    items: number[],
}
@WxJson({
    navigationBarTitleText: "推荐记录",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})
export class Order extends WxPage<IPageData> {
    public data: IPageData = {
        items: [1]
    }
}
</script>
<style lang="scss" scoped>

</style>
