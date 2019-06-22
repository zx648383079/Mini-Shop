<template>
    <div>
        <div v-if="article">
            <div class="article-title">{{ article.title }}</div>
            <div class="article-status">
                <span class="author"><i class="fa fa-edit"></i><b>admin</b></span>
                <span class="category"><i class="fa fa-bookmark"></i><b>其他</b></span>
                <span class="comment"><i class="fa fa-comments"></i><b>0</b></span>
                <span class="agree"><i class="fa fa-thumbs-o-up"></i><b>0</b></span>
                <span class="click"><i class="fa fa-eye"></i><b>31</b></span>
            </div>
            <div class="article-content" v-html="article.content">
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app';
import { WxPage, WxJson } from '../../../typings/wx/lib.wx.page';
import { IArticle } from '../../api/model';
import { getArticle } from '../../api/article';
const app = getApp<IMyApp>();

interface IPageData {
    article: IArticle|null
}
@WxJson({
    navigationBarTitleText: "文章",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white",
})
export class Detail extends WxPage<IPageData> {
    public data = {
        article: null
    };

    onLoad(option: any) {
        const id = parseInt(option.id);
        if (!id) {
            wx.navigateBack({
                delta: 0
            });
            return;
        }
        getArticle(id).then(res => {
            this.setData({
                article: res
            });
        });   
    }
}
</script>
<style lang="scss" scoped>

</style>
