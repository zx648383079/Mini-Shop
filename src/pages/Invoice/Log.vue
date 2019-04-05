<template>
    <div>
        <BackHeader title="开票历史"/>
        <div class="has-header">
            <div class="log-hr">
                2018年12月
            </div>
            <div class="log-item" v-for="(item, index) in items" :key="index">
                <div class="info">
                    <div class="name">个人</div>
                    <p>2018-123</p>
                </div>
                <div class="amount">
                    ￥200
                </div>
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
    public items = [];
}
</script>
<style lang="scss" scoped>

</style>
