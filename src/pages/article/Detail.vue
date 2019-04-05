<template>
    <div>
        <div class="has-header" v-if="article">
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
const app = getApp<IMyApp>();

interface IPageData {
}

export class Detail extends WxPage<IPageData> {
    public article: IArticle|null = null;

    created() {
        const id = parseInt(this.$route.params.id);
        if (!id) {
            this.$router.push('/');
            return;
        }
        getArticle(id).then(res => {
            this.article = res;
        });   
    }
}
</script>
<style lang="scss" scoped>

</style>
