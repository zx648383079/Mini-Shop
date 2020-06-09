<template>
    <div>

    </div>
</template>
<script lang="ts">
import { WxJson, WxPage } from '../../../typings/wx/lib.vue';

interface IPageData {
}
@WxJson({
    navigationBarTitleText: "售后",
    navigationBarBackgroundColor: "#f4f4f4",
    navigationBarTextStyle: "black"
})
export class Detail extends WxPage<IPageData> {

}
</script>
<style lang="scss" scoped>

</style>
