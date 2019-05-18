<template>
    <div>
        <ApplyCertification v-if="!user"></ApplyCertification>
        <div v-else>
            <div class="top-header"></div>
            <div class="user-box">
                <div class="avatar">
                    <img :src="user ? user.avatar : '/assets/images/avatar/1.png' | assets">
                </div>
                <h3>您已实名制</h3>
                <div class="name">*zz</div>
                <div class="card">4************</div>
                <a href="">查看详情</a>
            </div>
            <div class="menu-list">
                <MenuItem title="上传证件" icon="fa-camera" uri="/checkin"/>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { WxJson, WxPage } from '../../../typings/wx/lib.wx.page';
import { IUser } from '../../api/model';
import { IMyApp } from '../../app';

const app = getApp<IMyApp>();

interface IPageData {
    user: IUser| null,
}

@WxJson({
    usingComponents: {
        ApplyCertification: 'Child/ApplyCertification'
    },
    navigationBarTitleText: "实名认证",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})
export default class Certification extends WxPage<IPageData> {

    public data: IPageData = {
        user: null
    }

    public onLoad() {
        app.getUser().then(res => {
            this.setData({
                user: res
            });
        })
    }
}
</script>
<style lang="scss" scoped>
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
