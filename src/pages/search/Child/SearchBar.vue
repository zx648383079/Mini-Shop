<template>
    <div>
        <div class="header top">
            <div class="search-box">
                <div class="form-box">
                    <i class="fa fa-search" aria-hidden="true"></i>
                    <input type="text" name="keywords" :value="value" @input="tapUpdateVal($event.target.value)" @keyup="onKeyUp" placeholder="搜索" autocomplete="off">
                    <i class="fa fa-close" v-if="value && value.length > 0" @click="tapClearSearch"></i>
                </div>
                <a class="cancel-btn" @click="tapBack">取消</a>
            </div>
        </div>
        <div class="has-header">
            <div class="search-recommend-box" v-if="!tip_list || tip_list.length == 0">
                <div class="panel" v-if="history_list && history_list.length > 0">
                    <div class="panel-header">
                        <span>历史记录</span>
                        <i class="fa fa-trash" @click="tapClearHistory"></i>
                    </div>
                    <div class="panel-body">
                        <span v-for="(item, index) in history_list" :key="index" wx:key="*this" @click="tapSearch(item)">{{ item }}</span>
                    </div>
                </div>
                <div class="panel" v-if="hot_keywords && hot_keywords.length > 0">
                    <div class="panel-header">
                        <span>热门搜索</span>
                    </div>
                    <div class="panel-body">
                        <span v-for="(item, index) in hot_keywords" :key="index" wx:key="*this" @click="tapSearch(item)">{{ item }}</span>
                    </div>
                </div>
            </div>
            <ul class="search-tip-box" v-else>
                <li v-for="(item, index) in tip_list" :key="index" wx:key="*this">
                    <span @click="tapSearch(item)">{{ item }}</span>
                </li>
            </ul>

        </div>
    </div>
</template>
<script lang="ts">
import { getHotKeywords, getTips } from "../../../api/product";
import { WxComponent, WxJson, WxMethod } from "../../../../typings/wx/lib.wx.page";

interface IComponentData {
    hot_keywords: string[],
    tip_list: string[],
    history_list: string[],
    value?: string,
}

const KEYWORDS_HISTORY = 'KEYWORDS_HISTORY';

@WxJson({
    component: true
})
export class SearchBar extends WxComponent<IComponentData>  {

    public options = {
        addGlobalClass: true
    }

    public data: IComponentData = {
        hot_keywords: [],
        tip_list: [],
        history_list: [],
    }
    public properties = {
        value: String,
    }
    ready() {
        this.setData({
            history_list: wx.getStorageSync(KEYWORDS_HISTORY) || []
        });
        getHotKeywords().then(res => {
            this.setData({
                hot_keywords: res.data ? res.data : []
            });
        });
    }

    @WxMethod()
    tapBack() {
        
    }
    @WxMethod()
    tapUpdateVal(val: string) {
        this.triggerEvent('input', val);
    }

    @WxMethod()
    tapClearHistory() {
        this.setData({
            history_list: []
        });
        wx.removeStorageSync(KEYWORDS_HISTORY);
    }
    @WxMethod()
    tapClearSearch() {
        this.tapUpdateVal('');
        this.setData({
            tip_list: []
        });
    }
    @WxMethod()
    addHistory(keywords: string) {
        let history_list = this.data.history_list || [];
        if (history_list.indexOf(keywords) >= 0) {
            return;
        }
        history_list.push(keywords);
        if (history_list.length > 8) {
            history_list.splice(8);
        }
        this.setData({
            history_list
        });
        wx.setStorageSync(KEYWORDS_HISTORY, history_list);
    }

    @WxMethod()
    onKeyUp(event: any) {
        if (!this.data.value || this.data.value.trim().length === 0) {
            return;
        }
        if (event.which === 13) {
            this.addHistory(this.data.value);
            this.tapSearch(this.data.value);
            return;
        }
        getTips(this.data.value).then(res => {
            this.setData({
                tip_list: res.data ? res.data : []
            });
        });
    }
    @WxMethod()
    tapSearch(keywords: string) {
        this.triggerEvent('search', keywords);
    }
}
</script>
