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
                    {{ item.card_number }}
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { ICard } from '../../api/model';
import { getBankCardList } from '../../api/user';

interface IPageData {
    items: ICard[],
}

export class Card extends WxPage<IPageData> {
    
    public data: IPageData = {
        items: []
    };
    public has_more = true;
    public page = 1;
    public isLoading = false;

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
        this.goPage( ++ this.page);
    }

    /**
     * refresh
     */
    public tapRefresh() {
        this.data.items = [];
        this.isLoading = false;
        this.has_more = true;
        this.goPage(this.page = 1);
    }

    public goPage(page: number) {
        if (this.isLoading || !this.has_more) {
            return;
        }
        this.isLoading = true;
        getBankCardList({
            page,
        }).then(res => {
            this.page = page;
            this.has_more = res.paging.more;
            this.isLoading = false;
            if (!res.data) {
                return;
            }
            this.setData({
                items: [].concat(this.data.items as never[], res.data as never[])
            });
        });
    }
}
</script>
<style lang="scss" scoped>
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
        img {
            width: 60px;
            height: 60px;
        }
    }
    .info {
        .bank {
            line-height: 30px;
            font-weight: 700;
            font-size: 20px;
            em {
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
