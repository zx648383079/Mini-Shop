<template>
    <div>
        <div class="has-footer" v-if="service">
            <div class="input-group">
                <label>取件地点</label>
                <div class="radio-box">
                    <span v-for="(item, index) in serviceList" :key="index" :class="{active: serviceIndex == index}" @click="tapService(index)">
                            {{ item.name }}
                    </span>
                </div>
                <p class="tip">{{ service.brief }}</p>
            </div>
            <div class="input-group" v-for="(item, index) in service.form" :key="index">
                <label>{{ item.label }}</label>
                <input type="text" :placeholder="item.label" value="{{ item.value }}" bind:input="tapValueChange" data-i="{{ index }}">
            </div>
            <div class="count-box">
                <span>数量</span>
                <div class="number-box">
                    <i class="fa fa-minus" @click="tapMinus"></i>
                    <input type="text" class="number-input" value="{{amount}}" bind:input="tapChangeAmount">
                    <i class="fa fa-plus" @click="tapPlus"></i>
                </div>
            </div>
            <div class="price-input">
                <span>服务费：</span>
                <span class="price">￥{{ price }}</span>
            </div>

            <div class="btn del-btn" @click="tapSubmit">
                下单
            </div>
        </div>

        <footer class="tab-bar">
            <a class="active">
                <i class="fa fa-gift" aria-hidden="true"></i>
                代取件
            </a>
            <a href="order" open-type="redirect">
                <i class="fa fa-user" aria-hidden="true"></i>
                订单
            </a>
        </footer>
    </div>
</template>
<script lang="ts">
import { WxPage, WxJson, InputEvent } from '../../../typings/wx/lib.vue';
import { ILegworkService, IPrePay } from '../../api/model';
import { getServiceList, createOrder } from '../../api/legwork';

interface IPageData {
    serviceList: ILegworkService[],
    serviceIndex: number;
    service: ILegworkService | null;
    amount: number;
    price: number;
}
@WxJson({
    navigationBarTitleText: "代取件",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white",
})
export class Index extends WxPage<IPageData> {
    public data: IPageData = {
        serviceList: [],
        serviceIndex: 0,
        service: null,
        amount: 1,
        price: 0,
    }

    public onLoad() {
        getServiceList().then(res => {
            if (!res.data || res.data.length < 1) {
                return;
            }
            this.setData({
                serviceList: res.data,
                serviceIndex: 0,
                amount: 1,
                service: res.data[0],
                price: res.data[0].price
            });
        });
    }

    public tapService(i: number) {
        const data = this.data;
        data.serviceIndex = i;
        data.service = data.serviceList[i];
        data.price = data.service.price * data.amount;
        this.setData(data);
    }
    

    public tapValueChange(e: InputEvent) {
        const data = this.data;
        if (!data.service) {
            return;
        }
        const index = e.currentTarget.dataset.i as number;
        data.service.form[index].value = e.detail.value;
        this.setData(data);
    }

    public tapMinus() {
        let data = this.data;
        data.amount = Math.max(1, data.amount - 1);
        data.price = data.service ? data.service.price * data.amount : 0;
        this.setData(data);
    }

    public tapPlus() {
        let data = this.data;
        data.amount = Math.max(1, data.amount + 1);
        data.price = data.service ? data.service.price * data.amount : 0;
        this.setData(data);
    }

    public tapChangeAmount(e: InputEvent) {
        let data = this.data;
        data.amount = Math.max(1, e.detail.value);
        data.price = data.service ? data.service.price * data.amount : 0;
        this.setData(data);
    }

    public tapSubmit() {
        let data = this.data;
        if (!data.service) {
            return;
        }
        let remark: {[key: string]: string} = {};
        for (const item of data.service.form) {
            if (!item.value && item.required) {
                wx.showToast({
                    icon: 'none',
                    title: '请输入 ' + item.label
                });
                return;
            }
            remark[item.name] = item.value ? item.value : '';
        }
        createOrder({
            service_id: data.service.id,
            amount: data.amount,
            remark
        }).then(res => {
            if (!res.data) {
                return;
            }
            this.doPay(res.data);
        })
    }

    doPay(data: IPrePay) {
        if (data.success) {
            wx.redirectTo({
                url: 'order'
            });
            return;
        }
        if (data.url) {
            //data.url
            return;
        }
        if (data.html) {
            // const div = document.createElement('div');
            // div.innerHTML = data.html;
            // document.body.appendChild(div);
            return;
        }
        if (data.params) {
            wx.requestPayment({
                timeStamp: data.params.timeStamp,
                nonceStr: data.params.nonceStr,
                package: data.params.package,
                signType: data.params.signType as any,
                paySign: data.params.paySign,
                success() {
                    wx.showToast({
                        title: '支付成功'
                    });
                    wx.redirectTo({
                        url: 'order'
                    });
                },
                fail(res) { 
                    wx.showToast({
                        icon: 'none',
                        title: '支付失败,'+ res.errMsg
                    });
                    return;
                }
            })
        }
    }

}
</script>
<style lang="scss" scoped>
page {
    background-color: #f4f4f4;
}
.input-group {
    margin-bottom: 10px;
    label {
        line-height: 30px;
        font-weight: 900;
    }
    input {
        // margin-top: 5px;
        width: 100%;
        height: 30px;
        border: none;
        border-bottom: 1px solid #ccc;
    }
}
.input-line {
    line-height: 30px;
    text {
        &:first-child {
            width: 120px;
        }
    }
}
.radio-box {
    text {
        display: inline-block;
        background-color: #fff;
        border: 1px solid #ccc;
        padding: 0 10px;
        margin-left: 2px;
        box-sizing: content-box;
        font-size: 14px;
        line-height: 30px;
        &.active {
            background-color: #d22222;
            color: #fff;
        }
    }
}
.tip {
    font-size: 12px;
    color: #767676;
}
.price-input {
    line-height: 30px;
    text-align: right;
    margin-top: 5px;
    .price {
        color: red;
        font-weight: 700;
        font-size: 20px;
    }
}
.count-box {
    line-height: 30px;
    .number-box {
        float: right;
    }
    .fa {
        vertical-align: top;
    }
}
</style>