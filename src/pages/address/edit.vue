<template>
    <div>
        <div>
            <form class="form-inline" bindsubmit="tapSubmit">
                <div class="input-group">
                    <input type="text" name="name" placeholder="收货人" required  value="{{ address.name }}">
                </div>
                <div class="input-group">
                    <input type="text" name="tel" placeholder="手机号" required value="{{ address.tel}}">
                </div>
                 <picker
                        name="region"
                        mode="region"
                        bindchange="bindRegionChange"
                        value="{{region}}">
                    <div class="input-group region-box">
                        <span v-if="region && region.length === 3">{{region[0]}} {{region[1]}} {{region[2]}}</span>
                        <span v-else>请选择地区</span>
                    </div>
                </picker>
                
                <div class="input-group">
                    <textarea name="address" placeholder="详细地址" required value="{{ address.address }}"></textarea>
                </div>

                <div class="input-radio">
                    <span>设为默认地址</span>
                    <switch name="is_default" checked="{{ address.is_default }}" bindchange="switchChange" />
                </div>
                <button class="btn" form-type="submit" type="primary" @click="tapSubmit">保存</button> 
                <button  v-if="address.id > 0" class="btn" type="warn" @click="tapRemove">删除地址</button> 
            </form>
        </div>

    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app.vue';
import { WxJson, WxPage, CustomEvent } from '../../../typings/wx/lib.vue';
import { IAddress } from '../../api/model';
import { getAddress, updateAddress, createAddress, deleteAddress } from '../../api/address';
const app = getApp<IMyApp>();

interface IPageData {
    address: IAddress,
    back: number,
    region: string[]
}
@WxJson({
    navigationBarTitleText: "编辑地址",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})
export class Edit extends WxPage<IPageData> {

    public data: IPageData = {
        address:  {
            id: 0,
            name: '',
            tel: '',
            region_id: 0,
            region_name: '',
            address: '',
            is_default: false,
        },
        back: 0,
        region: []
    }

    public onLoad(query?: any) {
        if (query && query.back) {
            this.setData({
                back: parseInt(query.back)
            });
        }
        // getRegionTree().then(res => {
        //     if (res.data) {
        //         this.setData({
        //             regions: res.data
        //         });
        //     }
        // });
        const id = query && query.id ? parseInt(query.id) : 0;
        if (!id) {
            return;
        }
        getAddress(id).then(res => {
            if (!res) {
                return;
            }
            this.setData({
                address: res,
                region: res.region_name ? res.region_name.split(' ') : [],
            });
        });
    }

    switchChange(e: CustomEvent) {
        // let address = this.data.address;
        // address.is_default = e.detail.value;
        // this.setData({
        //     address
        // });
    }

    bindRegionChange(e: CustomEvent) {
        this.setData({
            region: e.detail.value
        });
    }

    public tapSubmit(e: CustomEvent) {
        let address = e.detail.value;
        if (!address) {
            wx.showToast({
                title: '请完善收货地址'
            });
            return;
        }
        if (!address.region || address.region.length < 3) {
            wx.showToast({
                title: '请选择收货地址'
            });
            return;
        }
        const data: IAddress = {
            id: this.data.address.id,
            name: address.name,
            tel: address.tel,
            region_id: 0,
            region_name: address.region.join(' '),
            address: address.address,
            is_default: address.is_default
        };
        if (!data.name) {
            wx.showToast({
                title: '请输入收货人'
            });
            return;
        }
        if (!data.tel) {
            wx.showToast({
                title: '请输入手机号'
            });
            return;
        }
        if (data.id > 0) {
            updateAddress(data).then(res => {
                this.saveBack(res);
            });
        }
        createAddress(data).then(res => {
            this.saveBack(res);
        });
    }

    public tapRemove() {
        if (this.data.address.id < 1) {
            return;
        }
        
        deleteAddress(this.data.address.id).then(res => {
            app.setAddressList([]);
            wx.navigateBack({
                delta: 0
            });
        });
    }

    public saveBack(address: IAddress) {
        app.setAddressList([]);
        if (this.data.back < 1) {
            wx.navigateBack({
                delta: 0
            });
            return;
        }
        app.setAddress(address);
        if (this.data.back === 1) {
            wx.navigateTo({
                url: '/pages/cashier/index'
            });
            return;
        }
        if (this.data.back === 2) {
            wx.navigateBack({
                delta: 0
            });
            return;
        }
    }
}
</script>
<style lang="scss" scoped>
switch {
    float: right;
}
.btn {
    margin: 0 0 0 0.3125rem;
    line-height: 2.5rem;
    background-color: #d22222;
    color: #fff;
    display: block;
}
</style>
