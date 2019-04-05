<template>
    <div>
        <div class="logo">
            <img src="/images/wap_logo.png" mode="widthFix">
        </div>
        <div class="phone-code">
            <div class="input-box">
                <input type="text">
            </div>
            <div class="code-input">
                <input type="text">
                <a href="">获取验证码</a>
            </div>
            <div class="unlogin">
                <a href="">遇到问题？</a>
                <a @click="mode = 2">使用密码验证登录</a>
            </div>
            <button>登录</button>
            <a @click="mode = 0" class="btn btn-none">其他登录方式</a>
        </div>
    </div>
</template>
<script lang="ts">
export class MobileCodeLogin extends WxComponent<any>  {
    public options = {
        addGlobalClass: true
    }
}
</script>
<style lang="scss" scoped>

</style>
