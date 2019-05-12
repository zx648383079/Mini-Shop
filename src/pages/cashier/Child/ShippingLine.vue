<template>
    <DialogPanel title="配送方式">
        <div class="line-item shipping-box" slot="input">
            <span>配送方式</span>
            <span>
                {{ value ? value.name : '请选择' }}
            </span>
            <i class="fa fa-chevron-right"></i>
        </div>
        <div class="item-list" slot="panel">
            <a v-for="(item, index) in items" :key="index" :class="{active: value && item.id == value.id}" @click="tapSelected(item)">{{ item.name }}</a>
        </div>
    </DialogPanel>
</template>
<script lang="ts">
import { WxJson, WxComponent } from "../../../../typings/wx/lib.wx.page";
import { IShipping } from "../../../api/model";

interface IComponentData {
    value?: IShipping,
    items?: IShipping[]
}

@WxJson({
    usingComponents: {
        DialogPanel: '/components/DialogPanel/index'
    },
    component: true
})
export class ShippingLine extends WxComponent<IComponentData>  {

    public options = {
        addGlobalClass: true,
    }

    public properties = {
        value: Object,
        items: Object,
    }
    
    public tapSelected(item: IShipping) {
        this.$emit('input', item);
    }
}
</script>
<style lang="scss" scoped>
.shipping-box {
    background-color: #fff;
}
.item-list {
    a {
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