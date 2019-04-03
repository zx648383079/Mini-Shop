<template>
    <header class="top {{ this.fixed ? : '' : 'fixed' }}">
        <div class="back" @click="tapBack">
            <i class="fa fa-chevron-left"></i>
        </div>
        <span class="title">
            {{ title }}
        </span>
        <slot></slot>
    </header>
</template>
<script lang="ts">
interface BackHeader extends IComponent {
    
}

class BackHeader {
    public properties = {
        title: String,
        fixed: {
            type: Boolean,
            value: true,
        }
    }

    public tapBack() {
        wx.navigateBack({ delta: 1 });
    }
}

Component(new BackHeader());
</script>
<style lang="scss" scoped>

</style>
