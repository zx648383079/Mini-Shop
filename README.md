# Mini-Shop
小程序版商城

## 本项目自带转化工具

支持 ts sass

支持拆解html js ts sass css 写在一个文件上的情况

sass 引用模式未做处理

自动转化html 为 wxml, 自动转化 v-if v-for v-else v-show

## 更新

定义`WxPage` `WxCommpent` 两个类，增强 `setData` 的智能提示，

`export` 是为了避免提示未使用，编译时会自动去除

增加自动添加 `Page(new Index())` `Commpent(new Index())` 到末尾

## 考虑加入

增加模块导入
```ts

@Component({
    'dialog': '/components/dialog/index'
})

```

自动生成 index.json 引入组件

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