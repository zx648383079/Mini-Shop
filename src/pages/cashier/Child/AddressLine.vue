<template>
    <div @click="tapClick">
        <div class="address-box" v-if="address">
            <i class="fa fa-map"></i>
            <p>
                <a >
                    <span class="name">{{ address.name }}</span>
                    <span class="tel">{{ address.tel }}</span>
                </a>
            </p>
            <p>{{ address.region.full_name }} {{ address.address }}</p>
            <i class="fa fa-chevron-right"></i>
        </div>
        <div class="address-box empty-address" v-else>
            <i class="fa fa-map"></i>
            <h3>
                <a>请选择地址</a>
            </h3>
            <i class="fa fa-chevron-right"></i>
        </div>
    </div>
</template>
<script lang="ts">
import { WxComponent, WxJson, WxMethod } from "../../../../typings/wx/lib.wx.page";
import { IAddress } from "../../../api/model";


interface IComponentData {
    address?: IAddress
}

@WxJson({
    component: true
})
export class AddressLine extends WxComponent<IComponentData>  {

    public options = {
        addGlobalClass: true,
    }

    public properties = {
        address: Object,
    }

    @WxMethod()
    public tapClick() {
        this.triggerEvent('click')
    }
}
</script>
<style lang="scss" scoped>
.address-box {
    background-color: #fff;
}
.empty-address {
    view {
        font-size: 1.5rem;
        line-height: 3.875rem;
    }
}
</style>