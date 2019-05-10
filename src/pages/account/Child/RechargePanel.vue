<template>
    <DialogPanel title="充值">
        <div class="item line" slot="input">
            <i class="fa fa-wallet" aria-hidden="true"></i>
                充值
            <i class="fa fa-chevron-right" aria-hidden="true"></i>
        </div>
        <div slot="panel">
            <p>充值金额</p>
            <div class="money-input">
                <em>￥</em>
                <input type="text" placeholder="0.00">
            </div>
        </div>
        <div slot="footer">
            <button class="dialog-yes">下一步</button>
        </div>
    </DialogPanel>
</template>
<script lang="ts">
import { WxComponent, WxJson } from "../../../../typings/wx/lib.wx.page";

@WxJson({
    usingComponents: {
        DialogPanel: '/components/DialogPanel/index'
    },
    component: true
})
export class RechargePanel extends WxComponent<any>  {
    public options = {
        addGlobalClass: true,
    };
}
</script>
<style lang="scss" scoped>
</style>
