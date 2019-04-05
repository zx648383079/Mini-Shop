<template>
    <div>
        <div class="has-header">
            <form class="form-inline" method="post">
                <div class="input-group">
                    <input type="text" name="name" placeholder="收货人" required  v-model="address.name">
                </div>
                <div class="input-group">
                    <input type="text" name="tel" placeholder="手机号" required v-model="address.tel">
                </div>
                <SelectPicker :items="regions" :column="3" v-model="address.region">
                    <div class="input-group region-box">
                        <span>{{ address.region && address.region.full_name ? address.region.full_name : '地址' }}</span>
                    </div>
                </SelectPicker>
                
                <div class="input-group">
                    <textarea name="address" placeholder="详细地址" required v-model="address.address"></textarea>
                </div>

                <div class="input-radio" @click="address.is_default = !address.is_default">
                    <span>设为默认地址</span>
                    <i class="fa toggle-box" :class="{active: address.is_default}"></i>
                </div>
            </form>
        </div>

        <div class="fixed-footer" v-if="address.id > 0">
            <button class="btn" type="button" @click="tapRemove">删除地址</button> 
        </div>

    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app';
const app = getApp<IMyApp>();

interface IPageData {
}

export class Edit extends WxPage<IPageData> {
    public address: IAddress = {
        id: 0,
        name: '',
        tel: '',
        region_id: 0,
        region_name: '',
        address: '',
        is_default: false,
    };

    public back: number = 0;

    public regions: IRegionObject = {};

    public created() {
        if (this.$route.query.back) {
            this.back = parseInt(this.$route.query.back + '');
        }
        getRegionTree().then(res => {
            if (res.data) {
                this.regions = res.data;
            }
        });
        const id = parseInt(this.$route.params.id);
        if (!id) {
            return;
        }
        getAddress(id).then(res => {
            this.address = res;
        });
    }

    public tapSubmit() {
        if (!this.address.region) {
            Toast('请选择收货地址');
            return;
        }
        const data: IAddress = {
            id: this.address.id,
            name: this.address.name,
            tel: this.address.tel,
            region_id: this.address.region.id,
            address: this.address.address,
            is_default: this.address.is_default
        };
        if (!data.name) {
            Toast('请输入收货人');
            return;
        }
        if (!data.tel) {
            Toast('请输入手机号');
            return;
        }
        if (this.address.id > 0) {
            updateAddress(data).then(res => {
                this.saveBack(res);
            });
        }
        createAddress(data).then(res => {
            this.saveBack(res);
        });
    }

    public tapRemove() {
        if (this.address.id < 1) {
            return;
        }
        
        deleteAddress(this.address.id).then(res => {
            dispatchSetAddressList([]);
            this.$router.back();
        });
    }

    public saveBack(address: IAddress) {
        dispatchSetAddressList([]);
        if (this.back < 1) {
            this.$router.back();
            return;
        }
        dispatchSetAddress(address);
        if (this.back === 1) {
            this.$router.replace('/cashier');
            return;
        }
        if (this.back === 2) {
            this.$router.back();
            return;
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
