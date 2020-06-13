<template>
    <div>
        <div class="account-header">
            <p>余额账户(元)</p>
            <div class="money">{{ money }}</div>
        </div>

        <div class="menu-list">
            <RechargePanel/>
            <WithdrawPanel/>
            <a class="item" href="log">
                <i class="fa fa-invoice" aria-hidden="true"></i>
                明细
                <i class="fa fa-chevron-right" aria-hidden="true"></i>
            </a>
            <a class="item" href="card">
                <i class="fa fa-card" aria-hidden="true"></i>
                银行卡
                <i class="fa fa-chevron-right" aria-hidden="true"></i>
            </a>
            <a class="item" href="/pages/invoice/index">
                <i class="fa fa-invoice" aria-hidden="true"></i>
                发票管理
                <i class="fa fa-chevron-right" aria-hidden="true"></i>
            </a>
        </div>

    </div>
</template>
<script lang="ts">
import { WxPage, WxJson } from '../../../typings/wx/lib.vue';
import { getAccountSubtotal } from '../../api/account';

interface IPageData {
    money: number;
}
@WxJson({
    usingComponents: {
        RechargePanel: "Child/RechargePanel",
        WithdrawPanel: "Child/WithdrawPanel"
    },
    navigationBarTitleText: "我的余额",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})
export class Index extends WxPage<IPageData> {
    
    public data = {
        money: 0
    };

    onLoad() {
        getAccountSubtotal().then(res => {
            this.setData({
                money: res.money || 0
            });
        });
    }
}
</script>
<style lang="scss" scoped>
</style>
