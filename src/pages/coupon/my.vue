<template>
    <div>
        <div class="has-footer">
            <div class="tab-header">
                <div class="tab-item active">未使用</div>
                <div class="tab-item">使用记录</div>
                <div class="tab-item">已过期</div>
            </div>

            <div>
                <div class="my-coupon-item" v-for="(item, index) in items" :key="index" :calss="{expired: item.expired}">
                    <div class="price">
                        <em>¥300</em>
                        <p>满168可用</p>
                    </div>
                    <div class="info">
                        <p>{{ item.name }}</p>
                        <div class="time">
                            <span>2018.12.01-2018.12.01</span>
                            <a href="" v-if="!item.expired">立即使用</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <footer class="tab-bar">
            <a href="index">
                <i class="fa fa-gift" aria-hidden="true"></i>
                领券
            </a>
            <a class="active">
                <i class="fa fa-user" aria-hidden="true"></i>
                我的优惠券
            </a>
        </footer>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app';
import { WxJson, WxPage } from '../../../typings/wx/lib.wx.page';
const app = getApp<IMyApp>();

interface IPageData {
}
@WxJson({
    navigationBarTitleText: "我的优惠券",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white",
})
export class My extends WxPage<IPageData> {

}
</script>
<style lang="scss" scoped>

</style>
