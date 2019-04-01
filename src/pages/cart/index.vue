<template>

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
