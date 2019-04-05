<template>
    <div>
        <div class="logo">
            <img src="/images/wap_logo.png" mode="widthFix">
        </div>
        <div class="email-password">
            <form bindsubmit="formSubmit" >
                <div class="input-box">
                    <input type="email" name="email" required autocomplete="off" v-model="email" placeholder="请输入账号">
                </div>
                <div class="input-box">
                    <input type="password" name="password" required autocomplete="off" @keyup="tapKey" v-model="password" placeholder="请输入密码">
                </div>
                <div class="unlogin">
                    <span @click="tapMode" data-mode="4">注册账号</span>
                    <a href="">忘记密码</a>
                </div>
                <button form-type="submit">登录</button>
                <span @click="tapMode" data-mode="0" class="btn btn-none">其他登录方式</span>
            </form>
        </div>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../../app';
import { WxMethod, TouchEvent, WxComponent } from '../../../../typings/wx/lib.wx.page';
const app = getApp<IMyApp>();
export class EmailLogin extends WxComponent<any>  {
    public options = {
        addGlobalClass: true
    }

    methods = {
        aa() {
            
        }
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
        const email = e.detail.value.email;
        const password = e.detail.value.password;
        if (!email || !/.+@.+/.test(email)) {
            wx.showToast({
                title: '请输入账号'
            });
            return;
        }
        if (!password || password.length < 4) {
            wx.showToast({
                title: '请输入密码'
            });
            return;
        }
        app.loginUser({email, password}).then(_ => {
            this.triggerEvent('back');
        });
    }
}
</script>
<style lang="scss" scoped>

</style>
