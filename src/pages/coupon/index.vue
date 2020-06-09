<template>
    <div>
        <div class="has-footer">
            <div :class="['scroll-nav', isExpand ? 'unfold' : '']">
                <ul class="box">
                    <li v-for="(item, index) in categories" :key="index" class="item {{category == item.id ? 'active' : ''}}">
                        <span>{{ item.name }}</span>
                    </li>
                </ul>
                <a @click="isExpand = !isExpand" class="fa nav-arrow"></a>
            </div>

            <div :loading="isLoading" :more="has_more" @refresh="tapRefresh" @more="tapMore">
                <div class="coupon-item" v-for="(item, index) in items" :key="index">
                    <div class="thumb">
                        <img :src="item.thumb" alt="">
                    </div>
                    <div class="info">
                        <p>{{item.name }}</p>
                        <dl class="discount" v-if="item.type > 0">
                            <dd>8.8折</dd>
                            <dt>满168可用</dt>
                        </dl>
                        <div class="price" v-else>
                            <em>¥300</em>
                            满168可用
                        </div>
                    </div>
                    <div class="action">
                        <span class="status-icon">立即<br>领取</span>
                        <i>剩余76%</i>
                    </div>
                </div>
            </div>
        </div>

        <footer class="tab-bar">
            <a class="active">
                <i class="fa fa-gift" aria-hidden="true"></i>
                领券
            </a>
            <a href="my">
                <i class="fa fa-user" aria-hidden="true"></i>
                我的优惠券
            </a>
        </footer>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app.vue';
import { WxPage, WxJson } from '../../../typings/wx/lib.vue';
import { ICategory } from '../../api/model';
const app = getApp<IMyApp>();

interface IPageData {
    categories: ICategory[],
    status: number,
    items: any[],
    isExpand: boolean,
    has_more: boolean,
    page: number,
    isLoading: boolean
}
@WxJson({
    navigationBarTitleText: "领券",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white",
    enablePullDownRefresh: true,
    onReachBottomDistance: 10,
})
export class Index extends WxPage<IPageData> {
    public data: IPageData = {
        categories: [],
        status: 0,
        items: [],
        isExpand: false,
        has_more: true,
        page: 1,
        isLoading: false
    }

    public onLoad() {
        app.getCategories().then(res => {
            this.setData({
                categories: res
            });
        });
    }
    onPullDownRefresh() {
        this.tapRefresh();
    }

    onReachBottom() {
        this.tapMore();
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

    }

}
</script>
<style lang="scss" scoped>

</style>
