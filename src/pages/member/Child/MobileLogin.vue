<template>
    <div>
        <div class="phone-password">
            <form bindsubmit="formSubmit" >
                <div class="input-box">
                    <input type="text" name="mobile" v-model="mobile" placeholder="请输入手机号">
                </div>
                <div class="input-box">
                    <input type="password" name="password" v-model="password" placeholder="请输入密码">
                </div>
                <div class="unlogin">
                    <span @click="tapMode" data-mode="6">忘记密码</span>
                    <span class="right" @click="tapMode" data-mode="2">使用短信验证登录</span>
                </div>
                <button form-type="submit">登录</button>
                <span @click="tapMode" data-mode="0" class="btn btn-none">其他登录方式</span>
            </form>
        </div>
    </div>
</template>
<script lang="ts">
import { WxComponent, WxJson, WxMethod, TouchEvent } from "../../../../typings/wx/lib.vue";
import { IMyApp } from "../../../app.vue";

interface IComponentData {
    mobile: string,
    password: string,
}

const app = getApp<IMyApp>();

@WxJson({
    component: true
})
export class MobileLogin extends WxComponent<IComponentData>  {
    public options = {
        addGlobalClass: true
    }

    public data = {
        mobile: '',
        password: '',
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
    formSubmit(e: any) {
        const mobile = e.detail.value.mobile;
        const password = e.detail.value.password;
        if (!mobile || !/^1\d{10}$/.test(mobile)) {
            wx.showToast({
                icon: 'none',
                title: '请输入手机号'
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
        app.loginUser({mobile, password}).then(_ => {
            this.triggerEvent('back');
        });
    }
}
</script>
<style lang="scss" scoped>

</style>
