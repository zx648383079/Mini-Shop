<template>
    <DialogPanel title="提现" bodyHeight="45vh">
        <div class="item line" slot="input">
            <i class="fa fa-withdrawal" aria-hidden="true"></i>
                提现
                <i class="fa fa-chevron-right" aria-hidden="true"></i>
        </div>
        <div slot="panel">
            <p>提现金额</p>
            <div class="money-input">
                <em>￥</em>
                <input type="text" v-model="money" placeholder="0.00">
            </div>
            <p>提现到账户</p>
            <div class="row-input">
                <picker mode="selector" range="{{ typeList }}" value="{{ type }}" bindchange="tapType">
                    <div class="select-input">
                        {{ typeList[type] }}
                    </div>
                </picker>
            </div>
            <div class="row-input">
                <input type="text" v-model="account" placeholder="卡号/账号">
            </div>
            <div class="row-input">
                <input type="text" v-model="name" placeholder="姓名">
            </div>
        </div>
        <div slot="footer">
            <button class="dialog-yes">提交提现申请</button>
        </div>
    </DialogPanel>
</template>
<script lang="ts">
import { WxComponent, WxJson, WxMethod, CustomEvent } from "../../../../typings/wx/lib.vue";

interface IComponentData {
    typeList: string[];
    type: number;
    money: number;
    account: string;
    name: string;
}

@WxJson({
    usingComponents: {
        DialogPanel: '/components/DialogPanel/index'
    },
    component: true
})
export class WithdrawPanel extends WxComponent<IComponentData>  {
    public options = {
        addGlobalClass: true,
    };

    public data: IComponentData = {
        typeList: [
            '支付宝',
            '微信',
            '银行卡'
        ],
        type: 0,
        money: 0,
        account: '',
        name: ''
    };

    @WxMethod()
    tapType(e: CustomEvent) {
        this.setData({
            type: e.detail.value
        });
    }
}
</script>
<style lang="scss">
.menu-list {
    .dialog-panel-box {
        border-bottom: 1px solid #ccc;
    }
}
</style>
