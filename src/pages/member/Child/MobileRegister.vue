<template>
    <div>
        <div class="logo">
            <img src="/images/wap_logo.png" mode="widthFix">
        </div>
        <form bindsubmit="formSubmit">
            <div class="input-box">
                <input type="text" name="name" required autocomplete="off" v-model="name" placeholder="请输入昵称">
            </div>
            <div class="input-box">
                <input type="text" name="mobile" v-model="mobile" placeholder="请输入手机号">
            </div>
            <div class="code-input">
                <input type="text" name="code" v-model="code" placeholder="请输入短信验证码">
                <span @click="tapSendCode">{{ sendMsg }}</span>
            </div>
            <div class="input-box">
                <input type="password" name="password" required autocomplete="off" v-model="password" placeholder="请输入密码">
            </div>
            <div class="input-box">
                <input type="password" name="rePassword" required autocomplete="off" v-model="rePassword" placeholder="请确认密码">
            </div>
            <button form-type="submit">注册</button>
            <div class="input-group">
                <div class="checkbox" @click="agree = !agree">
                    <i :class="['fa', agree ? 'fa-check-square' : 'fa-square']"></i>
                </div>
                同意<span @click="tapaAgreement">本站协议</span>

                <view class="right" @click="tapMode" data-mode="5">邮箱帐号注册
                    <i class="fa fa-angle-right"></i>
                </view>
            </div>
        </form>
        <div class="agreement-box" v-if="mode == 1">
            <div class="title">注册协议</div>
            <div class="content">
                <p>本程序使用过程中产生的数据仅对本人公开，不会对外公布，但会存储了服务器，直到用户注销，用户产生的数据都会被删除。</p>
            </div>
            <div class="footer">
                <div class="btn" @click="tapAgree">我已阅读并同意协议</div>
            </div>
        </div>
        
    </div>
</template>
<script lang="ts">
import { WxJson, WxComponent, WxMethod, TouchEvent } from "../../../../typings/wx/lib.vue";
import { IMyApp } from "../../../app.vue";
import { sendMobileCode } from "../../../api/user";

interface IComponentData {
    agree: boolean,
    name: string,
    mobile: string,
    code: string,
    password: string,
    rePassword: string,
    mode: number,
    sendMsg: string,
    sendTime: number
}

const app = getApp<IMyApp>();

@WxJson({
    component: true
})
export class MobileRegister extends WxComponent<IComponentData>  {
    public options = {
        addGlobalClass: true
    }

    public data = {
        name: '',
        mobile: '',
        code: '',
        password : '',
        rePassword : '',
        agree: true,
        mode: 0,
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
        sendMobileCode(data.mobile, 'register').then(res => {
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
    public tapaAgreement() {
        this.setData({
            mode: 1
        });
    }

    @WxMethod()
    public tapAgree() {
        this.setData({
            mode: 0,
            agree: true
        });
    }

    @WxMethod()
    formSubmit(e: any) {
        const mobile = e.detail.value.mobile;
        const code = e.detail.value.code;
        const password = e.detail.value.password;
        const rePassword = e.detail.value.rePassword;
        const name = e.detail.value.name;
        const agree = this.data.agree;
        if (!agree) {
            wx.showToast({
                icon: 'none',
                title: '请先同意本站用户协议'
            });
            return;
        }
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
        if (!password || password.length < 6) {
            wx.showToast({
                icon: 'none',
                title: '请输入密码'
            });
            return;
        }
        if (rePassword !== password) {
            wx.showToast({
                icon: 'none',
                title: '两次密码不一致'
            });
            return;
        }
        app.registerUser({
            name,
            mobile,
            code,
            password,
            rePassword,
            agree
        }).then(res => {
            if (!res || !res.token) {
                wx.showToast({
                    icon: 'none',
                    title: '未知错误'
                });
                return;
            }
            this.triggerEvent('back');
        });
    }
}
</script>
<style lang="scss" scoped>
.title {
    font-size: 20px;
    line-height: 80px;
    color: #333;
    margin-bottom: 10vh;
}
.checkbox {
    display: inline-block;
}
.footer-btn {
    text-align: center;
    line-height: 30px;
    margin-top: 40px;
    display: block;
}
.agreement-box {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    z-index: 99;
    .title {
        text-align: center;
        margin-bottom: 0;
        line-height: 60px;
    }
    .content {
        padding: 10px;
        text-align: left;
    }
    .footer {
        margin-top: 30px;
        text-align: center;
        .btn {
            display: inline-block;
        }
    }

}
</style>
