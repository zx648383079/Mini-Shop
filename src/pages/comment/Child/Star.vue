<template>
    <div class="score">
        <i class="fa fa-star" v-for="(i, j) in star_list" :key="j" :class="{active: i * 2 <= value}" @click="tapStar(i)"></i>
    </div>
</template>
<script lang="ts">
export class BackHeader extends WxComponent<any>  {
    @Prop(Number) readonly value?: number;
    star_list = [1, 2, 3, 4, 5];

    tapStar(i: number) {
        this.$emit('input', i * 2);
    }
}
</script>
<style lang="scss" scoped>

</style>
