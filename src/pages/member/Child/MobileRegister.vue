<template>
    <div>
        <div class="title">
            <span>手机号注册</span>
        </div>
        <div class="input-box">
            <input type="text" placeholder="请输入手机号">
        </div>
        <div class="code-input">
            <input type="text" placeholder="请输入短信验证码">
            <a href="">获取验证码</a>
        </div>
        <div class="input-box">
            <input type="password" placeholder="请输入密码">
        </div>
        <button>注册</button>
        <div class="input-group">
            <div class="checkbox" @click="agree = !agree">
                <i :class="['far', agree ? 'fa-check-square' : 'fa-square']"></i>
            </div>
            同意本站协议
        </div>

        <a class="footer-btn">邮箱帐号注册
            <i class="fa fa-angle-right"></i>
        </a>
    </div>
</template>
<script lang="ts">
import { WxJson, WxComponent } from "../../../../typings/wx/lib.wx.page";

@WxJson({
    component: true
})
export class MobileRegister extends WxComponent<any>  {
    public options = {
        addGlobalClass: true
    }
    agree = true;

    
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
</style>
