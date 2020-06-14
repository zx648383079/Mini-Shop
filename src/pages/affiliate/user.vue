<template>
    <div>
        <div class="swipe-box address-list">
            <div class="swipe-row" v-for="(item, index) in items" :key="index">
                <div class="address-item">
                    <div class="address-first">
                        <img :src="item.avatar" alt="">
                    </div>
                    <div class="address-info">
                        <h3 class="name">{{ item.name }}</h3>
                        <p class="desc">
                            
                        </p>
                    </div>
                </div>
            </div>

            <div class="empty-box" v-if="!items || items.length < 1">
                您没有推荐会员
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { WxPage, WxJson } from "../../../typings/wx/lib.vue";
import { IUser } from "../../api/model";
import { getUsers } from '../../api/affiliate';

interface IPageData {
    items: IUser[],
    page: number,
    hasMore: boolean,
    isLoading: boolean,
}
@WxJson({
    navigationBarTitleText: "推荐的用户",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white",
    onReachBottomDistance: 10,
    enablePullDownRefresh: true
})
export default class User extends WxPage<IPageData> {
    public data: IPageData = {
        items: [],
        page: 1,
        hasMore: true,
        isLoading: false,
    }


    public onLoad() {
        this.tapRefresh();
    }

    onPullDownRefresh() {
        this.tapRefresh();
    }

    onReachBottom() {
        this.tapMore();
    }

    public tapMore() {
        if (!this.data.hasMore) {
            return;
        }
        this.goPage(this.data.page + 1);
    }

    /**
     * refresh
     */
    public tapRefresh() {
        this.goPage(1);
    }

    public goPage(page: number) {
        let data = this.data;
        if (data.isLoading) {
            return;
        }
        data.isLoading = true;
        this.setData(data);
        getUsers({
            page,
        }).then(res => {
            wx.stopPullDownRefresh();
            data.hasMore = res.paging.more;
            data.isLoading = false;
            if (!res.data) {
                return;
            }
            data.items = [].concat(data.items as never[], res.data as never[]);
            this.setData(data);
        });
    }

}
</script>
<style lang="scss" scoped>
page {
    background-color: #f4f4f4;
}

.address-item {
    min-height: 80px;
    background-color: #fff;
    margin-bottom: 10px;
    .desc {
        color: #777;
    }
}
</style>
