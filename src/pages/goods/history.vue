<template>
    <div>
        <div class="collect-page slide-box">
            <div class="swipe-box goods-list">
                <div class="item" v-for="(item, index) in items" :key="index" :index="item.id">
                    <MpSlideView buttons="{{ item.buttons }}" bindbuttontap="slideButtonTap" >
                        <div class="goods-item">
                            <div class="goods-img">
                                <img :src="item.thumb" alt="">
                            </div>
                            <div class="goods-info">
                                <h4>{{item.name}}</h4>
                                <span>{{ item.price }}</span>
                            </div>
                        </div>
                    </MpSlideView>
                </div>
            </div>
            <div class="empty-box" v-if="!items || items.length < 1">
                您没有浏览记录
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
    hasMore: boolean,
    page: number,
    isLoading: boolean
}
@WxJson({
    usingComponents: {
        MpSlideView: 'weui-miniprogram/slideview/slideview'
    },
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
        hasMore: true,
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
                    hasMore: false,
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
            hasMore: true,
            isLoading: false
        });
        if (!this.data.goodsId || this.data.goodsId.length < 1) {
            this.setData({
                hasMore: false,
                isLoading: false
            });
            return;
        }
        this.goPage(1);
    }

    public goPage(page: number) {
        if (this.data.isLoading || !this.data.hasMore) {
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
            items = this.formatButton(items);
            this.setData({
                hasMore: res.paging.more,
                isLoading: false,
                page,
                items
            });
        });
    }

    private formatButton(res: any[]): any[] {
        return res.map(item => {
            if (item.name.length > 20) {
                item.name = item.name.substr(0, 20) + '...';
            }
            item.buttons = [
                {
                    type: 'warn',
                    text: '删除',
                    data: item.id,
                }
            ];
            return item;
        });
    }
}
</script>
<style lang="scss" scoped>
page {
    background-color:#f4f4f4;
}
.item {
    margin-bottom:10px;
}
</style>
