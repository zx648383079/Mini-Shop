<template>
    <div>
        <div class="header top">
            <div class="search-box">
                <div class="form-box">
                    <i class="fa fa-search" @click="tapConfirm"></i>
                    <input type="text" name="keywords" value="{{ keywords }}" bindinput="onKeyUp" placeholder="搜索" autocomplete="off" confirm-type="search" bindconfirm="tapConfirm">
                    <i class="fa fa-close" v-if="keywords && keywords.length > 0" @click="tapClearSearch"></i>
                </div>
                <a class="cancel-btn" href="/pages/index/index" open-type="switchTab">取消</a>
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
                        <span v-for="(item, index) in history_list" :key="index" wx:key="*this" @click="tapSearch" data-value="{{ item }}">{{ item }}</span>
                    </div>
                </div>
                <div class="panel" v-if="hot_keywords && hot_keywords.length > 0">
                    <div class="panel-header">
                        <span>热门搜索</span>
                    </div>
                    <div class="panel-body">
                        <span v-for="(item, index) in hot_keywords" :key="index" wx:key="*this" @click="tapSearch" data-value="{{ item }}">{{ item }}</span>
                    </div>
                </div>
            </div>
            <ul class="search-tip-box" v-else>
                <li v-for="(item, index) in tip_list" :key="index" wx:key="*this">
                    <span @click="tapSearch" data-value="{{ item }}">{{ item }}</span>
                </li>
            </ul>

        </div>
    </div>
</template>
<script lang="ts">
import { WxPage, WxJson, InputEvent, TouchEvent } from '../../../typings/wx/lib.vue';
import { getHotKeywords, getTips } from '../../api/product';

interface IPageData {
    keywords: string,
    hot_keywords: string[],
    tip_list: string[],
    history_list: string[],
}

const KEYWORDS_HISTORY = 'KEYWORDS_HISTORY';

@WxJson({
    navigationBarTitleText: "搜索",
    navigationBarBackgroundColor: "#f4f4f4",
    navigationBarTextStyle: "black"
})
export class Index extends WxPage<IPageData> {

    public data: IPageData = {
        keywords: '',
        hot_keywords: [],
        tip_list: [],
        history_list: [],
    };

    public onLoad(query?: any) {
        this.setData({
            keywords: query && query.keywords ? query.keywords : '',
            history_list: wx.getStorageSync(KEYWORDS_HISTORY) || []
        });
        getHotKeywords().then(res => {
            this.setData({
                hot_keywords: res.data ? res.data : []
            });
        });
    }

    tapClearHistory() {
        this.setData({
            history_list: []
        });
        wx.removeStorageSync(KEYWORDS_HISTORY);
    }
    tapClearSearch() {
        this.setData({
            tip_list: []
        });
    }
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
    onKeyUp(event: InputEvent) {
        this.setData({
            keywords: event.detail.value
        });
        if (!event.detail.value || event.detail.value.trim().length === 0) {
            return;
        }
        getTips(event.detail.value).then(res => {
            this.setData({
                tip_list: res.data ? res.data : []
            });
        });
    }

    tapConfirm() {
        console.log(arguments);
        
        if (!this.data.keywords || this.data.keywords.trim().length === 0) {
            return;
        }
        this.addHistory(this.data.keywords);
        this.tapEnterSearch(this.data.keywords);
    }

    tapSearch(e: TouchEvent) {
        this.tapEnterSearch(e.currentTarget.dataset.value + '');
    }

    tapEnterSearch(keywords: string) {
        wx.navigateTo({
            url: 'result?keywords=' + keywords
        });
    }
}
</script>
<style lang="scss" scoped>
.home-btn {
    .fa {
        font-size: 28px;
    }
}
</style>