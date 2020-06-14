<template>
    <div>
        <div class="form-table">
            <div class="input-group">
                 <label for="发票抬头">发票抬头</label>
                 <div class="">
                     <input type="text" id="发票抬头" class="form-control " v-model="invoice.title" placeholder="请输入 发票抬头" required="">

                 </div>
             </div>
             <div class="input-group">
                 <label for="发票抬头类型">发票抬头类型</label>
                 <div  class="radio-box">
                     <span v-for="(item, index) in titleTypeList" :key="index" :class="{active: invoice.title_type == index}" @click="invoice.title_type = index">
                            {{ item }}
                    </span>
                 </div>
             </div>
             <div class="input-group" v-if="invoice.title_type > 0">
                 <label for="发票类型">发票类型</label>
                 <div class="radio-box">
                     <span v-for="(item, index) in typeList" :key="index"  :class="{active: invoice.type == index}" @click="invoice.type = index">
                            {{ item }}
                     </span>

                 </div>
             </div>
             <div class="input-group" v-if="invoice.title_type > 0">
                 <label for="税务登记号">税务登记号</label>
                 <div class="">
                     <input type="text" v-model="invoice.tax_no" class="form-control " placeholder="请输入 税务登记号"
                         required="">

                 </div>
             </div>
             <div class="input-group" v-if="invoice.type > 0">
                 <label for="注册场所地址">注册场所地址</label>
                 <div class="">
                     <input type="text" v-model="invoice.address" class="form-control " placeholder="请输入 注册场所地址"
                         required="">

                 </div>
             </div>
             <div class="input-group" v-if="invoice.type > 0">
                 <label for="注册场所电话">注册场所电话</label>
                 <div class="">
                     <input type="text" v-model="invoice.tel" class="form-control "  placeholder="请输入 注册场所电话"
                         required="">

                 </div>
             </div>
             <div class="input-group" v-if="invoice.type > 0">
                 <label for="开户银行">开户银行</label>
                 <div class="">
                     <input type="text" v-model="invoice.bank" class="form-control " placeholder="请输入 开户银行" required="">

                 </div>
             </div>
             <div class="input-group" v-if="invoice.type > 0">
                 <label for="基本开户账号">基本开户账号</label>
                 <div class="">
                     <input type="text" v-model="invoice.account" class="form-control " placeholder="请输入 基本开户账号"
                         required="">

                 </div>
             </div>
        </div>

        <div class="fixed-footer">
            <button class="btn" type="button" @click="tapSubmit">保存</button> 
        </div>

    </div>
</template>
<script lang="ts">
import { WxJson, WxPage } from '../../../typings/wx/lib.vue';
import { IInvoiceTitle } from '../../api/model';
import { getTitle, saveTitle } from '../../api/invoice';

interface IPageData {
    titleTypeList: string[];
    typeList: string[];
    invoice: IInvoiceTitle;
}
@WxJson({
    navigationBarTitleText: "编辑抬头",
    navigationBarBackgroundColor: "#f4f4f4",
    navigationBarTextStyle: "black"
})
export class Edit extends WxPage<IPageData> {

    public data: IPageData = {
        titleTypeList: ['个人', '企业'],
        typeList: ['增值税普通发票', '增值税专用发票'],
        invoice: {
            title_type: 0,
            type: 0,
            title: '',
            tax_no: '',
            tel: '',
            bank: '',
            account: '',
            address: '',
        }
    };

    onLoad(option: any) {
        if (!option || !option.id) {
            return;
        }
        getTitle(option.id).then(res => {
            this.setData({
                invoice: res
            });
        });
    }

    public tapSubmit() {
        const invoice = Object.assign({}, this.data.invoice);
        if (!invoice.title) {
            wx.showToast({
                icon: 'none',
                title: '请输入发票抬头'
            });
            return;
        }
        saveTitle(invoice).then(_ => {
            wx.navigateBack({
                delta: 0
            });
        });
    }
}
</script>
<style lang="scss" scoped>
page {
    background-color: #f4f4f4;
}
.radio-box {
    font-size: 12px;
    text-align: right;
    text {
        display: inline-block;
        background-color: #fff;
        border: 1px solid #ccc;
        padding: 0 10px;
        margin-left: 10px;
        box-sizing: content-box;
        line-height: 35px;
        &.active {
            background-color: #d22222;
            color: #fff;
        }
    }
}
</style>
