<template name="aa">
    <div>
        <img src="" alt="">
    </div>
</template>
<template>
    <div class="empty-cart-box" v-if="!items || items.length < 1" @click="$router.push('/login')">
        <div v-if="isGuest">
            <p v-for="(item, index) in items" :key="index">登录后可同步购物车中商品</p>
            <a @click="$router.push('/login')" class="btn">登录</a>
        </div>
        <div v-else>
            <p>购物车时空的</p>
            <a @click="$router.push('/')" class="btn">去逛逛</a>
        </div>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app';

const app = getApp<IMyApp>();

class Index implements IPage {
    data: any;

    onLoad() {
        app.globalData;
    }
}

Page(new Index());
</script>
<style lang="scss" scoped>

</style>
