<template>
    <div>
        <BackHeader title="申请开票"/>
        <div class="has-header has-double-footer">
            <div class="order-mini-item" v-for="(item, index) in items" :key="index">
                <i class="fa check-box"></i>
                <div class="info">
                    <div class="name">{{ item }}</div>
                    <p>2018-123</p>
                </div>
                <div class="amount">
                    ￥200
                </div>
            </div>
        </div>
        <div class="invoice-footer">
            <div>
                <i class="fa check-box"></i>
                全选
            </div>
            <div>
                已选择0笔订单
            </div>
            <div>
                <p>可开票金额￥0</p>
                <p>已选金额￥0</p>
            </div>
            <div>
                <a href="">立即开票</a>
            </div>
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
    public items = [1, 1, 2, 3];
}
</script>
<style lang="scss" scoped>

</style>
