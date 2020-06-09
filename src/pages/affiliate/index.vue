<template>
    <div>
        <div class="affiliate-header">
            <div>
                <p>已推荐</p>
                <div class="money">0.00</div>
            </div>
            <div>
                <p>已分成</p>
                <div class="money">0.00</div>
            </div>
        </div>

        <div class="menu-list">
            <a class="item" href="order">
                <i class="fa fa-coins" aria-hidden="true"></i>
                推荐的订单
                <i class="fa fa-chevron-right" aria-hidden="true"></i>
            </a>
            <a class="item" href="user">
                <i class="fa fa-users" aria-hidden="true"></i>
                推荐的会员
                <i class="fa fa-chevron-right" aria-hidden="true"></i>
            </a>
            <a class="item" href="share">
                <i class="fa fa-share" aria-hidden="true"></i>
                我的分享
                <i class="fa fa-chevron-right" aria-hidden="true"></i>
            </a>
             <a class="item" href="rule">
                <i class="fa fa-share" aria-hidden="true"></i>
                规则
                <i class="fa fa-chevron-right" aria-hidden="true"></i>
            </a>
        </div>
    </div>
</template>
<script lang="ts">
import { WxPage, WxJson } from '../../../typings/wx/lib.vue';

interface IPageData {
}
@WxJson({
    navigationBarTitleText: "我的推荐",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})
export class Index extends WxPage<IPageData> {

}
</script>
<style lang="scss" scoped>

</style>
