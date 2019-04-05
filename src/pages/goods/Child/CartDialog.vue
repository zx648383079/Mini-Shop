<template>
    <div class="cart-dialog" v-if="mode > 0" @click="tapClose">
        <div class="dialog-body" @click.stop>
            <div class="dialog-header">
                <img :src="product.thumb" alt="">
                <p class="price">{{ product.price }}</p>
                <p class="stock">库存：{{ product.stock }}</p>
                <p class="selected-property"></p>
                <i class="fa fa-times dialog-close" @click="tapClose"></i>
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
                        <input type="text" class="number-input" v-model="amount" @change="tapChangeAmount">
                        <i class="fa fa-plus" @click="tapPlus"></i>
                    </div>
                </div>
            </div>
            <div class="dialog-footer">
                <a @click="tapDoCart" class="dailog-yes">确认</a>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
export class BackHeader extends WxComponent<any>  {
    @Prop(Object) readonly product!: IProduct;
    @Prop({type: Number, default: 0}) readonly mode!: number;
    public amount: number = 1;

    @Emit('close')
    public tapClose() {  
    }

    public getStock(): number {
        if (!this.product) {
            return 1;
        }
        return this.product.stock as number;
    }

    public tapMinus() {
        this.amount = Math.max(this.amount - 1, 1);
    }

    public tapChangeAmount() {
        if (this.amount < 1) {
            this.amount = 1;
            return;
        }
        const stock = this.getStock();
        if (this.amount > stock) {
            this.amount = stock;
        }
    }

    public tapPlus() {
        this.amount = Math.min(this.amount + 1, this.getStock());
    }

    public tapDoCart() {
        if (!this.product) {
            return;
        }
        if (this.mode == 1) {
            addGoods(this.product.id, this.amount).then(res => {
                Toast('已成功加入购物车');
                this.tapClose()
            });
            return;
        }
        const data: ICart[] = [
            {
                name: this.product.shop + '',
                goods_list: [
                    {
                        goods_id: this.product.id,
                        amount: this.amount,
                        goods: this.product,
                        price: this.product.price
                    }
                ]
            }
        ];
        dispatchSetCart(data).then(() => {
            this.$router.push('/cashier');
        });
    }
}
</script>
<style lang="scss" scoped>

</style>
