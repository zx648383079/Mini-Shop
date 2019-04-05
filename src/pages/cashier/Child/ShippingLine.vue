<template>
    <DialogPanel title="配送方式">
        <div class="line-item shipping-box">
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
export class BackHeader extends WxComponent<any>  {
    @Prop(Object) readonly value?: IShipping;
    @Prop(Array) readonly items?: IShipping[];
    
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