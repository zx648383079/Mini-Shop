<template>
    <div>
        <div class="log-hr">
            2018年12月
        </div>
        <div class="log-item" v-for="(item, index) in items" :key="index">
            <div class="info">
                <div class="name">个人</div>
                <p>2018-123</p>
            </div>
            <div class="amount">
                ￥200
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { WxJson, WxPage } from '../../../typings/wx/lib.vue';

interface IPageData {
    items: any[]
}
@WxJson({
    navigationBarTitleText: "开票历史",
    navigationBarBackgroundColor: "#f4f4f4",
    navigationBarTextStyle: "black"
})
export class Log extends WxPage<IPageData> {
    public data: IPageData = {
        items: []
    }
}
</script>
<style lang="scss" scoped>

</style>
