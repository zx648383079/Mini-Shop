<template>
    <div>
        <div class="email-password">
            <form bindsubmit="formSubmit" >
                <div class="input-box">
                    <input type="email" name="email" required autocomplete="off" v-model="email" placeholder="请输入账号">
                </div>
                <div class="input-box">
                    <input type="password" name="password" required autocomplete="off" v-model="password" placeholder="请输入密码" bindconfirm="tapSubmit">
                </div>
                <div class="unlogin">
                    <span @click="tapMode" data-mode="5">注册账号</span>
                    <span class="right" @click="tapMode" data-mode="6">忘记密码</span>
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
} from '../../../app.vue';
import { WxMethod, TouchEvent, WxComponent, WxJson } from '../../../../typings/wx/lib.vue';
const app = getApp<IMyApp>();

interface IComponentData {
    email: string,
    password: string,
}

@WxJson({
    component: true
})
export class EmailLogin extends WxComponent<IComponentData>  {
    public options = {
        addGlobalClass: true
    }

    public data = {
        email: '',
        password: ''
    };

    @WxMethod()
    tapMode(e: TouchEvent) {
        this.tapChange(e.currentTarget.dataset.mode as number);
    }
    @WxMethod()
    tapChange(mode: number) {
        this.triggerEvent('click', mode);
    }

    @WxMethod()
    tapSubmit() {
        this.signIn(this.data.email, this.data.password);
    }

    @WxMethod()
    formSubmit(e: any) {
        this.signIn(e.detail.value.email, e.detail.value.password);
    }

    @WxMethod()
    signIn(email: string, password: string) {
        if (!email || !/.+@.+/.test(email)) {
            wx.showToast({
                icon: 'none',
                title: '请输入邮箱'
            });
            return;
        }
        if (!password || password.length < 4) {
            wx.showToast({
                icon: 'none',
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
