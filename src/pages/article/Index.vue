<template>
    <div>
        <div class="has-header">
            <div :class="['scroll-nav', isExpand ? 'unfold' : '']">
                <ul>
                    <li v-for="(item, index) in categories" :key="index" :class="{active: category == item.id}">
                            <a>{{ item.name }}</a>
                    </li>
                </ul>
                <a @click="isExpand = !isExpand" class="fa nav-arrow"></a>
            </div>
            <PullToRefresh :loading="isLoading" :more="has_more" @refresh="tapRefresh" @more="tapMore">
                <ArticleItem :items="items"/>
            </PullToRefresh>
        </div>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app';
const app = getApp<IMyApp>();

interface IPageData {
}

export class Index extends WxPage<IPageData> {
    public categories: IArticleCategory[] = [];
    public category: number = 0;
    public status: number = 0;
    public items: IArticle[] = [];
    public isExpand: boolean = false;
    public has_more = true;
    public page = 1;
    public isLoading = false;

    public created() {
        if (this.$route.query.category) {
            this.category = parseInt(this.$route.query.category + '');
        }
        getCategories().then(res => {
            if (!res.data) {
                return;
            }
            this.categories = res.data;
            if (!this.category || this.category < 1) {
                this.tapCategory(res.data[0]);
            }
        });
        if (this.category && this.category > 0) {
            this.tapRefresh();
        }
    }

    /**
     * tapCategory
     */
    public tapCategory(item: IArticleCategory) {
        this.category = item.id;
        this.$route.meta.title = item.name;
        this.isExpand = false;
        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.has_more) {
            return;
        }  
        this.goPage(this.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        getArticleList({
            category: this.category,
            page: page,
        }).then(res => {
            this.page = page;
            this.isLoading = false;
            if (this.page < 2) {
                this.items = res.data as never[];
                return;
            }
            this.items = [].concat(this.items as never[], res.data as never[]);
        });
    }
}
</script>
<style lang="scss" scoped>

</style>
