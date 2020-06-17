<template>
    <div>
        <div>
            <form class="form-inline" bindsubmit="tapSubmit">
                <div class="input-group">
                    <input type="text" name="name" placeholder="收货人" required  v-model="address.name">
                </div>
                <div class="input-group">
                    <input type="text" name="tel" placeholder="手机号" required v-model="address.tel">
                </div>
                 <picker
                        name="region"
                        range="{{ regionList }}"
                        range-key="name"
                        mode="multiSelector"
                        bindchange="bindRegionChange"
                        bindcolumnchange="bindRegionColumn"
                        value="{{regionIndex}}">
                    <div class="input-group region-box">
                        <span v-if="region && region.length === 3">{{region[0]}} {{region[1]}} {{region[2]}}</span>
                        <span v-else>请选择地区</span>
                    </div>
                </picker>
                
                <div class="input-group">
                    <textarea name="address" placeholder="详细地址" required v-model="address.address"></textarea>
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
import { IAddress, IRegion } from '../../api/model';
import { getAddress, updateAddress, createAddress, deleteAddress } from '../../api/address';
import { getRegionChildren } from '../../api/region';
const app = getApp<IMyApp>();

interface IPageData {
    address: IAddress,
    back: number,
    region: string[],
    regionIndex: number[];
    regionList: IRegion[][],
    regionCache: {[id: number]: IRegion[]},
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
        region: [],
        regionIndex: [0, 0, 0],
        regionList: [[], [], []],
        regionCache: {}
    }

    public onLoad(query?: any) {
        if (query && query.back) {
            this.setData({
                back: parseInt(query.back)
            });
        }
        this.getChildren(0).then(res => {
            this.getChildren(res[0].id).then(city => {
                this.getChildren(city[0].id).then(dist => {
                    this.setData({
                        regionList: [res, city, dist]
                    });
                });
            });
        });
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
                region: res.region && res.region.full_name ? (res.region.full_name as string).split(' ') : [],
            });
        });
    }

    public getChildren(id: number): Promise<IRegion[]> {
        const regionCache = this.data.regionCache;
        return new Promise((resolve, reject) => {
            if (regionCache[id]) {
                resolve(regionCache[id]);
                return;
            }
            getRegionChildren(id).then(res => {
                regionCache[id] = res.data as IRegion[];
                resolve(regionCache[id]);
            }).catch(reject);
        });
    }

    switchChange(e: CustomEvent) {
        let address = this.data.address;
        address.is_default = e.detail.value;
        this.setData({
            address
        });
    }

    bindRegionColumn(e: CustomEvent) {
        this.changeRegion(e.detail.column as number, e.detail.value as number);
    }

    changeRegion(column: number, index: number) {
        let data = this.data;
        data.regionIndex[column] = index;
        if (data.regionList[column].length < index) {
            this.setData(data);
            return;
        }
        if (column > 1) {
            this.setData(data);
            return;
        }
        this.getChildren(data.regionList[column][index].id).then(res => {
            data.regionList[column + 1] = res;
            this.changeRegion(column + 1, 0);
        });
    }

    bindRegionChange(e: CustomEvent) {
        let data = this.data;
        const ids = e.detail.value as number[];
        const region = [];
        for (let i = 0; i < ids.length; i++) {
            const val = ids[i];
            const item = data.regionList[i][val];
            region.push(item.name);
            data.address.region_id = item.id;
        }
        this.setData({
            region
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
        if (!this.data.region || this.data.region.length < 3) {
            wx.showToast({
                title: '请选择收货地址'
            });
            return;
        }
        const data: IAddress = {
            id: this.data.address.id,
            name: address.name,
            tel: address.tel,
            region_id: this.data.address.region_id,
            region_name: this.data.region.join(' '),
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
            return;
        }
        createAddress(data).then(res => {
            this.saveBack(res);
        });
    }

    public tapRemove() {
        if (this.data.address.id < 1) {
            return;
        }
        
        deleteAddress(this.data.address.id).then(_ => {
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
                delta: 0,
                success: function () { 
                    let page = getCurrentPages().pop(); 
                    if (!page) {
                        return; 
                    }
                    page.onLoad(); 
                }
            });
            return;
        }
        app.setAddress(address);
        if (this.data.back === 1) {
            wx.redirectTo({
                url: '/pages/cashier/index'
            });
            return;
        }
        if (this.data.back === 2) {
            wx.navigateBack({
                delta: 0,
                success: function () { 
                    let page = getCurrentPages().pop(); 
                    if (!page) {
                        return; 
                    }
                    page.onLoad(); 
                }
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
.region-box {
    padding-top: 5px;
    box-sizing: border-box;
}
</style>
