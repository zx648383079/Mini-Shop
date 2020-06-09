<template>
    <div>
        <div class="address-list">
            <SwipeRowBox>
                <SwipeRow name="address-item" right-width="100" left-width="350" v-for="(item, index) in items" :key="index" index="index">
                    <div slot="left" class="actions-left">
                        <i class="read">标为已读</i>
                    </div>
                    <div slot="content" class="swipe-content">
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
                    <div slot="right" class="actions-right">
                        <i class="fa fa-trash" @click="tapRemove"></i>
                    </div>
                </SwipeRow>
            </SwipeRowBox>
        </div>
    </div>
</template>
<script lang="ts">
import { WxPage, WxJson } from '../../../typings/wx/lib.vue';

interface IPageData {
    items: any[];
}
@WxJson({
    navigationBarTitleText: '我的消息',
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white",
    usingComponents: {
        SwipeRowBox: '/components/SwipeRow/box',
        SwipeRow: '/components/SwipeRow/index'
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
.swipe-content {
    width: 750rpx;
}
.actions-right,
.actions-left {
    height: 110rpx;
    display: flex;
    direction: row;
    text-align: center;
    vertical-align: middle;
    line-height: 110rpx;
    .read {
        background-color: #ccc;
        color: #fff;
        width: 350rpx;
    }
    .fa-trash {
        background-color: red;
        color: #fff;
        width: 150rpx; 
    }
}

</style>
