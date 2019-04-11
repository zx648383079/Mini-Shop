<template>
    <div>
        <div class="has-header">
            <div v-for="(item, index) in itemGroups" :key="index" :class="item.id ? 'log-item' : ''">
                <div class="log-hr" v-if="!item.id">
                    {{ item.remark }}
                </div>
                <div v-else>
                    <div class="info">
                        <div class="name">{{ item.remark }}</div>
                        <p>{{ item.created_at }}</p>
                    </div>
                    <div class="amount">
                        {{ item.money > 0 ? '+' + item.money : item.money }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {
    IMyApp
} from '../../app';
import { IAccountLog } from '../../api/model';
import { WxPage, WxJson } from '../../../typings/wx/lib.wx.page';
const app = getApp<IMyApp>();

interface IPageData {
    items: IAccountLog[],
}
@WxJson({
    navigationBarTitleText: "分类",
    navigationBarBackgroundColor: "#f4f4f4",
    navigationBarTextStyle: "black"
})
export class Card extends WxPage<IPageData> {
    
    public data: IPageData = {
        items: []
    };
    public has_more = true;
    public page = 1;
    public isLoading = false;

    itemGroups(): any[] {
        const data = [];
        let last: string = '';
        for (const item of this.data.items) {
            let match = (item.created_at + '').match(/(\d{4})-(\d{2})(-\d{2} \d{2}:\d{2})/);
            if (!match) {
                continue;
            }
            let current = match[1] + '年' + match[2] + '月';
            item.created_at = match[2] + match[3];
            if (last == current) {
                data.push(item);
                continue;
            }
            last = current;
            data.push({remark: last}, item);
        }
        return data;
    }

    public created() {
        this.refresh();
    }

    public loadMore() {
        this.goPage( ++ this.page);
    }

    /**
     * refresh
     */
    public refresh() {
        this.items = [];
        this.isLoading = false;
        this.has_more = true;
        this.goPage(this.page = 1);
    }

    public goPage(page: number) {
        if (this.isLoading || !this.has_more) {
            return;
        }
        this.isLoading = true;
        getAccountLog({
            page,
        }).then(res => {
            this.has_more = res.paging.more;
            this.isLoading = false;
            if (!res.data) {
                return;
            }
            this.items = [].concat(this.items as never[], res.data as never[]);
        });
    }
}
</script>
<style lang="scss" scoped>

</style>
