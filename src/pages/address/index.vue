<template>
    <div class="address-list slide-box">
        <div class="item" v-for="(item, index) in items" :key="index" :index="item.id">
            <MpSlideView buttons="{{ item.is_default ? defaultButtons : slideButtons}}" bindbuttontap="slideButtonTap" :i="index">
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
import { WxPage, WxJson, TouchEvent } from '../../../typings/wx/lib.vue';
import { IAddress } from '../../api/model';
import { defaultAddress, deleteAddress } from '../../api/address';
const app = getApp<IMyApp>();

interface IPageData {
    items: IAddress[],
    selected: number,
    mode: number,
    slideButtons: any[],
    defaultButtons: any[],
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
        slideButtons: [
            {
              text: '设为默认',
              data: 0,
            },
            {
              text: '编辑',
              data: 1,
            },
            {
              type: 'warn',
              text: '删除',
              data: 2,
            }
        ],
        defaultButtons: [
            {
              text: '编辑',
              data: 1,
            },
            {
              type: 'warn',
              text: '删除',
              data: 2,
            }
        ]
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
                items: res
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
            // const rows: SwipeRow[] = this.$refs.swiperow as SwipeRow[];
            // for (const box of rows) {
            //     box.reset();
            // }
            if (this.data.mode > 0) {
                app.setAddressIfEmpty(item);
            }
            this.setData({
                items
            });
        });
    }

    slideButtonTap(e: any) {
        console.log(e);
        
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
