<template>
    <div>
        <div>
            <div class="input-group">
                 <label for="发票抬头">发票抬头</label>
                 <div class="">
                     <input type="text" id="发票抬头" class="form-control " name="发票抬头" placeholder="请输入 发票抬头" required="">

                 </div>
             </div>
             <div class="input-group">
                 <label for="发票抬头类型">发票抬头类型</label>
                 <div class="">
                     <span class="radio-label">
                         <input type="radio" id="发票抬头类型0" name="发票抬头类型" value="0" checked="">
                         <label for="发票抬头类型0">个人</label>
                     </span><span class="radio-label">
                         <input type="radio" id="发票抬头类型1" name="发票抬头类型" value="1">
                         <label for="发票抬头类型1">企业</label>
                     </span>
                 </div>
             </div>
             <div class="input-group">
                 <label for="发票类型">发票类型</label>
                 <div class="">
                     <select id="发票类型" name="发票类型" style="display: none;">
                         <option value="0" selected="">增值税普通发票</option>
                         <option value="1">增值税专用发票</option>
                     </select>
                     <div class="dialog-select-input">增值税普通发票</div>

                 </div>
             </div>
             <div class="input-group">
                 <label for="税务登记号">税务登记号</label>
                 <div class="">
                     <input type="text" id="税务登记号" class="form-control " name="税务登记号" placeholder="请输入 税务登记号"
                         required="">

                 </div>
             </div>
             <div class="input-group">
                 <label for="注册场所地址">注册场所地址</label>
                 <div class="">
                     <input type="text" id="注册场所地址" class="form-control " name="注册场所地址" placeholder="请输入 注册场所地址"
                         required="">

                 </div>
             </div>
             <div class="input-group">
                 <label for="注册场所电话">注册场所电话</label>
                 <div class="">
                     <input type="text" id="注册场所电话" class="form-control " name="注册场所电话" placeholder="请输入 注册场所电话"
                         required="">

                 </div>
             </div>
             <div class="input-group">
                 <label for="开户银行">开户银行</label>
                 <div class="">
                     <input type="text" id="开户银行" class="form-control " name="开户银行" placeholder="请输入 开户银行" required="">

                 </div>
             </div>
             <div class="input-group">
                 <label for="基本开户账号">基本开户账号</label>
                 <div class="">
                     <input type="text" id="基本开户账号" class="form-control " name="基本开户账号" placeholder="请输入 基本开户账号"
                         required="">

                 </div>
             </div>
        </div>

        <div class="fixed-footer">
            <button class="btn" type="button">保存</button> 
        </div>

    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app';
import { WxJson, WxPage } from '../../../typings/wx/lib.wx.page';
const app = getApp<IMyApp>();

interface IPageData {
}
@WxJson({
    navigationBarTitleText: "编辑抬头",
    navigationBarBackgroundColor: "#f4f4f4",
    navigationBarTextStyle: "black"
})
export class Edit extends WxPage<IPageData> {

}
</script>
<style lang="scss" scoped>

</style>
