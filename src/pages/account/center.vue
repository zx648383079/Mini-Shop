<template>
    <div>
        <div class="account-box">
            <div class="line-item" v-for="(item, index) in items" :key="index">
                <span><i :class="['fab', item.icon]"></i>{{ item.name }}</span>
                <span>{{ item.id ? '已绑定' : '未绑定' }}</span>
                <i class="fa fa-chevron-right"></i>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app';
import { IConnect } from '../../api/model';
import { getConnect } from '../../api/user';
import { WxPage, WxJson } from '../../../typings/wx/lib.wx.page';
const app = getApp<IMyApp>();

interface IPageData {
    items: IConnect[]
}
interface IConnectMapItem {
    name?: string;
    icon?: string;
}

interface IConnectMap {
    [key: string]: IConnectMapItem
}
@WxJson({
    navigationBarTitleText: "账户安全",
    navigationBarBackgroundColor: "#05a6b1",
    navigationBarTextStyle: "white"
})
export class Center extends WxPage<IPageData> {

    public data: IPageData = {
        items: []
    };

    public created() {
        getConnect().then(res => {
            if (!res.data) {
                return;
            }
            this.refresh(res.data);
        }); 
    }

    public refresh(items: IConnect[]) {
        const maps: IConnectMap = {
            qq: {
                name: 'QQ',
                icon: 'fa-qq'
            },
            wx: {
                name: '微信',
                icon: 'fa-weixin'
            },
            alipay: {
                name: '支付宝',
                icon: 'fa-alipay'
            },
            weibo: {
                name: '微博',
                icon: 'fa-weibo'
            },
            paypal: {
                name: 'PayPal',
                icon: 'fa-paypal'
            },
            github: {
                name: 'Github',
                icon: 'fa-github'
            },
            google: {
                name: 'Google',
                icon: 'fa-google'
            },
        };
        for (const item of items) {
            if (item.vendor && !maps.hasOwnProperty(item.vendor)) {
                maps[item.vendor] = item;
                continue;
            }
            if (!item.vendor) {
                continue;
            }
            maps[item.vendor] = Object.assign(maps[item.vendor], item);
        }
        items = [];
        for (const key in maps) {
            if (maps.hasOwnProperty(key)) {
                items.push(maps[key]);
            }
        }
        this.setData({
            items: items
        });
    }
}
</script>
<style lang="scss" scoped>

</style>
