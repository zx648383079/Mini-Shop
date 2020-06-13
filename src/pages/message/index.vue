<template>
    <div class="slide-box">
        <div class="item" v-for="(item, index) in items" :key="index" :index="item.id">
            <MpSlideView buttons="{{ item.buttons }}" bindbuttontap="slideButtonTap" >
                <div class="message-item" @click="tapRead" data-i="{{ index }}">
                    <div class="icon-header">
                        <span>{{ item.bulletin.icon }}</span>
                    </div>
                    <div class="content">
                        <div class="name">
                            <span>{{ item.bulletin.user_name }}</span>
                            <span>{{ item.bulletin.created_at }}</span>
                        </div>
                        <div class="desc">
                            {{ item.bulletin.title }} 
                        </div>
                        <div class="bottom">
                            <span>点击查看</span>
                        </div>
                        <div class="un-read" v-if="item.status < 1">
                            未读
                        </div>
                    </div>
                </div>
            </MpSlideView>
        </div>
        <div class="empty-box" v-if="items.length < 1">
                暂无消息
        </div>
    </div>
</template>
<script lang="ts">
import { WxPage, WxJson } from '../../../typings/wx/lib.vue';
import { IBulletinUser } from '../../api/model';
import { getBulletinList } from '../../api/bulletin';

interface IPageData {
    items: IBulletinUser[],
    page: number,
    hasMore: boolean,
    isLoading: boolean,
}
@WxJson({
    navigationBarTitleText: '我的消息',
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white",
    usingComponents: {
        MpSlideView: 'weui-miniprogram/slideview/slideview'
    },
})
export class Index extends WxPage<IPageData> {
    public data: IPageData = {
        items: [],
        page: 1,
        hasMore: true,
        isLoading: false,
    };

    onLoad() {
        this.tapRefresh();
    }

    onShow() {
        
    }

    onPullDownRefresh() {
        this.tapRefresh();
        wx.stopPullDownRefresh();
    }

    onReachBottom() {
        this.tapMore();
    }

    slideButtonTap(e: any) {
        console.log(e);
        
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.data.hasMore) {
            return;
        }  
        this.goPage(this.data.page + 1);
    }

    public goPage(page: number) {
        if (this.data.isLoading) {
            return;
        }
        this.setData({
            isLoading: true
        });
        getBulletinList({
            page,
        }).then(res => {
            res.data = this.formatButton(res.data);
            this.setData({
                page: page,
                hasMore: res.paging.more,
                isLoading: false,
                items: page < 2 ? res.data :  [].concat(this.data.items as never[], res.data as never[])
            });
        }, () => {
            this.setData({
                isLoading: false
            });
        });
    }

     private formatButton(res: any[]): any[] {
        return res.map(item => {
                    item.buttons = item.status > 0 ? 
                    [
                        {
                            type: 'warn',
                            text: '删除',
                            data: item.id,
                        }
                    ] : [
                        {
                            text: '标记为已读',
                            data: item.id,
                        },
                        {
                            type: 'warn',
                            text: '删除',
                            data: item.id,
                        }
                    ];
                    return item;
                });
    }
}
</script>
<style lang="scss" scoped>
page {
    background-color:#f4f4f4;
}
.message-item {
    padding:10px;
    position:relative;
    background:#fff;
    margin-bottom:10px;
    .icon-header {
        font-size:25px;
        color:#41C4FF;
        float:left;
        margin-right:15px;
        width:7%;
        height: 80px;
        text {
            display: block;
            line-height: 80px;
        }
        image {
            width: 30px;
            height: 30px;
            margin-top: 15px;
        }
    }
    .content {
        .name,
        .bottom {
            font-size: 12px;
            color: #999;
            text {
                margin-right: 10px;
            }
        }
        .desc {
            font-size: 14px;
            line-height: 20px;
            padding: 10px 0;
            color: #000000;
            overflow: hidden;
            height: 40px;
        }
    }
    .un-read {
        position: absolute;
        font-size: 30px;
        right: 20px;
        opacity: .1;
        top: 20px;
        transform: rotate(30deg);
    }
}
</style>
