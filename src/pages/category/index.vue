<template>
    <div>
        <header class="top">
            <a class="search-entry" href="/pages/search/index">
                <i class="fa fa-search"></i>
                <span>搜索商品, 共 {{ subtotal ? subtotal.goods : 0 }} 款好物</span>
            </a>
        </header>
        <div class="has-header category-page">
            <scroll-view  class="category-menu" scroll-y="true"> 
                    <div v-for="(item, index) in categories" :key="index" wx:key="id" class="menu-item {{ category && item.id == category.id ? 'active' : '' }}" @click="tapSelectedItem" id="{{index}}">{{ item.name }}</div>
            </scroll-view>

            <scroll-view class="category-main" v-if="category" scroll-y="true"> 
                <div class="item active">
                    <div class="banner" v-if="category.banner">
                        <img :src="category.banner" mode="widthFix">
                    </div>
                    <div class="header">
                        <a href="/pages/search/result?category={{ category.id }}">{{ category.name }}</a>
                    </div>
                    <div class="goods-list" v-if="category.goods_list && category.goods_list.length > 0">
                        <div class="item-view" v-for="(item, index) in category.goods_list" :key="index" wx:key="id">
                            <div class="item-img">
                                <a  href="/pages/goods/index?id={{ item.id }}"><img :src="item.thumb" mode="widthFix"></a>
                            </div>
                            <div class="item-title">
                                {{item.name}}
                            </div>
                            <div class="item-actions">
                                <span class="item-price">￥{{ item.price }}</span>
                                
                            </div>
                        </div>
                    </div>
                    <ul class="tree-grid" v-if="category.children && category.children.length > 0">
                        <li class="tree-item" v-for="(item, index) in category.children" :key="index" wx:key="id">
                            <a  href="/pages/search/result?category={{ item.id }}">{{ item.name }}</a>
                            <ul class="tree-item-chidren" v-if="item.children && item.children.length > 0">
                                <li class="tree-item" v-for="(it, i) in item.children" :key="i" wx:key="id">
                                    <a  href="/pages/search/result?category={{ it.id }}">{{ it.name }}</a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </scroll-view>

        </div>
    </div>
</template>
<script lang="ts">
import { IMyApp } from '../../app.vue';
import { ICategory, ISite } from '../../api/model';
import { getCategory } from '../../api/category';
import { WxPage, WxJson, TouchEvent } from '../../../typings/wx/lib.vue';

const app = getApp<IMyApp>();

interface IPageData {
    categories: ICategory[],
    category: ICategory | null,
    subtotal: ISite | null
}
@WxJson({
    navigationBarTitleText: "分类",
    navigationBarBackgroundColor: "#f4f4f4",
    navigationBarTextStyle: "black"
})
export class Index extends WxPage<IPageData> {
    public data: IPageData = {
        categories: [],
        subtotal: null,
        category: null,
    };

    onLoad() {
        app.getSite().then(res => {
            this.setData({
                subtotal: res,
            });
        });
        app.getCategories().then(res => {
            this.setData({
                categories: res
            });
            this.tapSelected(res[0], 0);
        });
    }

    public tapSelectedItem(e: TouchEvent) {
        const index: number = e.currentTarget.id as number || 0;
        this.tapSelected(this.data.categories[index], index);
    }

    public tapSelected(item: ICategory, index: number) {
        if (item.goods_list) {
            this.setData({
                category: item
            });
            return;
        }
        getCategory(item.id, 'goods_list,children').then(res => {
            let categories = this.data.categories;
            categories[index] = res;
            this.setData({
                category: res,
                categories: categories
            });
        });
    }
}
</script>
<style lang="scss" scoped>
page {
    background-color: #f4f4f4;
}
</style>
