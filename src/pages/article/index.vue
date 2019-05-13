<template>
    <div>
        <div class="scroll-nav {{isExpand ? 'unfold' : ''}}">
            <ul class="box">
                <li v-for="(item, index) in categories" :key="index" class="item {{category == item.id ? 'active' : ''}}">
                        <span>{{ item.name }}</span>
                </li>
            </ul>
            <span @click="tapExpand" class="fa nav-arrow"></span>
        </div>
        <div :loading="isLoading" :more="has_more" @refresh="tapRefresh" @more="tapMore">
            <ArticleItem :items="items"/>
        </div>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app';
import { WxPage, WxJson } from '../../../typings/wx/lib.wx.page';
import { IArticleCategory, IArticle } from '../../api/model';
import { getCategories, getArticleList } from '../../api/article';
const app = getApp<IMyApp>();

interface IPageData {
    categories: IArticleCategory[],
    category: number,
    status: number,
    items: IArticle[],
    isExpand: boolean,
    has_more: boolean,
    page: number,
    isLoading: boolean
}
@WxJson({
    usingComponents: {
        ArticleItem: 'Child/ArticleItem'
    },
    navigationBarTitleText: "文章分类",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white",
    enablePullDownRefresh: true,
    onReachBottomDistance: 10,
})
export class Index extends WxPage<IPageData> {

    public data: IPageData = {
        categories: [],
        category: 0,
        status: 0,
        items: [],
        isExpand: false,
        has_more: true,
        page: 1,
        isLoading: false
    }

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
     * tapExpand
     */
    public tapExpand() {
        this.setData({
            isExpand: !this.data.isExpand
        });
    }

    onPullDownRefresh() {
        this.tapRefresh();
    }

    onReachBottom() {
        this.tapMore();
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
        if (!this.data.has_more) {
            return;
        }  
        this.goPage(this.data.page + 1);
    }

    public goPage(page: number) {
        if (this.data.isLoading) {
            return;
        }
        this.setData({
            isLoading: true
        });
        getArticleList({
            category: this.data.category,
            page: page,
        }).then(res => {
            let items = [];
            if (page < 2) {
                items = res.data as never[];
            } else {
                items = [].concat(this.data.items as never[], res.data as never[]);
            }
            this.setData({
                has_more: res.paging.more,
                isLoading: false,
                page,
                items
            });
        });
    }
}
</script>
<style lang="scss" scoped>

</style>
