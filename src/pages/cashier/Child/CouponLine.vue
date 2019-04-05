<template>
    <DialogPanel title="优惠券">
        <div class="line-item inovice-box">
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
export class BackHeader extends WxComponent<any>  {
    @Prop(Object) readonly value?: IPayment;
    @Prop(Array) readonly items?: IPayment[];
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