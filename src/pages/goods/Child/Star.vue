<template>
    <div class="score">
        <i class="fa fa-star" v-for="(i, j) in star_list" :key="j" v-show="i * 2 <= star"></i>
    </div>
</template>
<script lang="ts">
export class BackHeader extends WxComponent<any>  {
    @Prop(Number) readonly star!: number;
    public star_list = [1, 2, 3, 4, 5];
}
</script>
<style lang="scss" scoped>

</style>
