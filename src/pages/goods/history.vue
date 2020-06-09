<template>
    <div>
        <div class="collect-page">
            <div :loading="isLoading" :more="has_more" @refresh="tapRefresh" @more="tapMore">
                <div class="swipe-box goods-list">
                    <SwipeRow name="goods-item" v-for="(item, index) in items" :key="index" @remove="tapRemove(item)" :index="index" ref="swiperow">
                        <div class="goods-img">
                            <img :src="item.thumb" alt="">
                        </div>
                        <div class="goods-info">
                            <h4>{{item.name}}</h4>
                            <span>{{ item.price }}</span>
                        </div>
                    </SwipeRow>
                </div>
                <div class="order-empty" v-if="!items || items.length < 1">
                    您没有浏览记录
                </div>
            </div>
        </div>
        <div class="add-btn" @click="tapClear">清空</div>
    </div>
</template>
<script lang="ts">
import { WxJson, WxPage } from '../../../typings/wx/lib.vue';
import { IProduct, SET_GOODS_HISTORY } from '../../api/model';
import { getList } from '../../api/product';

interface IPageData {
    goodsId: number[],
    items: IProduct[],
    has_more: boolean,
    page: number,
    isLoading: boolean
}
@WxJson({
    navigationBarTitleText: "我的足迹",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white",
    onReachBottomDistance: 10,
    enablePullDownRefresh: true,
})
export class History extends WxPage<IPageData> {

    public data: IPageData = {
        goodsId: [],
        items: [],
        has_more: true,
        page: 1,
        isLoading: false
    }

    public onLoad() {
        this.tapRefresh();
    }

    public tapRemove(item: IProduct) {
        let goodsId = this.data.goodsId;
        for (let i = 0; i < goodsId.length; i++) {
            if (goodsId[i] === item.id) {
                goodsId.splice(i, 1);
                break;
            }
        }
        wx.setStorageSync(SET_GOODS_HISTORY, goodsId);
        this.setData({
            goodsId
        });
    }

    public tapClear() {
        let that = this;
        wx.showModal({
            title: '提示',
            content: '确认清空浏览记录？',
            success() {
                that.setData({
                    goodsId: [],
                    items: [],
                    has_more: false,
                    isLoading: false
                });
                wx.removeStorageSync(SET_GOODS_HISTORY);
            }
        })
    }

    onPullDownRefresh() {
        this.tapRefresh();
    }

    onReachBottom() {
        this.tapMore();
    }

    public tapMore() {
        this.goPage(this.data.page + 1);
    }

    /**
     * refresh
     */
    public tapRefresh() {
        this.setData({
            goodsId: wx.getStorageSync(SET_GOODS_HISTORY) || [],
            items: [],
            has_more: true,
            isLoading: true
        });
        if (!this.data.goodsId || this.data.goodsId.length < 1) {
            this.setData({
                has_more: false,
                isLoading: false
            });
            return;
        }
        this.goPage(1);
    }

    public goPage(page: number) {
        if (this.data.isLoading || !this.data.has_more) {
            return;
        }
        this.setData({
            isLoading: true,
            page
        });
        getList({
            id: this.data.goodsId,
            page,
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
.order-empty {
    font-size: 40px;
    color: #ccc;
    text-align: center;
    padding-top: 20vh;
}
</style>
