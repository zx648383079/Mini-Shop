<template>
    <div>
        <BackHeader :title="$route.meta.title"/>
        <div class="has-header">
            <CommentItem v-for="(item, index) in items" :key="index" :item="item" @commented="tapCommented(index)"/>
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
}
@WxJson({
    navigationBarTitleText: "售后",
    navigationBarBackgroundColor: "#f4f4f4",
    navigationBarTextStyle: "black"
})
export class Create extends WxPage<IPageData> {
    items: IOrderGoods[] = [];

    created() {
        getUnCommentGoods(this.$route.query).then(res => {
            if (!res.data || res.data.length < 1) {
                this.tapBack();
                return;
            }
            this.items = res.data;
        });
    }

    public tapBack() {
        this.$router.back();
    }

    public tapCommented(i: number) {
        if (this.items.length < 2) {
            this.tapBack();
            return;
        }
        this.items.splice(i, 1);
    }
}
</script>
<style lang="scss" scoped>

</style>
