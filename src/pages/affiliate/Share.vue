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
import { WxPage } from '../../../typings/wx/lib.wx.page';
const app = getApp<IMyApp>();

interface IPageData {
}

export class Share extends WxPage<IPageData> {

}
</script>
<style lang="scss" scoped>

</style>
