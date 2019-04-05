<template>
    <div>
      <div class="has-header">
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
                <a @click="$router.push('/affiliate/order')">
                    <i class="fa fa-coins" aria-hidden="true"></i>
                    推荐的订单
                    <i class="fa fa-chevron-right" aria-hidden="true"></i>
                </a>
                <a @click="$router.push('/affiliate/user')">
                    <i class="fa fa-users" aria-hidden="true"></i>
                    推荐的会员
                    <i class="fa fa-chevron-right" aria-hidden="true"></i>
                </a>
                <a @click="$router.push('/affiliate/share')">
                    <i class="fa fa-share" aria-hidden="true"></i>
                    我的分享
                    <i class="fa fa-chevron-right" aria-hidden="true"></i>
                </a>
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

}
</script>
<style lang="scss" scoped>

</style>
