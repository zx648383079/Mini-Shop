<template>
    <div class="address-list slide-box">
        <div class="item" v-for="(item, index) in items" :key="index" :index="item.id">
            <MpSlideView buttons="{{ item.buttons }}" bindbuttontap="slideButtonTap" >
                <div class="address-item" :class="{active: selected == index}" @click="tapSelected" data-i="{{ index }}">
                    <div class="address-first">
                        <span>{{ item.name }}</span>
                    </div>
                    <div class="address-info">
                        <p>
                            <span class="name">{{ item.name }}</span>
                            <span class="tel">{{ item.tel }}</span>
                        </p>
                        <p>
                            <span class="default" v-if="item.is_default">默认</span>
                            <span>{{ item.region.full_name }} {{ item.address }}</span>    
                        </p>
                    </div>
                </div>
            </MpSlideView>
        </div>
        <a href="edit" class="add-btn">添加</a>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app.vue';
import { WxPage, WxJson, TouchEvent, CustomEvent } from '../../../typings/wx/lib.vue';
import { IAddress } from '../../api/model';
import { defaultAddress, deleteAddress } from '../../api/address';
const app = getApp<IMyApp>();

interface IPageData {
    items: IAddress[],
    selected: number,
    mode: number,
}

@WxJson({
    usingComponents: {
        MpSlideView: 'weui-miniprogram/slideview/slideview'
    },
    navigationBarTitleText: "我的地址",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white",
})
export class Index extends WxPage<IPageData> {

    public data: IPageData = {
        items: [],
        selected: 0,
        mode: 0,
    }

    public onLoad(query?: any) {
        if (query && query.selected) {
            this.setData({
                mode: query.back ? parseInt(query.back) : 1,
                selected: parseInt(query.selected)
            });
        }
        app.getAddressList().then(res => {
            if (!res) {
                return;
            }
            this.setData({
                items: this.formatButton(res)
            });
        });
    }

    public tapEdit(item: IAddress) {
        wx.navigateTo({
            url: 'edit?id=' + item.id
        });
    }

    public tapSelected(e: TouchEvent) {
        if (this.data.mode < 1) {
            return;
        }
        let item = this.data.items[e.currentTarget.dataset.i as number];
        this.setData({
            selected: item.id
        });
        app.setAddress(item);
        if (this.data.mode === 1) {
            wx.navigateTo({
                url: '/pages/cashier/index'
            });
            return;
        }
        if (this.data.mode === 2) {
            wx.navigateBack({
                delta: 0,
            });
            return;
        }
    }

    public tapDefault(item: IAddress) {
        let items = this.data.items;
        defaultAddress(item.id).then(() => {
            for (const it of items) {
                it.is_default = item.id == it.id;
            }
            if (this.data.mode > 0) {
                app.setAddressIfEmpty(item);
            }
            this.setData({
                items
            });
        });
    }

    slideButtonTap(e: CustomEvent) {
        const id = e.detail.data as number;
        let index = e.detail.index as number;
        for (let i = 0; i < this.data.items.length; i++) {
            const item = this.data.items[i];
            if (item.id === id) {
                if (item.is_default) {
                    index ++;
                }
                if (index < 1) {
                    return this.tapDefault(item);
                }
                if (index === 1) {
                    return this.tapEdit(item);
                }
                return this.tapRemove(item);
            }
        }
    }

    public tapRemove(item: IAddress) {
        let items = this.data.items;
        deleteAddress(item.id).then(() => {
            for (let i = 0; i < items.length; i++) {
                if (items[i].id == item.id) {
                    items.splice(i, 1);
                }
            }
            this.setData({
                items
            });
        });
    }

    private formatButton(res: any[]): any[] {
        return res.map(item => {
                    item.buttons = item.is_default ? 
                    [
                        {
                        text: '编辑',
                        data: item.id,
                        },
                        {
                        type: 'warn',
                        text: '删除',
                        data: item.id,
                        }
                    ] : [
                        {
                            text: '设为默认',
                            data: item.id,
                        },
                        {
                            text: '编辑',
                            data: item.id,
                        },
                        {
                            type: 'warn',
                            text: '删除',
                            data: item.id,
                        }
                    ];
                    return item;
                });
    }
}
</script>
<style lang="scss" scoped>
page {
    background-color: #f4f4f4;
}
.item {
    margin-bottom: 10px;
    background-color: #fff;
}
</style>
