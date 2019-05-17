<template>
    <div>
        <div class="swipe-box title-list">
            <div class="swipe-row" v-for="(item, index) in items" :key="index">
                <div class="swipe-content title-item">
                    <div class="name">公司</div>
                    <p>发票类型：增值税普通发票</p>
                    <p>税务登记号：11123545656</p>
                </div>
                <div class="actions-right">
                    <a @click="tapEdit(item)">
                        <i class="fa fa-edit"></i>
                    </a>
                    <i class="fa fa-trash"></i>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app';
import { WxJson, WxPage } from '../../../typings/wx/lib.wx.page';
const app = getApp<IMyApp>();

interface IPageData {
    items: any[]
}
@WxJson({
    navigationBarTitleText: "发票抬头",
    navigationBarBackgroundColor: "#f4f4f4",
    navigationBarTextStyle: "black"
})
export class Index extends WxPage<IPageData> {
    public data: IPageData = {
        items: []
    }

    tapEdit(item?: any) {

    }
}
</script>
<style lang="scss" scoped>

</style>
