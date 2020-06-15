<template>
    <div>
        <div class="card-item" v-for="(item, index) in items" :key="index">
            <div class="icon">
                <img :src="item.icon" alt="">
            </div>
            <div class="info">
                <div class="bank">
                    {{ item.bank }}
                    <em v-if="item.status == 1">快捷支付</em>
                </div>
                <div class="tag">
                    {{ item.type == 1 ? '信用卡' : '储蓄卡' }}
                </div>
                <div class="card-no">
                    {{ item.card_no }}
                </div>
            </div>
        </div>

        <a class="add-btn" href="cardNew">
            <i class="fa fa-plus"></i>
            添加
        </a>
    </div>
</template>
<script lang="ts">
import { ICard } from '../../api/model';
import { getBankCardList } from '../../api/account';
import { WxPage, WxJson } from '../../../typings/wx/lib.vue';

interface IPageData {
    items: ICard[],
    hasMore: boolean,
    page: number,
    isLoading: boolean
}
@WxJson({
    navigationBarTitleText: "银行卡",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white",
    onReachBottomDistance: 10,
    enablePullDownRefresh: true,
})
export class Card extends WxPage<IPageData> {
    
    public data: IPageData = {
        items: [],
        hasMore: true,
        page: 1,
        isLoading: false
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
        if (this.data.isLoading) {
            return;
        }
        this.setData({
            isLoading: true,
            page
        });
        getBankCardList({
            page,
        }).then(res => {
            wx.stopPullDownRefresh();
            let items = [];
            if (page < 2) {
                items = res.data as never[];
            } else {
                items = [].concat(this.data.items as never[], res.data as never[]);
            }
            this.setData({
                hasMore: res.paging.more,
                isLoading: false,
                page,
                items
            });
        });
    }
}
</script>
<style lang="scss" scoped>
page {
    background-color: #f4f4f4;
}
.card-item {
    position: relative;
    background-color: #fff;
    height: 120px;
    padding-top: 10px;
    padding-left: 80px;
    margin: 10px 0;
    .icon {
        position: absolute;
        left: 10px;
        padding-top: 20px;
        image {
            width: 60px;
            height: 60px;
        }
    }
    .info {
        .bank {
            line-height: 30px;
            font-weight: 700;
            font-size: 20px;
            text {
                font-size: 14px;
                color: #f888;
            }
        }
        .tag {
            font-size: 14px;
            color: #767676;
        }
        .card-no {
            margin-top: 10px;
            line-height: 40px;
            font-weight: 600;
            font-size: 20px;
        }
    }
}

</style>
