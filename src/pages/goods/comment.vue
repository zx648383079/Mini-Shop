<template>
    <div>
        <div id="comments" class="comment-box">
            <div class="comment-subtotal" v-if="comment">
                评分
                <StarBox star="{{comment.avg}}"/>
                <span>{{ comment.favorable_rate }}%</span>好评
            </div>
            <div class="comment-stats" v-if="comment && comment.tags && comment.tags.length > 0">
                <a v-for="(item, index) in comment.tags" :key="index">{{ item.label }}（{{ item.count }}）</a>
            </div>
            <CommentPage items="{{items}}"/>
        </div>
    </div>
</template>
<script lang="ts">
import { WxJson, WxPage } from '../../../typings/wx/lib.vue';
import { ICommentSubtotal, IComment } from '../../api/model';
import { getCommentSubtotal, getCommentList } from '../../api/comment';

interface IPageData {
    comment: ICommentSubtotal | null,
    item_id: number,
    item_type: number,
    items: IComment[],
    hasMore: boolean,
    page: number,
    isLoading: boolean
}
@WxJson({
    usingComponents: {
        StarBox: 'Child/Star',
        CommentPage: 'Child/Page'
    },
    navigationBarTitleText: "商品评价",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white",
    onReachBottomDistance: 10,
    enablePullDownRefresh: true,
})
export class Comment extends WxPage<IPageData> {

    public data: IPageData = {
        comment: null,
        item_id: 0,
        item_type: 0,
        items: [],
        hasMore: true,
        page: 1,
        isLoading: false
    }

    public onLoad(query?: any) {
        let item_id = parseInt(query.id);
        if (!item_id) {
            wx.showToast({
                icon: 'none',
                title: '商品错误'
            });
            wx.switchTab({
                url: '/pages/index/index'
            });
            return;
        }
        this.setData({
            item_id
        });
        getCommentSubtotal(item_id).then(res => {
            this.setData({
                comment: res
            });
        });
        this.tapRefresh();
    }

    onPullDownRefresh() {
        this.tapRefresh();
    }

    onReachBottom() {
        this.tapMore();
    }

    public tapMore() {
        if (!this.data.hasMore) {
            return;
        }
        this.goPage(this.data.page + 1);
    }

    /**
     * refresh
     */
    public tapRefresh() {
        this.goPage(1);
    }

    public goPage(page: number) {
        if (this.data.isLoading) {
            return;
        }
        this.setData({
            isLoading: true,
        });
        getCommentList({
            item_id: this.data.item_id,
            item_type: this.data.item_type,
            page,
        }).then(res => {
            wx.stopPullDownRefresh();
            let items = [];
            if (page < 2) {
                items = res.data as never[];
            } else {
                items = [].concat(this.data.items as never[], res.data as never[]);
            }
            this.setData({
                hasMore: res.paging.more,
                isLoading: false,
                page,
                items
            });
        });
    }
}
</script>
<style lang="scss" scoped>
page {
    background-color: #f4f4f4;
}
</style>
