<template>
    <div>
        <div class="account-header">
            <p>可开发票总金额(元)</p>
            <div class="money">0.00</div>
        </div>

        <div class="menu-list">
            <a class="item" href="apply">
                <i class="fa fa-money-o" aria-hidden="true"></i>
                申请开票
                <i class="fa fa-chevron-right" aria-hidden="true"></i>
            </a>
            <a class="item" href="title">
                <i class="fa fa-wallet" aria-hidden="true"></i>
                发票抬头
                <i class="fa fa-chevron-right" aria-hidden="true"></i>
            </a>
            <a class="item" href="log">
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
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white",
})
export class Index extends WxPage<IPageData> {

}
</script>
<style lang="scss" scoped>
page {
    background-color: #f4f4f4;
}
</style>
