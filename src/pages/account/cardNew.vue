<template>
    <div class="form-inline">
        <div class="tip">
            请输入您的银行卡号
        </div>
        <div class="input-group">
            <input type="text" v-model="card_no" placeholder="请输入卡号">
        </div>

        <button class="btn" @click="tapSubmit">下一步</button>
    </div>
</template>
<script lang="ts">
import { WxPage, WxJson } from "../../../typings/wx/lib.vue";
import { addBankCard } from "../../api/account";

interface IPageData {
    card_no: string;
}
@WxJson({
    navigationBarTitleText: "添加银行卡",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})
export class CardNew extends WxPage<IPageData> {
    
    public data = {
        card_no: ''
    };

    public tapSubmit() {
        let data = this.data;
        if (data.card_no.length < 5) {
            wx.showToast({
                icon: 'none',
                title: '请输入正确的卡号'
            });
            return;
        }
        addBankCard(data).then(_ => {
            wx.showToast({
                title: '添加成功'
            });
            wx.navigateBack({
                delta: 0
            });
        });
    }
}
</script>
<style lang="scss" scoped>
.form-inline {
    padding-top: 40px;
    .tip {
        line-height: 40px;
    }
    button {
        background-color: #b4282d;
        color: #fff;
        width: 80%;
        display: block;
        margin: 40px auto 0;
    }
}
</style>
