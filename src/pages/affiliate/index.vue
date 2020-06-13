<template>
    <div>
        <div class="affiliate-header">
            <div>
                <p>已推荐</p>
                <div class="money">{{ total }}</div>
            </div>
            <div>
                <p>已分成</p>
                <div class="money">{{ money }}</div>
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
                <i class="fa fa-history" aria-hidden="true"></i>
                我的分享
                <i class="fa fa-chevron-right" aria-hidden="true"></i>
            </a>
             <a class="item" href="rule">
                <i class="fa fa-info" aria-hidden="true"></i>
                规则
                <i class="fa fa-chevron-right" aria-hidden="true"></i>
            </a>
        </div>
    </div>
</template>
<script lang="ts">
import { WxPage, WxJson } from '../../../typings/wx/lib.vue';
import { getSubtotal } from '../../api/affiliate';

interface IPageData {
    total: number;
    money: number;
}
@WxJson({
    navigationBarTitleText: "我的推荐",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})
export class Index extends WxPage<IPageData> {

    public data = {
        total: 0,
        money: 0
    };

    onLoad() {
        getSubtotal().then(res => {
            this.setData({
                total: res.total || 0,
                money: res.money || 0
            });
        });
    }

}
</script>
<style lang="scss" scoped>
page {
    background-color: #f4f4f4;
}
</style>
