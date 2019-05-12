<template>
    <div>
        <div class="has-footer" v-if="goods">
            <div id="info">
                <div class="goods-gallary-box">
                    <img :src="goods.thumb" alt="">
                </div>

                <div class="activity-box" v-if="goods.activty">
                    <div class="price">
                        <em>￥</em>{{ goods.price }}
                    </div>
                    <div class="info">
                        <p class="old-price">{{ goods.market_price | price }}</p>
                        <span class="time-block"><i class="fa fa-clock"></i>秒杀</span>
                    </div>
                    <div class="countdown">
                        <p class="text">距秒杀结束还剩</p>
                        <p class="time">
                            <span>01</span>
                            :
                            <span>01</span>
                            :
                            <span>01</span>
                        </p>
                    </div>
                </div>

                <div class="goods-info">
                    <div class="goods-header">
                        <h1 class="goods-name">{{ goods.name }}</h1>
                        <div class="goods-collect {{goods.is_collect ? 'active' : ''}}" @click="tapCollect">
                            <i class="fa like-icon"></i>
                            收藏
                        </div>
                    </div>
                    <div class="goods-price">{{ goods.price | price }}</div>

                    <div class="promote-line">
                        <div>支付</div>
                        <div>
                        11111
                        </div>
                        <div>...</div>
                    </div>
                    <div class="promote-line">
                        <div>领券</div>
                        <div>
                        11111
                        </div>
                        <div>...</div>
                    </div>
                    <div class="promote-line">
                        <div>促销</div>
                        <div>
                        11111
                        </div>
                        <div>...</div>
                    </div>
                </div>
            </div>

            <div id="comments" class="comment-box" v-if="comment">
                <div class="comment-header">
                    评价
                    <i @click="tapGoComment" class="fa fa-chevron-right"></i>
                </div>
                <div class="comment-more" v-if="comment.total < 1">暂无评价</div>
                <div v-else>
                    <div class="comment-stats" v-if="comment.tags && comment.tags.length > 0">
                        <a v-for="(item, index) in comment.tags" :key="index">{{ item.label }}（{{ item.count }}）</a>
                    </div>
                    <CommentPage items="{{comment.comments}}"/>
                    <div @click="tapGoComment" class="comment-more">查看更多</div>
                </div>
            </div>

            <div id="recommend" class="recomment-box" v-if="items && items.length > 0">
                <div class="recommend-header">推荐</div>
                <div class="goods-list">
                    <div class="item-view" v-for="(item, index) in items" :key="index">
                        <div class="item-img">
                            <a @click="tapProduct(item)"><img :src="item.thumb" alt="" mode="widthFix"></a>
                        </div>
                        <div class="item-title">
                            {{ item.name }}
                        </div>
                        <div class="item-actions">
                            <span class="item-price">{{ item.price | price }}</span>
                        </div>
                    </div>
                </div>
                <div class="clearfix"></div>
            </div>

            <div id="detail" class="tab-box goods-content">
                <div class="tab-header">
                    <div class="tab-item {{tab < 1 ? 'active' : ''}}" @click="tab = 0">商品介绍</div>
                    <div class="tab-item {{tab == 1 ? 'active' : ''}}"  @click="tab = 1">规格参数</div>
                    <div class="tab-item {{tab == 2 ? 'active' : ''}}"  @click="tab = 2">售后保障</div></div>
                <div class="tab-body">
                    <div class="tab-item {{tab < 1 ? 'active' : ''}}" v-html="goods.content"></div>
                    <div class="tab-item {{tab == 1 ? 'active' : ''}}">
                        <div class="static-properties-box" v-if="goods.static_properties">
                            <dl v-for="(item, index) in goods.static_properties" :key="index">
                                <dt>{{ item.name }}</dt>
                                <dd>{{ item.attr_item ? item.attr_item.value : '' }}</dd>
                            </dl>
                        </div>
                    </div>
                    <div class="tab-item {{tab == 2 ? 'active' : ''}}">售后保障</div>
                </div>
            </div>

        </div>

        <div class="footer goods-navbar">
            <a href="/pages/index/index" open-type="switchTab">
                <i class="fa fa-home" aria-hidden="true"></i>
                首页
            </a>
            <a href="/pages/category/index" open-type="switchTab">
                <i class="fa fa-table" aria-hidden="true"></i>
                分类
            </a>
            <a href="/pages/cart/index" open-type="switchTab">
                <i class="fa fa-cart" aria-hidden="true"></i>
                购物车
            </a>
            <a class="btn btn-orange" @click="tapAddCart">
                加入购物车
            </a>
            <a class="btn" @click="tapBuy">
                立即购买
            </a>
        </div>

        <CartDialog mode="{{mode}}" product="{{goods}}" bind:close="tapDialogClose"/>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app';
