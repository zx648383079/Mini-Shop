<template>
    <div>
        <div class="share-box">
            <img src="" alt="">
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
