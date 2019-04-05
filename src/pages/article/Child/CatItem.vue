<template>
    <div class="item-list">
        <a v-for="(item, index) in items" :key="index" @click="tapItem(item)">
            {{ item.name }}
            <i class="fa fa-chevron-right" aria-hidden="true"></i>
        </a>
    </div>
</template>
<script lang="ts">
export class BackHeader extends WxComponent<any>  {
    @Prop(Array) readonly items!: IArticleCategory[];

    public tapItem(item: IArticleCategory) {
        this.$emit('click', item);
    }
}
</script>
<style lang="scss" scoped>

</style>
