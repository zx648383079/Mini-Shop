<template>
    <div>
        <BackHeader :title="$route.meta.title"/>
        <div class="has-header has-footer">
            <div>
                <div class="goods-item" v-for="(item, index) in items" :key="index">
                    <div class="goods-img">
                        <img :src="item.thumb" alt="">
                    </div>
                    <div class="goods-info">
                        <h4>{{ item.name }}</h4>
                        <span class="amount"> x {{ item.amount }}</span>
                    </div>
                </div>
            </div>
            <div v-if="mode < 2">
                <div class="actions" v-if="status == ORDER_STATUS.SHIPPED">
                    <span>您是否已收到货?</span>
                    <div class="radio-box">
                        <span :class="{ active: mode < 1 }" @click="mode = 0">未收货</span>
                        <span :class="{ active: mode == 1 }" @click="mode = 1">已收货</span>
                    </div>
                </div>
                <RefundGrid v-if="mode < 1"/>
                <div class="choose-mode" v-if="mode == 1">
                    <button class="btn" @click="mode = 2">申请返修/退换货</button>
                </div>
            </div>
            <div class="menu-list" v-if="mode == 2">
                <MenuItem title="维修" icon="fa-hammer" @click="mode = 3"/>
                <MenuItem title="退货" icon="fa-undo" @click="mode = 4"/>
                <MenuItem title="换货" icon="fa-exchange-alt" @click="mode = 5"/>
            </div>
            <AfterSalegGrid v-if="mode > 2" :mode="mode"/>
        </div>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app';
const app = getApp<IMyApp>();

interface IPageData {
}

export class Index extends WxPage<IPageData> {
    public ORDER_STATUS = ORDER_STATUS;
    items: IOrderGoods[] = [];
    mode: number = 0;
    status: ORDER_STATUS = ORDER_STATUS.PAID_UN_SHIP;

    created() {
        getRefundGoods(this.$route.query).then(res => {
            if (!res.data || res.data.length < 1) {
                this.$router.push('/');
                return;
            }
            this.items = res.data;
            this.status = res.data[0].status as ORDER_STATUS;
            if (this.status == ORDER_STATUS.RECEIVED || this.status == ORDER_STATUS.FINISH) {
                this.mode = 2;
            }
        });
    }

}
</script>
<style lang="scss" scoped>
.goods-item {
    position: relative;
    background-color: #fff;
    display: grid;
    grid-template: 70px / 80px 1fr;
    padding: 5px;
    .goods-img {
        display: inline-block;
        img {
            width: 70px;
            height: 70px;
        }
    }
    .goods-info {
        display: inline-block;
        height: 70px;
        vertical-align: top;
        overflow: hidden;
        margin-bottom: 0;
        position: relative;
    }
}

.actions {
    line-height: 40px;
    .radio-box {
        float: right;
        span {
            display: inline-block;
            background-color: #fff;
            border: 1px solid #ccc;
            padding: 0 10px;
            margin-left: 10px;
            box-sizing: content-box;
            line-height: 35px;
            &.active {
                background-color: #d22222;
                color: #fff;
            }
        }
    }
}
.choose-mode {
    text-align: center;
    padding-top: 20vh;
    .btn {
        background-color: #d22222;
        line-height: 40px;
        color: #fff;
        
    }
}
</style>
