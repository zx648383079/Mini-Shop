<template>
    <div class="form-table">
        <div class="input-group">
            <label for="">申请原因</label>
            <div class="">
                <select class="form-control " required="">
                    <option>请选择申请原因</option>
                </select>
            </div>
        </div>
        <div class="input-group">
            <label for="退款金额">退款联系人</label>
            <div class="">
                <input type="text" id="退款金额" class="form-control " name="退款金额" placeholder="请输入 退款金额" required="">
            </div>
        </div>
        <div class="comment-input">
            <p>问题描述</p>
            <textarea name="content"></textarea>
            <div class="multi-image-box">
                <div class="image-item">
                    <img alt="">
                    <i class="fa fa-times"></i>
                </div>
                <div class="add-item" >
                    <i class="fa fa-plus"></i>
                </div>
            </div>
        </div>
        <div class="input-group">
            <label>退货方式</label>
            <div class="radio-box">
                <span class="active">快递</span>
                <div class="tip">商品寄回地址会在审核通过后以短信形式告知，或在申请记录中查询</div>
            </div>
        </div>
        <div class="address-input" v-if="mode == 3 || mode == 5">
            <label>收货地址</label>
            <span class="tip">(该地址是商城回寄给您的地址)</span>
            <div class="address-box" @click="tapAddress">
                <i class="fa fa-map-marker"></i>
                <p v-if="address">{{ address.region.full_name }} {{ address.address }}</p>
                <p v-else>请选择地址</p>
                <i class="fa fa-chevron-right"></i>
            </div>
        </div>
         <div class="input-group">
            <label for="退款金额">联系人</label>
            <div class="">
                <input type="text" id="退款金额" class="form-control " name="退款金额" placeholder="请输入 退款金额" required="">
            </div>
        </div>
        <div class="input-group">
            <label for="退款金额">联系方式</label>
            <div class="">
                <input type="text" id="退款金额" class="form-control " name="退款金额" placeholder="请输入 退款金额" required="">
            </div>
        </div>
        <div class="fixed-footer">
            <button class="btn" type="button">提交</button> 
        </div>
    </div>
</template>
<script lang="ts">
import { WxComponent, WxJson, WxMethod } from "../../../../typings/wx/lib.wx.page";
import { IAddress } from "../../../api/model";
import { IMyApp } from "../../../app";
const app = getApp<IMyApp>();

interface IComponentData {
    mode?: number,
    address_list: IAddress[],
    address: IAddress | null
}

@WxJson({
    component: true
})
export class AfterSalegGrid extends WxComponent<IComponentData>  {
    public options = {
        addGlobalClass: true,
    }
    public properties = {
        mode: Number,
    }

    public data: IComponentData = {
        address_list: [],
        address: null
    }

    ready() {
        app.getAddressList().then(res => {
            this.setData({
                address_list: res
            });
        });
        app.getAddress().then(res => {
            this.setData({
                address: res
            });
        })
    }

    @WxMethod()
    public tapAddress() {
        if (!this.data.address_list || this.data.address_list.length < 1) {
            wx.navigateTo({
                url: '/pages/address/create?back=2'
            });
            return;
        }
        wx.navigateTo({
            url: '/pages/address/index?back=2&selected=' + (this.data.address ? this.data.address.id + '' : '0')
        });
    }
}
</script>
<style lang="scss" scoped>
.comment-input {
    p {
        line-height: 30px;
    }
    textarea {
        width: 100%;
        resize: none;
        height: 100px;
    }
}
.radio-box {
    span {
        display: inline-block;
        background-color: #fff;
        border: 1px solid #ccc;
        padding: 0 10px;
        margin-left: 10px;
        box-sizing: content-box;
        line-height: 35px;
        &.active {
            background-color: #d22222;
            color: #fff;
        }
    }
}
.tip {
    font-size: 12px;
    color: #767676;
}
.address-input {
    padding-top: 10px;
}
.address-box {
    position: relative;
    padding: 10px 2rem 10px 3.75rem;
    .fa {
        position: absolute;
        font-size: 16px;
        top: 50%;
        margin-top: -8px;
        &.fa-map-marker {
            left: 1.1875rem;
        }
        &.fa-chevron-right {
            right: 0.3125rem;
        }
    }
}
</style>