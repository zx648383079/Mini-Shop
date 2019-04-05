<template>
    <DialogPanel title="充值">
        <a>
            <i class="fa fa-money-check-alt" aria-hidden="true"></i>
            充值
            <i class="fa fa-chevron-right" aria-hidden="true"></i>
        </a>
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
export class BackHeader extends WxComponent<any>  {

}
</script>
<style lang="scss" scoped>
</style>
