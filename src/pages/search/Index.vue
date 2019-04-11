<template>
    <div>
        <SearchBar v-show="isSearch" v-model="keywords" @search="tapSearch"></SearchBar>
        <div v-show="!isSearch">
            <header class="top">
                <div class="search-box under-search">
                    <a class="home-btn" @click="tapHome">
                        <i class="fa fa-home"></i>
                    </a>
                    <form @click="tapEnterSearch">
                        <i class="fa fa-search" aria-hidden="true"></i>
                        <input type="text" readonly="" name="keywords" :value="searchParams.keywords">
                        <i class="fa fa-times-circle" @click="tapNewSearch"></i>
                    </form>
                </div>
            </header>
            <div class="has-header">
                <PullToRefresh :loading="isLoading" :more="has_more"   @refresh="tapRefresh" @more="tapMore">
                    <div class="goods-list">
                        <GoodsItem v-for="(item, index) in items" :key="index" @enter="tapProduct" :item="item" @addCart="tapAddCart"></GoodsItem>
                    </div>
                </PullToRefresh>
            </div>
        </div>
        <CartDialog :mode="mode" :product="goods" @close="mode = 0"/>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app';
import { IProduct } from '../../api/model';
import { WxPage, WxJson } from '../../../typings/wx/lib.wx.page';
const app = getApp<IMyApp>();

interface IPageData {
}

interface ISearch {
    keywords: string,
    category: number,
    brand: number,
    page: number,
}
@WxJson({
    navigationBarTitleText: "搜索",
    navigationBarBackgroundColor: "#f4f4f4",
    navigationBarTextStyle: "black"
})
export class Index extends WxPage<IPageData> {

    public items: IProduct[] = [];
    public isSearch = true;
    public keywords = '';
    public has_more = true;
    public isLoading = false;
    public searchParams: ISearch = {
        keywords: '',
        category: 0,
        brand: 0,
        page: 1,
    };
    public mode: number = 0;
    public goods: IProduct | null = null;

    public created() {
        this.isSearch = Object.keys(this.$route.query).length === 0;
        this.searchParams = Object.assign(this.searchParams, this.$route.query);
        if (!this.isSearch) {
            this.tapRefresh();
        }
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.has_more) {
            return;
        }  
        this.goPage(this.searchParams.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        getList({
            page: page,
            keywords: this.searchParams.keywords,
            category: this.searchParams.category,
            brand: this.searchParams.brand,
        }).then(res => {
            this.searchParams.page = page;
            this.has_more = res.paging.more;
            this.isLoading = false;
            if (page < 2) {
                this.items = res.data;
                return;
            }
            this.items = [].concat(this.items as never[], res.data as never[]);
        });
    }
    public tapProduct(item: IProduct) {
        this.$router.push({name: 'product', params: {id: item.id + ''}});
    }
    public tapAddCart(item: IProduct) {
        if (this.goods && this.goods.id == item.id) {
            this.mode = 1;
            return;
        }
        getInfo(item.id).then(res => {
            this.goods = res;
            this.mode = 1;
        }); 
    }
    public tapSearch(keywords: string) {
        this.searchParams.keywords = keywords;
        this.isSearch = false;
        this.tapRefresh();
    }
    public tapHome() {
        this.$router.push('/');
    }
    public tapEnterSearch() {
        this.keywords = this.searchParams.keywords;
        this.isSearch = true;
    }
    public tapNewSearch() {
        this.searchParams.keywords = this.keywords = '';
        this.isSearch = true;
    }
}
</script>