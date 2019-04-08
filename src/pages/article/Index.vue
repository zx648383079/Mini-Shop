<template>
    <div>
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
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app';
import { WxPage } from '../../../typings/wx/lib.wx.page';
import { IArticleCategory, IArticle } from '../../api/model';
import { getCategories, getArticleList } from '../../api/article';
const app = getApp<IMyApp>();

interface IPageData {
    categories: IArticleCategory[],
    category: number,
    status: number,
    items: IArticle[],
    isExpand: boolean
}

export class Index extends WxPage<IPageData> {

    public data: IPageData = {
        categories: [],
        category: 0,
        status: 0,
        items: [],
        isExpand: false
    }
    public has_more = true;
    public page = 1;
    public isLoading = false;

    public onLoad(option: any) {
        if (option.category) {
            this.setData({
                category: parseInt(option.category + '')
            });
        }
        getCategories().then(res => {
            if (!res.data) {
                return;
            }
            this.setData({
                categories: res.data
            })
            if (!this.data.category || this.data.category < 1) {
                this.tapCategory(res.data[0]);
            }
        });
        if (this.data.category && this.data.category > 0) {
            this.tapRefresh();
        }
    }

    /**
     * tapCategory
     */
    public tapCategory(item: IArticleCategory) {
        this.setData({
            category: item.id,
            isExpand: false
        });
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
            category: this.data.category,
            page: page,
        }).then(res => {
            this.page = page;
            this.isLoading = false;
            if (this.page < 2) {
                this.setData({items: res.data as never[];})
                return;
            }
            this.setData({
                items: [].concat(this.data.items as never[], res.data as never[])
            });
        });
    }
}
</script>
<style lang="scss" scoped>

</style>
