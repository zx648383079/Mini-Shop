<template>
    <div>
        <BackHeader title="物流信息"/>
        <div class="has-header">
            <div class="log-hr">
                2018年12月
            </div>
            <div class="log-item" v-for="(item, index) in items" :key="index">
                <div class="info">
                    <div class="name">已签收</div>
                    <p>11-11</p>
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

export class Logistics extends WxPage<IPageData> {
    items = [1];
}
</script>
<style lang="scss" scoped>

</style>
