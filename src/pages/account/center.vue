<template>
    <div>
        <div class="account-box">
            <div class="line-item" v-for="(item, index) in items" :key="index">
                <span><i :class="['fab', item.icon]"></i>{{ item.name }}</span>
                <span>{{ item.id ? '已绑定' : '未绑定' }}</span>
                <i class="fa fa-chevron-right"></i>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { IConnect } from '../../api/model';
import { WxPage, WxJson } from '../../../typings/wx/lib.vue';
import { getConnect } from '../../api/account';
interface IPageData {
    items: IConnect[]
}

@WxJson({
    navigationBarTitleText: "账户安全",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})
export class Center extends WxPage<IPageData> {

    public data: IPageData = {
        items: []
    };

    public onLoad() {
        getConnect().then(res => {
            if (!res.data) {
                return;
            }
            this.setData({
                items: res.data
            });
        }); 
    }
}
</script>
<style lang="scss" scoped>

</style>
