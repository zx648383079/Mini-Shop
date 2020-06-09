<template>
    <div>
        <div class="collect-page">
            <div :loading="isLoading" :more="has_more" @refresh="tapRefresh" @more="tapMore">
                <div class="swipe-box goods-list">
                    <SwipeRow name="goods-item" v-for="(item, index) in filterItems" :key="index" @remove="tapRemove(item, index)" :index="index">
                        <div slot="content">
                            <div class="goods-img">
                                <img :src="item.goods.thumb" alt="">
                            </div>
                            <div class="goods-info">
                                <h4>{{item.goods.name}}</h4>
                                <span>{{ item.goods.price }}</span>
                            </div>
                        </div>
                    </SwipeRow>
                </div>
                <div class="order-empty" v-if="!filterItems || filterItems.length < 1">
                    您还没有收藏商品
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { WxJson, WxPage } from '../../../typings/wx/lib.vue';
import { removeCollect, getCollect } from '../../api/user';
import { ICollect } from '../../api/model';

interface IPageData {
}
@WxJson({
    navigationBarTitleText: "我的收藏",
    navigationBarBackgroundColor: "#f4f4f4",
    navigationBarTextStyle: "black"
})
export class Index extends WxPage<IPageData> {
    public items: ICollect[] = [];

    public has_more = true;
    public page = 1;
    public isLoading = false;


    get filterItems(): ICollect[] {
        return this.items.filter(item => {
            return !!item.goods;
        });
    }

    public onLoad() {
        this.tapRefresh();
    }

    public tapRemove(item: ICollect, index: number) {
        removeCollect(item.goods_id).then(res => {
            if (!res.data) {
                this.items.splice(index, 1);
            }
        });
    }

    public tapMore() {
        this.goPage( ++ this.page);
    }

    /**
     * refresh
     */
    public tapRefresh() {
        this.items = [];
        this.isLoading = false;
        this.has_more = true;
        this.goPage(this.page = 1);
    }

    public goPage(page: number) {
        if (this.isLoading || !this.has_more) {
            return;
        }
        this.isLoading = true;
        getCollect({
            page,
        }).then(res => {
            this.has_more = res.paging.more;
            this.isLoading = false;
            if (!res.data) {
                return;
            }
            this.items = [].concat(this.items as never[], res.data as never[]);
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
