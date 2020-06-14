<template>
    <div>
        <div class="has-footer">
            <div :class="['scroll-nav', isExpand ? 'unfold' : '']">
                <ul class="nav-ul">
                    <li class="nav-li" :class="{active: category == 0}" @click="tapCat(0)">
                            <text>全部</text>
                    </li>
                    <li  class="nav-li" v-for="(item, index) in categories" :key="index" :class="{active: category == item.id}" @click="tapCat(item.id)">
                            <text>{{ item.name }}</text>
                    </li>
                </ul>
                <span @click="isExpand = !isExpand" class="fa nav-arrow"></span>
            </div>

            <div>
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
                        <span v-if="item.can_receive && item.received >= item.send_value" class="status-icon status-close">已抢完</span>
                        <span v-if="item.received < item.send_value && item.can_receive" class="status-icon" @click="tapRecieve(index)">立即<br>领取</span>
                        <span v-if="!item.can_receive" class="status-icon status-received">已领</span>
                        <i v-if="item.received < item.send_value">剩余 {{ item.send_value > 0 ? 100 - Math.ceil(item.received * 100 / item.send_value) : 100 }} %</i>
                    </div>
                </div>
                <div class="empty-box" v-if="items.length < 1">
                    没有可领优惠券哦
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
import { ICategory, ICoupon } from '../../api/model';
import { getCouponList, receiveCoupon } from '../../api/coupon';
const app = getApp<IMyApp>();

interface IPageData {
    categories: ICategory[],
    category: number,
    items: ICoupon[],
    isExpand: boolean,
    hasMore: boolean,
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
        category: 0,
        items: [],
        isExpand: false,
        hasMore: true,
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

    /**
     * tapCat
     */
    public tapCat(id: number) {
        this.setData({
            category: id,
            isExpand: false
        });
        this.tapRefresh();
    }

    public tapRecieve(i: number) {
        const data = this.data;
        const item: ICoupon = data.items[i];
        if (!item.can_receive) {
            return;
        }
        receiveCoupon(item.id).then(res => {
            if (res.data) {
                wx.showToast({
                    title: '领取成功'
                });
                item.can_receive = false;
                this.setData(data);
            }
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
        let data = this.data;
        if (data.isLoading) {
            return;
        }
        data.isLoading = true;
        this.setData(data);
        getCouponList({
            category: data.category,
            page
        }).then(res => {
            wx.stopPullDownRefresh();
            data.hasMore = res.paging.more;
            data.isLoading = false;
            data.items = [].concat(data.items as never[], res.data as never[]);
            this.setData(data);
        }, () => {
            this.setData({
                isLoading: false
            });
        })
    }

}
</script>
<style lang="scss" scoped>
page {
    background-color: #f4f4f4;
}
</style>
