<template>
    <div>
        <header class="top">
            <a @click="tapBack" class="back">
                <i class="fa fa-chevron-left" aria-hidden="true"></i>
            </a>
            <div class="top-tab">
                <a @click="tapProductScroll('info')">商品</a>
                <a @click="tapProductScroll('detail')">详情</a>
                <a class="active">评价</a>
                <a  @click="tapProductScroll('recommend')">推荐</a>
            </div>
        </header>

        <div class="has-header">
            <PullToRefresh :loading="isLoading" :more="has_more" @refresh="tapRefresh" @more="tapMore">
                <div id="comments" class="comment-box">
                    <div class="comment-subtotal" v-if="comment">
                        评分
                        <Star :star="comment.avg"/>
                        <span>{{ comment.favorable_rate }}%</span>好评
                    </div>
                    <div class="comment-stats" v-if="comment && comment.tags && comment.tags.length > 0">
                        <a v-for="(item, index) in comment.tags" :key="index">{{ item.label }}（{{ item.count }}）</a>
                    </div>
                    <CommentPage :items="items"/>
                </div>
            </PullToRefresh>
            
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

export class Index extends WxPage<IPageData> {
    public comment: ICommentSubtotal | null = null;
    public items: IComment[] = [];
    public item_id: number = 0;
    public item_type: number = 0;
    public has_more = true;
    public page = 1;
    public isLoading = false;

    public created() {
        this.item_id = parseInt(this.$route.params.id);
        if (!this.item_id) {
            Toast('商品错误');
            this.$router.push('/');
            return;
        }
        getCommentSubtotal(this.item_id).then(res => {
            this.comment = res;
        });
        this.tapRefresh();
    }

    public tapBack() {
        if (window.history.length <= 1) {
            this.$router.push('/');
            return;
        }
        this.$router.go(-1);
    }

    public tapMore() {
        this.goPage( ++ this.page);
    }

    /**
     * refresh
     */
    public tapRefresh() {
        this.items = [];
        this.isLoading = false;
        this.has_more = true;
        this.goPage(this.page = 1);
    }

    public goPage(page: number) {
        if (this.isLoading || !this.has_more) {
            return;
        }
        this.isLoading = true;
        getCommentList({
            item_id: this.item_id,
            item_type: this.item_type,
            page,
        }).then(res => {
            this.has_more = res.paging.more;
            this.isLoading = false;
            if (!res.data) {
                return;
            }
            this.items = [].concat(this.items as never[], res.data as never[]);
        });
    }

    /**
     * tapProductScroll
     */
    public tapProductScroll(id: string) {
        this.$router.replace({name: 'product', params: {id: this.item_id + ''}, hash: '#'+id});
    }
}
</script>
<style lang="scss" scoped>

</style>
