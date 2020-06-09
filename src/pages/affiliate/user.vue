<template>
    <div>
        <div class="swipe-box address-list">
            <div class="swipe-row" v-for="(item, index) in items" :key="index">
                <div class="swipe-content address-item">
                    <div class="address-first">
                        <img :src="'/assets/images/avatar/14.png' | assets" alt="">
                    </div>
                    <div class="address-info">
                        <h3>213213213123</h3>
                        <p>
                            123
                        </p>
                    </div>
                </div>
                <div class="actions-right">
                    <i class="fa fa-trash"></i>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { WxPage, WxJson } from "../../../typings/wx/lib.vue";
interface IPageData {
    items: number[],
}
@WxJson({
    navigationBarTitleText: "推荐的用户",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})
export default class User extends WxPage<IPageData> {
    public data: IPageData = {
        items: [1]
    }
}
</script>
<style lang="scss" scoped>

</style>
