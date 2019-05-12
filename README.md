# Mini-Shop
小程序版商城

[Vue-Shop](https://github.com/zx648383079/Vue-Shop)小程序版

## 已完成转化页面

[√] 首页

[√] 分类页

[√] 搜索页

[√] 商品详情页

[√] 商品评论显示页

[√] 购物车页

[√] 结算页

[√] 支付页

[√] 个人中心页

[√] 个人账户页（包含提现、充值弹窗）

[√] 银行卡页

[√] 银行卡绑定页

[√] 登录注册页

[√] 订单列表页

[√] 订单详情页

[√] 收货地址页

[√] 消息页

[√] 账号关联页

[√] 签到页

[√] 推荐页

[√] 推荐规则页

[√] 推荐订单页

[√] 推荐会员页

[√] 推荐二维码页

## 本项目自带转化工具

[转化核心](https://github.com/zx648383079/Mini-Shop/blob/master/src/parser.ts)

支持 ts sass

支持拆解html js ts sass css 写在一个文件上的情况

sass 引用模式未做处理

自动转化html 为 wxml, 自动转化 v-if v-for v-else v-show

支持json自动生成，支持 属性合并

## 更新

### 标签属性转化列表


属性名 | 目标属性
---------|----------
 `v-if` | `wx:if="{{  }}"`
 `v-elseif` | `wx:elif="{{  }}"`
 `v-else` | `wx:else`
 `v-bind:src` | `src`
 `href` | `url`
 `@click` | `bindtap`
 `v-on:click` | `bindtap`
 `(click)` | `bindtap`
 `@touchstart` | `bindtouchstart`
 `@touchmove` | `bindtouchmove`
 `@touchend` | `bindtouchend`
 `:key` | 
 `v-show` | `hidden="{{! }}"`
 `v-for` | `wx:for="{{  }}" wx:for-index=" " wx:for-item=""`
 `v-model` | `value="{{  }}" bind:input=" Changed"`
 第一个支付为`@`且值不为空 | `bind:`
 第一个支付为`:` | `={{ }}`
 其他包含`@` |




定义`WxPage` `WxCommpent` 两个类，增强 `setData` 的智能提示，

`export` 是为了避免提示未使用，编译时会自动去除

增加自动添加 `Page(new Index())` `Commpent(new Index())` 到末尾

增加json配置生成
```ts

@WxJson({
    usingComponents: {
        MenuLargeItem: "/components/MenuLargeItem/index",
        MenuItem: "/components/MenuItem/index"
    },
    navigationBarTitleText: "个人中心",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})

```

自动合并页面相关的json文件

支持自动合并 `methods` `lifetimes` `pageLifetimes`， 如果已有 属性会自动合并

    methods  @WxMethod
    lifetimes @WxLifeTime
    pageLifetimes @WxPageLifeTime

自定义部件自动合并方法到`methods`属性中

```ts
methods = {
    aa() {

    }
}

@WxMethod()
tapChange(mode: number) {
}

```

最终生成

```ts
methods = {
    tapChange(mode: number) {
    },
    aa() {
        
    }
}
```

## 标准模板

index.vue

```html
<template>
    <div>
        
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app';

const app = getApp<IMyApp>();

interface IPageData {
    items: number[],
}

export class Index extends WxPage<IPageData> {
    public data: IPageData = {
        items: []
    };

    onLoad() {
        this.setData({
            items: []
        });
    }
}
</script>
<style lang="scss" scoped>

</style>
```

### 最终会处理为3个文件

index.wxml

```html

<view></view>

```

index.wxss

```css

```

index.js
```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = getApp();
var Index = (function () {
    function Index() {
        this.data = {
            items: [],
        };
    }
    Index.prototype.onLoad = function () {
        this.setData({
            items: []
        });
    };
    return Index;
}());
Page(new Index());
```
