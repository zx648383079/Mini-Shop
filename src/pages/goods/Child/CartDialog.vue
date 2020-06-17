<template>
    <div class="cart-dialog" v-if="mode > 0" @click="tapClose">
        <div class="dialog-body" @click.stop>
            <div class="dialog-header">
                <img :src="product.thumb" alt="">
                <p class="price">￥{{ product.price }}</p>
                <p class="stock">库存：{{ product.stock }}</p>
                <p class="selected-property"></p>
                <i class="fa fa-close dialog-close" @click="tapClose"></i>
            </div>
            <div class="property-box">
                <div v-for="(item, index) in product.properties" :key="index" :class="['group', item.type == 2 ? ' multi-group' : '']">
                    <div class="group-header">{{ item.name }}</div>
                    <div class="group-body">
                        <span v-for="(attr, i) in item.attr_items" :key="i">{{ attr.value }}</span>
                    </div>
                </div>

                <div class="count-box">
                    <span>数量</span>
                    <div class="number-box">
                        <i class="fa fa-minus" @click="tapMinus"></i>
                        <input type="text" class="number-input" value="{{amount}}" bind:input="tapChangeAmount">
                        <i class="fa fa-plus" @click="tapPlus"></i>
                    </div>
                </div>
            </div>
            <div class="dialog-footer">
                <div @click="tapDoCart" class="dailog-yes">确认</div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { WxJson, WxComponent, WxMethod, InputEvent } from "../../../../typings/wx/lib.vue";
import { IProduct, ICartGroup } from "../../../api/model";
import { addGoods } from "../../../api/cart";
import {
    IMyApp
} from '../../../app.vue';

interface IComponentData {
    product?: IProduct,
    mode?: number,
    amount: number,
}

const app = getApp<IMyApp>();

@WxJson({
    component: true
})
export class CartDialog extends WxComponent<IComponentData>  {

    public options = {
        addGlobalClass: true,
    }

    public properties = {
        product: Object,
        mode: {
            type: Number,
            value: 0
        }
    }

    public data: IComponentData = {
        amount: 1
    }

    @WxMethod()
    public tapClose() {  
        this.triggerEvent('close');
    }

    @WxMethod()
    public getStock(): number {
        if (!this.data.product) {
            return 1;
        }
        return this.data.product.stock as number;
    }

    @WxMethod()
    public tapMinus() {
        this.setData({
            amount: Math.max(this.data.amount - 1, 1)
        });
    }

    @WxMethod()
    public tapChangeAmount(e: InputEvent) {
        let amount = e.detail.value;
        if (amount < 1) {
            amount = 1;
        } else {
            const stock = this.getStock();
            if (amount > stock) {
                amount = stock;
            }
        }
        this.setData({amount});
    }

    @WxMethod()
    public tapPlus() {
        this.setData({
            amount: Math.min(this.data.amount + 1, this.getStock())
        });
    }

    @WxMethod()
    public tapDoCart() {
        if (!this.data.product) {
            return;
        }
        if (this.data.mode == 1) {
            addGoods(this.data.product.id, this.data.amount).then(_ => {
                wx.showToast({
                    title: '已成功加入购物车'
                });
                this.tapClose();
            });
            return;
        }
        const data: ICartGroup[] = [
            {
                name: this.data.product.shop + '',
                goods_list: [
                    {
                        goods_id: this.data.product.id,
                        amount: this.data.amount,
                        goods: this.data.product,
                        price: this.data.product.price
                    }
                ]
            }
        ];
        app.setCart(data);
        wx.navigateTo({
            url: '/pages/cashier/index'
        });
    }
}
</script>
<style lang="scss" scoped>

</style>
