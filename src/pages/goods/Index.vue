<template>
    <div>
        <header class="top">
            <a @click="tapBack" class="back">
                <i class="fa fa-chevron-left" aria-hidden="true"></i>
            </a>
            <div class="top-tab">
                <a v-for="(item, index) in tabMenus" :key="index" @click="tapScroll(item.id)" :class="{active: item.id == tabIndex}">{{ item.name }}</a>
            </div>
        </header>

        <div class="has-header has-footer" v-if="goods">

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
                        <div :class="['goods-collect', goods.is_collect ? 'active' : '']" @click="tapCollect">
                            <i class="like-icon"></i>
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
                    <i @click="tapGoComment" class="fa fa-angle-right"></i>
                </div>
                <a class="comment-more" v-if="comment.total < 1">暂无评价</a>
                <div v-else>
                    <div class="comment-stats" v-if="comment.tags && comment.tags.length > 0">
                        <a v-for="(item, index) in comment.tags" :key="index">{{ item.label }}（{{ item.count }}）</a>
                    </div>
                    <CommentPage :items="comment.comments"/>
                    <a @click="tapGoComment" class="comment-more">查看更多</a>
                </div>
            </div>

            <div id="recommend" class="recomment-box" v-if="items && items.length > 0">
                <div class="recommend-header">推荐</div>
                <div class="goods-list">
                    <div class="item-view" v-for="(item, index) in items" :key="index">
                        <div class="item-img">
                            <a @click="tapProduct(item)"><img :src="item.thumb" alt=""></a>
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
                <div class="tab-header"><div :class="['tab-item', tab < 1 ? 'active' : '']" @click="tab = 0">商品介绍</div><div :class="['tab-item', tab == 1 ? 'active' : '']"  @click="tab = 1">规格参数</div><div :class="['tab-item', tab == 2 ? 'active' : '']"  @click="tab = 2">售后保障</div></div>
                <div class="tab-body">
                    <div :class="['tab-item', tab < 1 ? 'active' : '']" v-html="goods.content"></div>
                    <div :class="['tab-item', tab == 1 ? 'active' : '']">
                        <div class="static-properties-box" v-if="goods.static_properties">
                            <dl v-for="(item, index) in goods.static_properties" :key="index">
                                <dt>{{ item.name }}</dt>
                                <dd>{{ item.attr_item ? item.attr_item.value : '' }}</dd>
                            </dl>
                        </div>
                    </div>
                    <div  :class="['tab-item', tab == 2 ? 'active' : '']">售后保障</div>
                </div>
            </div>

        </div>

        <footer class="goods-navbar">
            <a @click="$router.push('/')">
                <i class="fa fa-home" aria-hidden="true"></i>
                首页
            </a>
            <a  @click="$router.push('/category')">
                <i class="fa fa-th-large" aria-hidden="true"></i>
                分类
            </a>
            <a  @click="$router.push('/cart')">
                <i class="fa fa-shopping-cart" aria-hidden="true"></i>
                购物车
            </a>
            <a class="btn btn-orange" @click="tapAddCart">
                加入购物车
            </a>
            <a class="btn" @click="tapBuy">
                立即购买
            </a>
        </footer>

        <CartDialog :mode="mode" :product="goods" @close="mode = 0"/>
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
    public goods: IProduct | null = null;
    public amount: number = 1;
    public mode: number = 0;
    public tab: number = 0;
    public comment: ICommentSubtotal | null = null;
    public items: IProduct[] = [];
    @Getter('isGuest') isGuest?: boolean;
    public tabMenus = [
        {
            id: 'info',
            name: '商品'
        },
        {
            id: 'detail',
            name: '详情'
        },
        {
            id: 'comments',
            name: '评价'
        },
        {
            id: 'recommend',
            name: '推荐'
        },
    ];
    public tabIndex = 'info';

    public created() {
        const id = parseInt(this.$route.params.id);
        if (!id) {
            Toast('商品错误');
            this.$router.push('/');
            return;
        }
        getInfo(id).then(res => {
            this.goods = res;
            this.loadComment();
            this.loadRecommend();
            this.setHistory();
            if (this.$route.hash) {
                this.tapScroll(this.$route.hash.replace('#', ''));
            }
        });  
    }

    /**
     * name
     */
    public mounted(){
        window.addEventListener('scroll', this.handleScroll);
    }

    public destroyed() {
        window.removeEventListener('scroll', this.handleScroll);   //  离开页面清除（移除）滚轮滚动事件
    }

    /**
     * handleScroll
     */
    public handleScroll() {
        const top = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        for (const item of this.tabMenus) {
            const ele = document.getElementById(item.id);
            if (!ele) {
                continue;
            }
            const y = ele.offsetTop;
            if (y <= top && top < y + ele.offsetHeight) {
                this.tabIndex = item.id;
                return;
            }
        }
    }

    /**
     * setHistory
     */
    public setHistory() {
        if (!this.goods) {
            return;
        }
        let data = getLocalStorage<number[]>(SET_GOODS_HISTORY, true);
        if (!data) {
            data = [this.goods.id];
        } else if (data.indexOf(this.goods.id) < 0) {
            data.push(this.goods.id);
        }
        setLocalStorage(SET_GOODS_HISTORY, data);
    }

    public loadComment() {
        if (!this.goods) {
            return;
        }
        getCommentSubtotal(this.goods.id).then(res => {
            this.comment = res;
        });
    }

    public loadRecommend() {
        if (!this.goods) {
            return;
        }
        getRecommend(this.goods.id).then(res => {
            if (!res.data) {
                return;
            }
            this.items = res.data;
        })
    }

    public tapBack() {
        if (window.history.length <= 1) {
            this.$router.push('/');
            return;
        }
        this.$router.go(-1);
    }

    public tapGoComment() {
        if (!this.goods) {
            return;
        }
        this.$router.push({name: 'product-comment', params: {id: this.goods.id + ''}});
    }

    public tapScroll(id: string) {
        const ele = document.getElementById(id);
        if (ele) {
            ele.scrollIntoView();
            this.tabIndex = id;
        }
    }

    public tapProduct(item: IProduct) {
        this.$router.push({name: 'product', params: {id: item.id + ''}});
    }

    public tapAddCart() {
        this.mode = 1;
    }

    public tapBuy() {
        this.mode = 2;
    }

    public tapCollect() {
        if (!this.goods) {
            return;
        }
        if (this.isGuest) {
            return;
        }
        toggleCollect(this.goods.id).then(res => {
            if (!this.goods) {
                return;
            }
            this.goods.is_collect = res.data;
        });
    }
}
</script>
<style lang="scss" scoped>

</style>
