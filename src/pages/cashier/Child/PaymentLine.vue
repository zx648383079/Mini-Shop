<template>
    <DialogPanel title="支付方式">
        <div class="line-item payment-box" slot="input">
            <span>支付方式</span>
            <span>
                {{ value ? value.name : '请选择' }}
            </span>
            <i class="fa fa-chevron-right"></i>
        </div>
        <div class="item-list" slot="panel">
            <span v-for="(item, index) in items" :key="index" class="{{value && item.id == value.id ? 'active' : ''}}" @click="tapSelected" data-i="{{ index }}">{{ item.name }}</span>
        </div>
    </DialogPanel>
</template>
<script lang="ts">
import { WxJson, WxComponent, TouchEvent, WxMethod } from "../../../../typings/wx/lib.vue";
import { IPayment } from "../../../api/model";

interface IComponentData {
    value?: IPayment,
    items?: IPayment[]
}

@WxJson({
    usingComponents: {
        DialogPanel: '/components/DialogPanel/index'
    },
    component: true
})
export class PaymentLine extends WxComponent<IComponentData>  {
    public options = {
        addGlobalClass: true,
    }

    public properties = {
        value: Object,
        items: Object,
    }
    
    @WxMethod()
    public tapSelected(e: TouchEvent) {
        if (!this.data.items) {
            return;
        }
        this.triggerEvent('input', this.data.items[e.currentTarget.dataset.i as number]);
    }
}
</script>
<style lang="scss" scoped>
.payment-box {
    background-color: #fff;
}

.item-list {
    text {
        display: inline-block;
        padding: 5px 10px;
        border: 1px solid #ccc;
        &.active {
            background-color: rgb(248, 209, 209);
            color: red;
            border-color: red;
        }
    }
}
</style>