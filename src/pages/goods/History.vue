<template>
    <div>
        <BackHeader :title="$route.meta.title">
            <a v-if="items && items.length > 0" class="right" @click="tapClear">
                <i class="fa fa-trash-alt"></i>
            </a>
        </BackHeader>
        <div class="has-header collect-page">
            <PullToRefresh :loading="isLoading" :more="has_more" @refresh="tapRefresh" @more="tapMore">
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
            </PullToRefresh>
        </div>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app';
import { WxJson, WxPage } from '../../../typings/wx/lib.wx.page';
const app = getApp<IMyApp>();

interface IPageData {
}
@WxJson({
    navigationBarTitleText: "售后",
    navigationBarBackgroundColor: "#f4f4f4",
    navigationBarTextStyle: "black"
})
export class History extends WxPage<IPageData> {
    public items: IProduct[] = [];

    public has_more = true;
    public page = 1;
    public isLoading = false;
    public goodsId: number[] = [];

    public created() {
        this.tapRefresh();
    }

    public tapRemove(item: IProduct) {
        for (let i = 0; i < this.goodsId.length; i++) {
            if (this.goodsId[i] === item.id) {
                this.goodsId.splice(i, 1);
                break;
            }
        }
        setLocalStorage(SET_GOODS_HISTORY, this.goodsId);
    }

    public tapClear() {
        MessageBox.confirm('确认清空浏览记录？').then(action => {
            if (action !== 'confirm') {
                return;
            }
            this.goodsId = [];
            this.items = [];
            this.has_more = false;
            this.isLoading = false;
            removeLocalStorage(SET_GOODS_HISTORY);
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
        this.goodsId = getLocalStorage<number[]>(SET_GOODS_HISTORY, true);
        if (!this.goodsId || this.goodsId.length < 1) {
            this.has_more = false;
            this.isLoading = true;
            setTimeout(() => {
                this.isLoading = false;
            }, 500);
            return;
        }
        this.goPage(this.page = 1);
    }

    public goPage(page: number) {
        if (this.isLoading || !this.has_more) {
            return;
        }
        this.isLoading = true;
        getList({
            id: this.goodsId,
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
