<template>
    <div>
        <div class="logo">
            <img src="/images/wap_logo.png" mode="widthFix">
        </div>
        <div class="phone-password">
            <div class="input-box">
                <input type="text">
            </div>
            <div class="input-box">
                <input type="password">
            </div>
            <div class="unlogin">
                <a href="">忘记密码</a>
                <a @click="mode = 1">使用短信验证登录</a>
            </div>
            <button>登录</button>
            <a @click="mode = 0" class="btn btn-none">其他登录方式</a>
        </div>
    </div>
</template>
<script lang="ts">
export class MobileLogin extends WxComponent<any>  {
    public options = {
        addGlobalClass: true
    }
}
</script>
<style lang="scss" scoped>

</style>
