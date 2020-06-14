<template>
    <div class="collect-page slide-box">
        <div class="goods-list">
            <div class="item" v-for="(item, index) in items" :key="index" :index="item.id">
                <MpSlideView buttons="{{ item.buttons }}" bindbuttontap="slideButtonTap" >
                    <div class="goods-item">
                        <div class="goods-img">
                            <img :src="item.goods.thumb" alt="">
                        </div>
                        <div class="goods-info">
                            <h4>{{item.goods.name}}</h4>
                            <span>{{ item.goods.price }}</span>
                        </div>
                    </div>
                </MpSlideView>
            </div>
        </div>
        <div class="empty-box" v-if="!items || items.length < 1">
            您还没有收藏商品
        </div>
    </div>
</template>
<script lang="ts">
import { WxJson, WxPage, CustomEvent } from '../../../typings/wx/lib.vue';
import { removeCollect, getCollect } from '../../api/user';
import { ICollect } from '../../api/model';

interface IPageData {
    items: ICollect[],
    page: number,
    hasMore: boolean,
    isLoading: boolean,
}
@WxJson({
    usingComponents: {
        MpSlideView: 'weui-miniprogram/slideview/slideview'
    },
    navigationBarTitleText: "我的收藏",
    navigationBarBackgroundColor: "#f4f4f4",
    navigationBarTextStyle: "black",
    onReachBottomDistance: 10,
    enablePullDownRefresh: true,
})
export class Index extends WxPage<IPageData> {
    
    public data: IPageData = {
        items: [],
        page: 1,
        hasMore: true,
        isLoading: false,
    };

    public onLoad() {
        this.tapRefresh();
    }

    onPullDownRefresh() {
        this.tapRefresh();
    }

    onReachBottom() {
        this.tapMore();
    }

    slideButtonTap(e: CustomEvent) {
        const id = e.detail.data as number;
        for (let i = 0; i < this.data.items.length; i++) {
            if (this.data.items[i].id === id) {
                return this.tapRemove(i);
            }
        }
    }

    public tapRemove(index: number) {
        let data = this.data;
        const item = data.items[index];
        removeCollect(item.goods_id).then(res => {
            if (!res.data) {
                data.items.splice(index, 1);
                this.setData(data);
            }
        });
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
        getCollect({
            page,
        }).then(res => {
            wx.stopPullDownRefresh();
            data.hasMore = res.paging.more;
            data.isLoading = false;
            if (!res.data) {
                this.setData(data);
                return;
            }
            data.items = [].concat(data.items as never[], res.data as never[]).filter((item: ICollect) => {
                return item.goods;
            });
            data.items = this.formatButton(data.items);
            this.setData(data);
        });
    }

    private formatButton(res: any[]): any[] {
        return res.map(item => {
            if (item.goods.name.length > 15) {
                item.goods.name = item.goods.name.substr(0, 15) + '...';
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
