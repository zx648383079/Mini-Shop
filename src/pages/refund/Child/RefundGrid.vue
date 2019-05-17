<template>
    <div class="form-table">
        <div class="input-group">
            <label for="退款金额">退款原因</label>
            <div class="">
                <select class="form-control " required="">
                    <option>请选择退款原因</option>
                </select>
            </div>
        </div>
        <div class="input-group">
            <label for="退款金额">退款联系人</label>
            <div class="">
                <input type="text" id="退款金额" class="form-control " name="退款金额" placeholder="请输入 退款金额" required="">
            </div>
        </div>
        <div class="input-group">
            <label for="退款金额">联系方式</label>
            <div class="">
                <input type="text" id="退款金额" class="form-control " name="退款金额" placeholder="请输入 退款金额" required="">
            </div>
        </div>
        <div class="fixed-footer">
            <button class="btn" type="button">保存</button> 
        </div>
    </div>
</template>
<script lang="ts">
import { WxComponent, WxJson } from "../../../../typings/wx/lib.wx.page";

@WxJson({
    component: true
})
export class RefundGrid extends WxComponent<any>  {
    public options = {
        addGlobalClass: true,
    }
}
</script>
<style lang="scss" scoped>

</style>