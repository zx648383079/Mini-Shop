<template>
    <div>
        <div class="has-header">
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
    navigationBarTitleText: "分类",
    navigationBarBackgroundColor: "#f4f4f4",
    navigationBarTextStyle: "black"
})
export class Index extends WxPage<IPageData> {
    
}
</script>
<style lang="scss" scoped>
</style>
