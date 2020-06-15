<template>
    <DialogPanel title="发票" bodyHeight="45vh">
        <div class="line-item inovice-box" slot="input">
            <span>发票</span>
            <span>
                {{ value ? value.name : '请选择' }}
            </span>
            <i class="fa fa-chevron-right"></i>
        </div>
        <div slot="panel">
            <div class="input-group">
                <label>发票类型</label>
                <div class="radio-box">
                    <span v-for="(item, index) in typeList" :key="index"  :class="{active: value.type == index}" @click="value.type = index">
                            {{ item }}
                     </span>
                </div>
                <div class="tip">电子普通发票与纸质普通发票具备同等法律效力，可支持报销入账</div>
            </div>
            <div class="input-group">
                <label>发票抬头</label>
                <div class="radio-box">
                    <span v-for="(item, index) in titleTypeList" :key="index" :class="{active: value.title_type == index}" @click="value.title_type = index">
                            {{ item }}
                    </span>
                </div>
            </div>
            <div class="input-group">
                <input type="text" placeholder="抬头" v-model="value.title">
                <input type="text" placeholder="税号" v-model="value.tax_no">
            </div>
            <div class="input-line">
                <p><span>收票人手机</span><span></span></p>
                <p><span>收票人邮箱</span><span></span></p>
            </div>
            <div class="input-group">
                <label>发票内容</label>
                <div class="radio-box">
                    <span v-for="(item, index) in detailType" :key="index"  :class="{active: value.detail_type == index}" @click="value.detail_type = index">
                            {{ item }}
                     </span>
                </div>
            </div>
        </div>
        <div slot="footer">
            <button class="dialog-yes" @click="tapConfirm">确定</button>
        </div>
    </DialogPanel>
</template>
<script lang="ts">
import { WxJson, WxComponent, WxMethod } from "../../../../typings/wx/lib.vue";
import { IInvoiceTitle } from "../../../api/model";

interface IComponentData {
    value?: IInvoiceTitle,
    titleTypeList: string[];
    typeList: string[];
    detailType: string[];
}

@WxJson({
    usingComponents: {
        DialogPanel: '/components/DialogPanel/index'
    },
    component: true
})
export class InvoiceLine extends WxComponent<IComponentData>  {
    public options = {
        addGlobalClass: true,
    }

    public properties = {
        value: Object,
    }

    public data: IComponentData = {
        titleTypeList: ['个人', '企业'],
        typeList: ['增值税普通发票', '增值税专用发票'],
        detailType: ['商品明细', '商品类别'],
    }

    @WxMethod()
    tapConfirm() {
        this.triggerEvent('input', this.data.value);
    }
}
</script>
<style lang="scss" scoped>
.input-group {
    margin-bottom: 10px;
    label {
        line-height: 30px;
        font-weight: 900;
    }
    input {
        margin-top: 5px;
        width: 100%;
        height: 40px;
        border: none;
        border-bottom: 1px solid #ccc;
    }
}
.input-line {
    line-height: 40px;
    text {
        &:first-child {
            width: 120px;
        }
    }
}
.radio-box {
    text {
        display: inline-block;
        background-color: #fff;
        border: 1px solid #ccc;
        padding: 0 10px;
        margin-left: 2px;
        box-sizing: content-box;
        font-size: 14px;
        line-height: 30px;
        &.active {
            background-color: #d22222;
            color: #fff;
        }
    }
}
.tip {
    font-size: 12px;
    color: #767676;
}
</style>