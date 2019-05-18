<template>
    <div>
        <form class="form-inline" method="post" v-if="step == 1">
            <div class="tip">
                领实名新人大礼包
            </div>
            <div class="input-group">
                <input type="text" placeholder="真实姓名" required>
            </div>
            <div class="input-group">
                <input type="text" placeholder="身份证号" required>
            </div>

            <button class="btn btn-primary" @click="tapStep" data-step="2">下一步</button>
        </form>
        <div v-if="step == 2">
            <div class="tip">
                请上传手持身份证照片
            </div>
            <div class="photo-box">
                <i class="fa fa-plus"></i>
                <div class="tip">人像页</div>
            </div>
            <div class="photo-box">
                <i class="fa fa-plus"></i>
                <div class="tip">国徽页</div>
            </div>

             <button class="btn btn-primary">上传并提交申请</button>
        </div>
    </div>
</template>
<script lang="ts">
import { WxComponent, WxJson, WxMethod, TouchEvent } from "../../../../typings/wx/lib.wx.page";

interface IComponentData {
    step: number
}

@WxJson({
    component: true
})
export class ApplyCertification extends WxComponent<IComponentData>  {

    public data: IComponentData = {
        step: 1
    }

    @WxMethod()
    public tapStep(e: TouchEvent) {
        this.setData({
            step: e.currentTarget.dataset.step
        });
    }
}
</script>
<style lang="scss" scoped>
.tip {
    line-height: 80px;
    text-align: center;
    background-color: #fff;
}
.photo-box {
    height: 200px;
    text-align: center;
    border: 1px dotted;
    .tip {
        background-color: transparent;
        text-align: center;
    }
    .fa {
        font-size: 80px;
        color: rgba(0, 0, 0, .4);
        margin-top: 40px;
    }
}
</style>
