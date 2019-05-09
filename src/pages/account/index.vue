<template>
    <div>
        <div class="account-header">
            <p>余额账户(元)</p>
            <div class="money">0.00</div>
        </div>

        <div class="menu-list">
            <RechargePanel/>
            <WithdrawPanel/>
            <a @click="$router.push('/account/card')">
                <i class="fa fa-credit-card" aria-hidden="true"></i>
                银行卡
                <i class="fa fa-chevron-right" aria-hidden="true"></i>
            </a>
            <a @click="$router.push('/invoice')">
                <i class="fa fa-bookmark" aria-hidden="true"></i>
                发票管理
                <i class="fa fa-chevron-right" aria-hidden="true"></i>
            </a>
        </div>

    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app';
import { WxPage, WxJson } from '../../../typings/wx/lib.wx.page';
const app = getApp<IMyApp>();

interface IPageData {
    
}
@WxJson({
    usingComponents: {
        RechargePanel: "Child/RechargePanel",
        MenuItem: "Child/RechargePanel"
    },
    navigationBarTitleText: "我的余额",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})
export class Index extends WxPage<IPageData> {
    
}
</script>
<style lang="scss" scoped>
</style>
