<template>
    <div>
        <div class="title">
            <span>邮箱注册</span>
        </div>
        <div class="input-box">
            <input type="email" name="email" required autocomplete="off" v-model="email" placeholder="请输入账号">
        </div>
        <div class="input-box">
            <input type="password" name="password" required autocomplete="off" @keyup="tapKey" v-model="password" placeholder="请输入密码">
        </div>
        <button>注册</button>
        <div class="input-group">
            <div class="checkbox" @click="agree = !agree">
                <i :class="['far', agree ? 'fa-check-square' : 'fa-square']"></i>
            </div>
            同意本站协议
        </div>
    </div>
</template>
<script lang="ts">
import { WxComponent, WxJson, TouchEvent } from "../../../../typings/wx/lib.vue";


@WxJson({
    component: true
})
export class EmailRegister extends WxComponent<any>  {

    public options = {
        addGlobalClass: true
    }
    public agree = true;
    public email: string = '';

    public password: string = '';

    public tapKey(e: TouchEvent) {
        if (e.which !== 13) {
            return;
        }
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
</style>
