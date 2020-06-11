<template>
    <div class="collect-page slide-box">
        <div class="goods-list">
            <MpSlideView v-for="(item, index) in items" :key="index" :index="index" buttons="{{slideButtons}}" bindbuttontap="slideButtonTap">
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
        <div class="order-empty" v-if="!items || items.length < 1">
            您还没有收藏商品
        </div>
    </div>
</template>
<script lang="ts">
import { WxJson, WxPage } from '../../../typings/wx/lib.vue';
import { removeCollect, getCollect } from '../../api/user';
import { ICollect } from '../../api/model';

interface IPageData {
    items: ICollect[],
    page: number,
    hasMore: boolean,
    isLoading: boolean,
    slideButtons: any[],
}
@WxJson({
    usingComponents: {
        MpSlideView: 'weui-miniprogram/slideview/slideview'
    },
    navigationBarTitleText: "我的收藏",
    navigationBarBackgroundColor: "#f4f4f4",
    navigationBarTextStyle: "black",
    onReachBottomDistance: 100,
})
export class Index extends WxPage<IPageData> {
    
    public data: IPageData = {
        items: [],
        page: 1,
        hasMore: true,
        isLoading: false,
        slideButtons: [
            {
              type: 'warn',
              text: '删除',
            }
        ]
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

    slideButtonTap(e: any) {
        console.log(e);
        
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
        this.goPage(this.data.page);
    }

    /**
     * refresh
     */
    public tapRefresh() {
        this.goPage(1);
    }

    public goPage(page: number) {
        let data = this.data;
        if (data.isLoading || !data.hasMore) {
            return;
        }
        data.isLoading = true;
        this.setData(data);
        getCollect({
            page,
        }).then(res => {
            data.hasMore = res.paging.more;
            data.isLoading = false;
            if (!res.data) {
                return;
            }
            data.items = [].concat(data.items as never[], res.data as never[]).filter((item: ICollect) => {
                return item.goods;
            });
            this.setData(data);
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
