<template>
    <div>
        <div class="share-box">
            <img src="" alt="">
        </div>
    </div>
</template>
<script lang="ts">
import { WxPage, WxJson } from '../../../typings/wx/lib.vue';

interface IPageData {
}
@WxJson({
    navigationBarTitleText: "推荐二维码",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})
export class Share extends WxPage<IPageData> {

}
</script>
<style lang="scss" scoped>

</style>
