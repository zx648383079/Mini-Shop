<template>
    <div>
        <CatItem :items="items" @click="tapCategory"/>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app';
const app = getApp<IMyApp>();

interface IPageData {
}

export class Category extends WxPage<IPageData> {
    public items: IArticleCategory[] = [];
    public id: number = 0;

    created() {
        const id = parseInt(this.$route.query.id + '');
        if (id) {
            this.id = id;
        }
    }
    /**
     * tapCategory
     */
    public tapCategory(item: IArticleCategory) {
        this.id = item.id;
        this.$route.meta.title = item.name;
        this.tapRefresh();
    }

    public tapRefresh() {
        getCategories(this.id).then(res => {
            if (!res.data) {
                return;
            }
            this.items = res.data;
        });
    }
}
</script>
<style lang="scss" scoped>

</style>