import { WxJson, WxPage } from '../../../typings/wx/lib.wx.page';
import { IProduct, ICommentSubtotal, SET_GOODS_HISTORY } from '../../api/model';
import { getInfo, getRecommend } from '../../api/product';
import { getCommentSubtotal } from '../../api/comment';
import { toggleCollect } from '../../api/user';
const app = getApp<IMyApp>();

interface IPageData {
    goods: IProduct | null,
    amount: number,
    mode: number,
    tab: number,
    comment: ICommentSubtotal | null,
    items: IProduct[],
}
@WxJson({
    usingComponents:{
        CartDialog: 'Child/CartDialog',
        CommentPage: 'Child/Page'
    },
    navigationBarTitleText: "商品详情",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white",
})
export class Index extends WxPage<IPageData> {

    public data: IPageData = {
        goods: null,
        amount: 1,
        mode: 0,
        tab: 0,
        comment: null,
        items: [],
    };

    public onLoad(query?: any) {
        const id = parseInt(query.id);
        if (!id) {
            wx.showToast({
                title: '商品错误'
            });
            wx.switchTab({
                url: '/pages/index/index'
            });
            return;
        }
        getInfo(id).then(res => {
            this.setData({
                goods: res
            });
            this.loadComment();
            this.loadRecommend();
            this.setHistory();
        });  
    }

    /**
     * setHistory
     */
    public setHistory() {
        if (!this.data.goods) {
            return;
        }
        let data = wx.getStorageSync(SET_GOODS_HISTORY);
        if (!data) {
            data = [this.data.goods.id];
        } else if (data.indexOf(this.data.goods.id) < 0) {
            data.push(this.data.goods.id);
        }
        wx.setStorageSync(SET_GOODS_HISTORY, data);
    }

    public loadComment() {
        if (!this.data.goods) {
            return;
        }
        getCommentSubtotal(this.data.goods.id).then(res => {
            this.setData({
                comment: res
            });
        });
    }

    public loadRecommend() {
        if (!this.data.goods) {
            return;
        }
        getRecommend(this.data.goods.id).then(res => {
            if (!res.data) {
                return;
            }
            this.setData({
                items: res.data
            });
        })
    }

    public tapGoComment() {
        if (!this.data.goods) {
            return;
        }
        wx.navigateTo({
            url: 'comment?id=' + this.data.goods.id
        });
    }

    public tapProduct(item: IProduct) {
        wx.navigateTo({
            url: 'index?id=' + item.id
        });
    }

    public tapAddCart() {
        this.setData({
            mode: 1
        });
    }

    public tapBuy() {
        this.setData({
            mode: 2
        });
    }

    /**
     * tapDialogClose
     */
    public tapDialogClose() {
        this.setData({
            mode: 0
        });
    }

    public tapCollect() {
        if (!this.data.goods) {
            return;
        }
        if (!app.globalData.token) {
            return;
        }
        let goods = this.data.goods;
        toggleCollect(goods.id).then(res => {
            goods.is_collect = res.data;
            this.setData({
                goods
            });
        });
    }
}
</script>
<style lang="scss" scoped>
.goods-gallary-box {
    text-align: center;
}
</style>
