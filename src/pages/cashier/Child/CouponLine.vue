<template>
    <DialogPanel title="优惠券">
        <div class="line-item inovice-box" slot="input">
            <span>优惠券</span>
            <span>
                {{ value ? value.name : (!items || items.length < 1 ? '无可用' : '请选择') }}
            </span>
            <i class="fa fa-chevron-right"></i>
        </div>
        <div slot="panel">
            


        </div>
        <div slot="footer">
            <button>确定</button>
        </div>
    </DialogPanel>
</template>
<script lang="ts">
import { WxComponent, WxJson } from "../../../../typings/wx/lib.vue";

interface IComponentData {
    value?: any,
    items?: any[]
}

@WxJson({
    usingComponents: {
        DialogPanel: '/components/DialogPanel/index'
    },
    component: true
})
export class CouponLine extends WxComponent<IComponentData>  {
    public options = {
        addGlobalClass: true,
    }

    public properties = {
        value: Object,
        items: Object,
    }
}
</script>
<style lang="scss" scoped>
.payment-box {
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