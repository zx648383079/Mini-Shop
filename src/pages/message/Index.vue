<template>
    <div>
        <div class="address-list">
            <SwipeRowBox>
                <SwipeRow name="address-item" right-width="100" v-for="(item, index) in items" :key="index" bind:remove="tapRemove(item)" index="index">
                    <div slot="content">
                        <div class="address-first">
                            <span>系</span>
                        </div>
                        <div class="address-info">
                            <h3>213213213123</h3>
                            <p>
                                2019-29
                            </p>
                        </div>
                    </div>
                    <div slot="right">
                        <i class="fa fa-trash" @click="tapRemove"></i>
                    </div>
                </SwipeRow>
            </SwipeRowBox>
        </div>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app';
import { WxPage, WxJson } from '../../../typings/wx/lib.wx.page';
const app = getApp<IMyApp>();

interface IPageData {
    items: any[];
}
@WxJson({
    navigationBarTitleText: '我的消息',
    usingComponents: {
        'SwipeRowBox': '/components/SwipeRow/box',
        'SwipeRow': '/components/SwipeRow/index'
    }
})
export class Index extends WxPage<IPageData> {
    public data: IPageData = {
        items: ['1231231', 1002]
    };

    public tapRemove(item: any) {
        console.log(item)
    }
}
</script>
<style lang="scss" scoped>

</style>
