<template>
    <div>
        <ApplyCertification v-if="!info"></ApplyCertification>
        <div v-else>
            <div class="top-header"></div>
            <div class="user-box">
                <div class="avatar">
                    <img :src="user.avatar">
                </div>
                <h3>{{ status }}</h3>
                <div class="name">{{ info.name }}</div>
                <div class="card">{{ info.card_no }}</div>
                <a href="">查看详情</a>
            </div>
            <div class="menu-list">
                <MenuItem class="item" title="上传证件" icon="fa-camera" uri="/checkin"/>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { WxJson, WxPage } from '../../../typings/wx/lib.vue';
import { IUser, ICertification } from '../../api/model';
import { IMyApp } from '../../app.vue';
import { getCertification } from '../../api/account';

const app = getApp<IMyApp>();

interface IPageData {
    user: IUser| null;
    info: ICertification | null;
    status: string;
}

@WxJson({
    usingComponents: {
        ApplyCertification: 'Child/ApplyCertification',
        MenuItem: "/components/MenuItem/index"
    },
    navigationBarTitleText: "实名认证",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})
export default class Certification extends WxPage<IPageData> {

    public data: IPageData = {
        user: null,
        info: null,
        status: '您已实名制'
    }

    public onLoad() {
        app.getUser().then(res => {
            this.setData({
                user: res
            });
        });
        getCertification().then(res => {
            if (!res.data) {
                return;
            }
            this.setData({
                info: res.data
            });
        });
    }
}
</script>
<style lang="scss" scoped>
page {
    background-color: #f4f4f4;
}
.top-header {
    background: #05a6b1;
    color: #fff;
    height: 160px;
    padding-top: 40px;
}
.user-box {
    background-color: #fff;
    width: 300px;
    margin: -120px auto 20px;
    position: relative;
    padding: 60px 20px 20px;
    box-sizing: border-box;
    .avatar {
        border-radius: 50%;
        height: 80px;
        width: 80px;
        position: absolute;
        top: -30px;
        left: 110px;
        image {
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
    }
    .name,
    .card {
        line-height: 30px;
    }
}
</style>
