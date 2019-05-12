<template>
    <div>
        <SwipeRowBox class="swipe-box address-list">
            <SwipeRow right-width="150" left-width="200" v-for="(item, index) in items" :name="['address-item', selected == item.id ? ' selected' : '']"  :key="index" :index="item.id" ref="swiperow">
                <div slot="left" class="actions-left" v-if="!item.is_default">
                    <a class="set-default" @click="tapDefault(item)">
                        设为默认
                    </a>
                </div>
                <div slot="content" class="swipe-content" @click="tapSelected" data-i="{{ index }}">
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
                <div slot="right" class="actions-right">
                    <a @click="tapEdit(item)">
                        <i class="fa fa-edit"></i>
                    </a>
                    <i class="fa fa-trash" @click="tapRemove(item)"></i>
                </div>
            </SwipeRow>
        </SwipeRowBox>
        <a href="edit" class="add-btn">添加</a>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app';
import { WxPage, WxJson, TouchEvent } from '../../../typings/wx/lib.wx.page';
import { IAddress } from '../../api/model';
import { defaultAddress, deleteAddress } from '../../api/address';
const app = getApp<IMyApp>();

interface IPageData {
    items: IAddress[],
    selected: number,
    mode: number
}
@WxJson({
    usingComponents: {
        SwipeRowBox: '/components/SwipeRow/box',
        SwipeRow: '/components/SwipeRow/index'
    },
    navigationBarTitleText: "我的地址",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})
export class Index extends WxPage<IPageData> {

    public data: IPageData = {
        items: [],
        selected: 0,
        mode: 0
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

.swipe-content {
    width: 750rpx;
}
.actions-right,
.actions-left {
    height: 100px;
    display: flex;
    direction: row;
    text-align: center;
    vertical-align: middle;
    line-height: 200px;
    .set-default {
        line-height: 5rem;
        font-size: 16px;
        margin: 0 10px;
        width: 200rpx;
    }
    .fa-trash {
        background-color: red;
        color: #fff;
        width: 150rpx; 
    }
}
</style>
