<template>
    <div>
        <div class="form-inline" v-if="step == 1">
            <div class="tip">
                领实名新人大礼包
            </div>
            <div class="input-group">
                <input type="text" v-model="name" placeholder="真实姓名" required>
            </div>
            <div class="input-group">
                <input type="text" v-model="card_no" placeholder="身份证号" required>
            </div>

            <button class="btn btn-primary" @click="tapStep" data-step="2">下一步</button>
        </div>
        <div v-if="step == 2">
            <div class="tip">
                请上传手持身份证照片
            </div>
            <div class="photo-box" @click="tapFrontSide">
                <i class="fa fa-plus" v-if="!front_side"></i>
                <img v-else :src="front_side" alt="">
                <div class="tip">人像页</div>
            </div>
            <div class="photo-box" @click="tapBackSide">
                <i class="fa fa-plus" v-if="!back_side"></i>
                <img v-else :src="back_side" alt="">
                <div class="tip">国徽页</div>
            </div>

             <button class="btn btn-primary" @click="tapSubmit">上传并提交申请</button>
        </div>
    </div>
</template>
<script lang="ts">
import { WxComponent, WxJson, WxMethod, TouchEvent } from "../../../../typings/wx/lib.vue";
import { uploadCertification, saveCertification } from "../../../api/account";

interface IComponentData {
    step: number,
    name: string;
    card_no: string;
    front_side: string;
    back_side: string;
}

@WxJson({
    component: true
})
export class ApplyCertification extends WxComponent<IComponentData>  {

    public options = {
        addGlobalClass: true,
    };

    public data: IComponentData = {
        step: 1,
        name: '',
        card_no: '',
        front_side: '',
        back_side: '',
    }

    @WxMethod()
    public tapStep(e: TouchEvent) {
        let data = this.data;
        if (data.name.trim().length < 1) {
            wx.showToast({
                icon: 'none',
                title: '请输入真实姓名'
            })
            return;
        }
        if (data.card_no.length < 15) {
            wx.showToast({
                icon: 'none',
                title: '请输入身份证号'
            })
            return;
        }
        this.setData({
            step: e.currentTarget.dataset.step
        });
    }

    @WxMethod()
    tapSubmit() {
        let data = this.data;
        if (data.name.trim().length < 1) {
            wx.showToast({
                icon: 'none',
                title: '请输入真实姓名'
            })
            return;
        }
        if (data.card_no.length < 15) {
            wx.showToast({
                icon: 'none',
                title: '请输入身份证号'
            })
            return;
        }
        if (data.front_side.length < 1) {
            wx.showToast({
                icon: 'none',
                title: '请上传身份证照片'
            })
            return;
        }
        if (data.back_side.length < 1) {
            wx.showToast({
                icon: 'none',
                title: '请上传身份证照片'
            })
            return;
        }
        saveCertification(data).then(() => {
            wx.showToast({
                title: '您的实名认证正在审核中'
            });
            wx.navigateBack({
                delta: 0
            });
        });
    }

    @WxMethod()
    public tapFrontSide() {
        this.upload('front_side');
    }

    @WxMethod()
    public tapBackSide() {
        this.upload('back_side');
    }

    @WxMethod()
    public upload(key: string) {
        let that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original'],
            success (res) {
                if (res.tempFilePaths && res.tempFilePaths.length > 0) {
                    uploadCertification(res.tempFilePaths[0]).then(res => {
                        that.setData({
                            [key]: res.data
                        });
                    });
                }
            }
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
