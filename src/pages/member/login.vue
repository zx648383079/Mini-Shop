<template>
    <div>
        <div>
            <div class="login-type-box" v-if="mode < 1">
                <div class="logo">
                    <img src="/images/wap_logo.png" mode="widthFix">
                </div>
                <span @click="tapMode" data-mode="1" class="btn">手机号登录</span>
                <span @click="tapMode" data-mode="3" class="btn btn-none">邮箱登录</span>
                <span @click="tapMode" data-mode="4">手机号快捷注册</span>

                <div class="login-oauth-box">
                    <span @click="tapAuth()"><i class="fa fa-weixin"></i></span>
                </div>
            </div>
            <div class="login-box" v-if="mode > 0 && mode < 4">
                <MobileLogin v-if="mode == 1" bind:click="tapChangeMode" bind:back="tapLoginBack"/>
                <MobileCodeLogin v-if="mode == 2" bind:click="tapChangeMode" bind:back="tapLoginBack"/>
                <EmailLogin v-if="mode == 3" bind:click="tapChangeMode" bind:back="tapLoginBack"/>
            </div>
            <div class="register-box" v-if="mode >= 4">
                <MobileRegister v-if="mode == 4" bind:click="tapChangeMode" bind:back="tapLoginBack"/>
                <EmailRegister v-if="mode == 5" bind:click="tapChangeMode" bind:back="tapLoginBack"/>
            </div>

        </div>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app';
const app = getApp<IMyApp>();

interface IPageData {
    mode: number
}

export class Index extends WxPage<IPageData> {

    public data: IPageData = {
        mode: 0
    };

    tapMode(e: TouchEvent) {
        this.tapChange(e.currentTarget.dataset.mode as number);
    }

    tapChangeMode(e: any) {
        this.tapChange(e.detail);
    }

    public tapChange(mode: number) {
        this.setData({mode});
    }

    public tapLoginBack() {
        wx.switchTab({
            url: '/pages/index/index'
        });
    }

    public authLogin(code: string, nickname: string, avatar: string, gender: number) {
        app.authloginUser({code, nickname, avatar, gender}).then(res => {
            if (res) {
                this.tapLoginBack();
            }
        });
    }

    /**
     * tapAuth
     */
    public tapAuth() {
        let code: string| null = null,
            userInfo: wx.UserInfo | null = null,
            that = this;
        wx.login({
            success(res) {
                code = res.code;
                userInfo && that.authLogin(code, userInfo.nickName, userInfo.avatarUrl, userInfo.gender);
            }
        })
        // 获取用户信息
        wx.getSetting({
            success: (res) => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            userInfo = res.userInfo;
                           code && that.authLogin(code, userInfo.nickName, userInfo.avatarUrl, userInfo.gender);
                        }
                    });
                }
            }
        })
    }
}
</script>
<style lang="scss" scoped>

</style>
