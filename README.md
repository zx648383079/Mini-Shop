# Mini-Shop
小程序版商城

## 本项目自带转化工具

支持 ts sass

支持拆解html js ts sass css 写在一个文件上的情况

sass 引用模式未做处理

自动转化html 为 wxml, 自动转化 v-if v-for v-else v-show

## 标准模板

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
```