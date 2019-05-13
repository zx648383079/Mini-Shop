<template>
    <div>
        <CatItem :items="items" @click="tapCategory"/>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app';
import { WxPage, WxJson, CustomEvent } from '../../../typings/wx/lib.wx.page';
import { IArticleCategory } from '../../api/model';
import { getCategories } from '../../api/category';
const app = getApp<IMyApp>();

interface IPageData {
    items: IArticleCategory[],
    id: number,
}
@WxJson({
    usingComponents: {
        CatItem: 'Child/CatItem'
    },
    navigationBarTitleText: "分类",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white",
})
export class Category extends WxPage<IPageData> {
    public data: IPageData = {
        items: [],
        id: 0
    }

    onLoad(query?: any) {
        const id = parseInt(query.id + '');
        if (id) {
            this.setData({
                id
            });
        }
        this.tapRefresh();
    }
    /**
     * tapCategory
     */
    public tapCategory(e: CustomEvent) {
        this.setData({
            id: e.detail.id as number
        });
        this.tapRefresh();
    }

    public tapRefresh() {
        getCategories(this.data.id).then(res => {
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
