<template>
    <div>
      <div class="has-header">
            <div class="swipe-box address-list">
                <SwipeRow v-for="(item, index) in items" :name="['address-item', selected == item.id ? ' selected' : '']"  :key="index" :index="item.id" ref="swiperow" @click="tapSelected(item)">
                    <div slot="left" v-if="!item.is_default">
                        <a class="set-default" @click="tapDefault(item)">
                            设为默认
                        </a>
                    </div>
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
                    <div slot="right">
                        <a @click="tapEdit(item)">
                            <i class="fa fa-edit"></i>
                        </a>
                        <i class="fa fa-trash" @click="tapRemove(item)"></i>
                    </div>
                </SwipeRow>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app';
import { WxPage, WxJson } from '../../../typings/wx/lib.wx.page';
const app = getApp<IMyApp>();

interface IPageData {
}
@WxJson({
    navigationBarTitleText: "分类",
    navigationBarBackgroundColor: "#f4f4f4",
    navigationBarTextStyle: "black"
})
export class Index extends WxPage<IPageData> {
    public items: IAddress[] = [];
    public selected: number = 0;
    public mode: number = 0;

    public created() {
        if (this.$route.query.selected) {
            this.mode = this.$route.query.back ? parseInt(this.$route.query.back + '') :1;
            this.selected = parseInt(this.$route.query.selected + '');
        }
        dispatchAddressList().then(res => {
            if (!res) {
                return;
            }
            this.items = res;
        });
    }

    public tapEdit(item: IAddress) {
        this.$router.push({name: 'address-edit', params: { id: item.id + ''}});
    }

    public tapSelected(item: IAddress) {
        if (this.mode < 1) {
            return;
        }
        this.selected = item.id;
        dispatchSetAddress(item);
        if (this.mode === 1) {
            this.$router.replace('/cashier');
            return;
        }
        if (this.mode === 2) {
            this.$router.back();
            return;
        }
    }

    public tapDefault(item: IAddress) {
        defaultAddress(item.id).then(() => {
            for (const it of this.items) {
                it.is_default = item.id == it.id;
            }
            const rows: SwipeRow[] = this.$refs.swiperow as SwipeRow[];
            for (const box of rows) {
                box.reset();
            }
            if (this.mode > 0) {
                dispatchSetAddressIfEmpty(item);
            }
        });
    }

    public tapRemove(item: IAddress) {
        deleteAddress(item.id).then(() => {
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].id == item.id) {
                    this.items.splice(i, 1);
                }
            }
        });
    }
}
</script>
<style lang="scss" scoped>
.set-default {
    line-height: 5rem;
    font-size: 16px;
    margin: 0 10px;
}
</style>
