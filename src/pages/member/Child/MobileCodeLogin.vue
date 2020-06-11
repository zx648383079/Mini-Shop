<template>
    <div>
        <div class="logo">
            <img src="/images/wap_logo.png" mode="widthFix">
        </div>
        <div class="phone-code">
            <form bindsubmit="formSubmit" >
                <div class="input-box">
                    <input type="text" name="mobile" v-model="mobile" placeholder="请输入手机号">
                </div>
                <div class="code-input">
                    <input type="text" name="code" v-model="code" placeholder="请输入验证码">
                    <span @click="tapSendCode">{{ sendMsg }}</span>
                </div>
                <div class="unlogin">
                    <a href="/pages/article/index">遇到问题？</a>
                    <span class="right" @click="tapMode" data-mode="1">使用密码验证登录</span>
                </div>
                <button form-type="submit">登录</button>
                <span @click="tapMode" data-mode="0" class="btn btn-none">其他登录方式</span>
            </form>
        </div>
    </div>
</template>
<script lang="ts">
import { WxJson, WxComponent, WxMethod, TouchEvent } from "../../../../typings/wx/lib.vue";
import { IMyApp } from "../../../app.vue";
import { sendMobileCode } from "../../../api/user";

interface IComponentData {
    mobile: string,
    code: string,
    sendMsg: string,
    sendTime: number
}

const app = getApp<IMyApp>();

@WxJson({
    component: true
})
export class MobileCodeLogin extends WxComponent<IComponentData>  {
    public options = {
        addGlobalClass: true
    };

    public data = {
        mobile: '',
        code: '',
        sendMsg: '获取验证码',
        sendTime: 0
    };

    @WxMethod()
    tapSendCode() {
        let data = this.data;
        if (data.sendTime > 0) {
            return;
        }
        if (!data.mobile || !/^1\d{10}$/.test(data.mobile)) {
            wx.showToast({
                icon: 'none',
                title: '请输入手机号'
            });
            return;
        }
        data.sendTime = 120;
        sendMobileCode(data.mobile, 'login').then(res => {
            if (res.data) {
                wx.showToast({
                    title: res.message as string
                });
                this.countDown();
            }
        });
    }

    @WxMethod()
    countDown() {
        let data = this.data;
        data.sendTime --;
        if (data.sendTime <= 0) {
            data.sendMsg = '重新发送';
        } else {
            data.sendMsg = data.sendTime.toString();
            setTimeout(this.countDown.bind(this), 1000);
        }
        this.setData(data);
    }

    @WxMethod()
    tapMode(e: TouchEvent) {
        this.tapChange(e.currentTarget.dataset.mode as number);
    }
    @WxMethod()
    tapChange(mode: number) {
        this.triggerEvent('click', mode);
    }

    @WxMethod()
    formSubmit(e: any) {
        const mobile = e.detail.value.mobile;
        const code = e.detail.value.code;
        if (!mobile || !/^1\d{10}$/.test(mobile)) {
            wx.showToast({
                icon: 'none',
                title: '请输入手机号'
            });
            return;
        }
        if (!code || code.length < 4) {
            wx.showToast({
                icon: 'none',
                title: '请输入验证码'
            });
            return;
        }
        app.loginUser({mobile, code}).then(_ => {
            this.triggerEvent('back');
        });
    }
}
</script>
<style lang="scss" scoped>

</style>
