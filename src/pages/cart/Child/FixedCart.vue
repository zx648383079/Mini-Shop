<template>
    <div class="cart-fixed">
        <i class="fa fa-cart"></i>
        <span class="amount-tip" v-if="amount > 0">{{ amount > 99 ? '99+' : amount }}</span>
    </div>
</template>
<script lang="ts">
import { WxJson, WxComponent } from "../../../../typings/wx/lib.vue";

interface IComponentData {
    amount: number
}

@WxJson({
    component: true
})
export default class FixedCart extends WxComponent<IComponentData> {
    
    public options = {
        addGlobalClass: true,
    };

    public data = {
        amount: 100
    };
}
</script>
<style lang="scss" scoped>
.cart-fixed {
    position: fixed;
    bottom: 30px;
    right: 30px;
    font-size: 30px;
    z-index: 88;
    .amount-tip {
        font-size: 12px;
        position: absolute;
        top: -3px;
        left: -3px;
        color: #fff;
        background-color: red;
        border-radius: 50%;
        display: block;
        width: 20px;
        height: 20px;
        text-align: center;
        line-height: 20px;
    }
}
</style>