<template>
    <div>
        <div class="account-header">
            <p>可开发票总金额(元)</p>
            <div class="money">0.00</div>
        </div>

        <div class="menu-list">
            <a href="apply">
                <i class="fa fa-money-o" aria-hidden="true"></i>
                申请开票
                <i class="fa fa-chevron-right" aria-hidden="true"></i>
            </a>
            <a href="title">
                <i class="fa fa-wallet" aria-hidden="true"></i>
                发票抬头
                <i class="fa fa-chevron-right" aria-hidden="true"></i>
            </a>
            <a href="log">
                <i class="fa fa-history" aria-hidden="true"></i>
                近期开票
                <i class="fa fa-chevron-right" aria-hidden="true"></i>
            </a>
        </div>
    </div>
</template>
<script lang="ts">
import { WxJson, WxPage } from '../../../typings/wx/lib.vue';

interface IPageData {
}
@WxJson({
    navigationBarTitleText: "发票管理",
    navigationBarBackgroundColor: "#f4f4f4",
    navigationBarTextStyle: "black"
})
export class Index extends WxPage<IPageData> {

}
</script>
<style lang="scss" scoped>

</style>
