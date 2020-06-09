<template>
    <div>
    </div>
</template>
<script lang="ts">
import { WxPage, WxJson } from '../../../typings/wx/lib.vue';

interface IPageData {
}
@WxJson({
    navigationBarTitleText: "推荐规则",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})
export class Rule extends WxPage<IPageData> {

}
</script>
<style lang="scss" scoped>

</style>
