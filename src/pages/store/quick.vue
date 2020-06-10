<template>
    <div>
        <div class="store-page">
            <header class="store-header">
                <div class="search-back-box">
                    <a class="back" @click="tapBack">
                        <i class="fa fa-chevron-left" aria-hidden="true"></i>
                    </a>
                    <a class="search-entry" @click="$router.push('/search')">
                        <i class="fa fa-search" aria-hidden="true"></i>
                        <span>搜索本店商品</span>
                    </a>
                </div>
                <div class="store-info">
                    <div class="logo">
                        <img :src="'/assets/images/avatar/1.png' | assets" alt="">
                    </div>
                    <div class="info">
                        <div class="name">12345545</div>
                        <p>233万人收藏</p>
                    </div>
                    <div class="action">
                        <a href="">
                            <i class="fa fa-star"></i>    
                            收藏
                        </a>
                    </div>
                </div>
                <div class="tab-bar">
                    <a v-for="(item, index) in tabList" :key="index" @click="tapTab(index)" :class="tabIndex == index ? 'active' : ''">{{ item.name }}</a>
                </div>
            </header>

            <div class="store-body">
                <div class="goods-list">
                    <div class="item" v-for="(item, index) in items" :key="index">
                        <div class="item-img">
                            <a ><img :src="item.thumb" alt=""></a>
                        </div>
                        <div class="item-info">
                            <div class="item-title">{{item.name}}</div>
                            <span class="item-price">{{item.price}}</span>
                            <div class="item-actions">
                                <i class="fa fa-minus-circle" v-if="item.amount && item.amount > 0"  @click="tapMinus(item)"></i>
                                <span v-if="item.amount && item.amount > 0">{{ item.amount }}</span>
                                <i class="fa fa-plus-circle" @click="tapPlus(item)"></i>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { WxPage, WxJson } from '../../../typings/wx/lib.vue';
import { IProduct } from '../../api/model';
import { getList } from '../../api/product';

interface IPageData {
    items: IProduct[],
    hasMore: boolean,
    isLoading: boolean,
    page: number,
    tabIndex: number,
    tabList: any[]
}
@WxJson({
    navigationBarTitleText: "快速下单",
    navigationBarBackgroundColor: "#f4f4f4",
    navigationBarTextStyle: "black"
})
export class Quick extends WxPage<IPageData> {
    
    public data: IPageData = {
        items: [],
        hasMore: false,
        isLoading: false,
        page: 1,
        tabIndex: 0,
        tabList: [
            {
                name: '首页',
                status: 0,
            },
            {
                name: '全部商品',
                status: 0,
            },
            {
                name: '促销',
                status: 0,
            },
            {
                name: '动态',
                status: 0,
            },
        ]
    };

    public onLoad() {

    }

    public tapBack() {
        wx.navigateBack({
            delta: -1
        });
    }

    public tapTab(index: number) {
        this.setData({
            tabIndex: index
        });
    }

    /**
     * tapPlus
     */
    public tapPlus(item: IProduct) {
        if (!item.amount) {
            item.amount = 0;
        }
        item.amount ++;
        this.setData({
            items: this.data.items
        });
    }

    public tapMinus(item: IProduct) {
        if (!item.amount) {
            item.amount = 0;
        }
        item.amount = Math.max(0, item.amount - 1);
        this.setData({
            items: this.data.items
        });
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.data.hasMore) {
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
        getList({
            page,
        }).then(res => {
            let items = this.data.items;
            if (page < 2) {
                items = [];
            }
            res.data.forEach(item => {
                item.amount = 0;
                items.push(item);
            });
            this.setData({
                page,
                hasMore: res.paging.more,
                isLoading: false,
                items
            });
        });
    }
}
</script>
<style lang="scss" scoped>
.tab-bar {
    border-bottom: 1px solid #ccc;
}
.goods-list {
    display: block;
    text-align: left;
    .item {
        position: relative;
        display: grid;
        background-color: #fff;
        grid-template-columns: 100px 1fr;
        .item-img {
            height: 100px;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .item-price {
            color: red;
        }
        .item-actions {
            position: absolute;
            bottom: 20px;
            right: 20px;
            display: inline-block;
            span {
                display: inline-block;
                padding: 0 5px;
            }
            .fa-minus-circle {
                color: #777;
            }
        }
    }
}
</style>
