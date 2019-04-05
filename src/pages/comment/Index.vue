<template>
    <div>
        <BackHeader :title="$route.meta.title"/>
        <div class="has-header">
            <div class="tab-bar order-header">
                <a v-for="(item, index) in status_list" :key="index" @click="tapStatus(item)" :class="status == item.status ? 'active' : ''">{{ item.name }}</a>
            </div>

            <div class="comment-list-box">
                <PullToRefresh :loading="isLoading" :more="has_more" @refresh="tapRefresh" @more="tapMore">
                    <div class="goods-list">
                        <GoodsItem v-for="(item, index) in items" :key="index" :item="item" @comment="tapComment(item)"/>
                    </div>
                </PullToRefresh>
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

export class Index extends WxPage<IPageData> {
    public status_list = [
        {
            name: '待评价',
            status: 0
        },
        {
            name: '已评价',
            status: 1
        },
    ];
    public items: IOrderGoods[] = [];
    public status = 0;
    public has_more = true;
    public page = 1;
    public isLoading = false;

    public created() {
        if (this.$route.query && this.$route.query.status) {
            this.status = parseInt(this.$route.query.status + '') || 0;
        }
        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.has_more) {
            return;
        }  
        this.goPage(this.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        getCommentGoods({
            status: this.status,
            page,
        }).then(res => {
            this.has_more = res.paging.more;
            this.isLoading = false;
            if (this.page < 2) {
                this.items = res.data as never[];
                return;
            }
            this.items = [].concat(this.items as never[], res.data as never[]);
        });
    }

    public tapStatus(item: any) {
        if (this.status == item.status) {
            return;
        }
        this.status = item.status;
        this.tapRefresh();
    }

    public tapComment(item:IOrderGoods) {
        this.$router.push({name: 'comment-create', query: {goods: item.id + ''}});
    }
}
</script>
<style lang="scss" scoped>

</style>
