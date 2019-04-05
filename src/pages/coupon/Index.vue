<template>
    <div>
        <div class="has-header has-footer">
            <div :class="['scroll-nav', isExpand ? 'unfold' : '']">
                <ul>
                    <li v-for="(item, index) in categories" :key="index">
                            <a href="">{{ item.name }}</a>
                    </li>
                </ul>
                <a @click="isExpand = !isExpand" class="fa nav-arrow"></a>
            </div>

            <PullToRefresh :loading="isLoading" :more="has_more" @refresh="tapRefresh" @more="tapMore">
                <div class="coupon-item" v-for="(item, index) in items" :key="index">
                    <div class="thumb">
                        <img :src="item.thumb" alt="">
                    </div>
                    <div class="info">
                        <p>{{item.name }}</p>
                        <dl class="discount" v-if="item.type > 0">
                            <dd>8.8折</dd>
                            <dt>满168可用</dt>
                        </dl>
                        <div class="price" v-else>
                            <em>¥300</em>
                            满168可用
                        </div>
                    </div>
                    <div class="action">
                        <span class="status-icon">立即<br>领取</span>
                        <i>剩余76%</i>
                    </div>
                </div>
            </PullToRefresh>
        </div>

        <footer class="tab-bar">
            <a class="active">
                <i class="fa fa-gift" aria-hidden="true"></i>
                领券
            </a>
            <a @click="$router.push('/coupon/my')">
                <i class="fa fa-user" aria-hidden="true"></i>
                我的优惠券
            </a>
        </footer>
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
    public categories: ICategory[] = [];
    public status: number = 0;
    public items = [];
    public isExpand: boolean = false;
    public has_more = true;
    public page = 1;
    public isLoading = false;

    public created() {
        dispatchCategories().then(res => {
            this.categories = res;
        });
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
        setTimeout(() => {
            this.page = page;
            this.isLoading = false;
            const data = [1,2,3,4,5,6,7];
            if (this.page < 2) {
                this.items = data as never[];
                return;
            }
            this.items = [].concat(this.items as never[], data as never[]);
        }, 2000);
    }

}
</script>
<style lang="scss" scoped>

</style>
