<template>
    <div>
        <div class="has-header">
            <div class="top-header">
                <div v-if="!checked" class="check-btn" @click="tapCheck">
                    签到
                </div>
                <div v-else class="checked-btn">
                    <i class="fa fa-calendar-check" aria-hidden="true"></i>
                    已签到
                </div>
                <div v-if="checked" class="checked-tip">已连续签到{{ checked.running }}天，继续加油</div>
            </div>
            <div class="date-grid">
                <div class="title">{{ title }}</div>
                <div class="day-grid">
                    <ol><li>日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li></ol>
                    <ul>
                        <li v-for="(item, index) in day_list" :key="index" :class="{disable: item.disable, active: item.active}">{{ item.val }}</li>
                    </ul>
                </div>
            </div>
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

interface IDay {
    val: string,
    day?: number,
    disable?: boolean,
    active?: boolean,
}

import {
    IMyApp
} from '../../app';
import { WxJson, WxPage } from '../../../typings/wx/lib.wx.page';
const app = getApp<IMyApp>();

interface IPageData {
}
@WxJson({
    navigationBarTitleText: "签到",
    navigationBarBackgroundColor: "#f4f4f4",
    navigationBarTextStyle: "black"
})
export class Index extends WxPage<IPageData> {
    public checked: ICheckIn | null = null;

    public day_list: IDay[] = [];

    public title = '';

    public created() {
        this.refreshGrid(new Date());
        getCanCheckIn().then(res => {
            if (res.data) {
                this.checked = res.data;
            }
        });
        getMonth().then(res => {
            if (!res.data) {
                return;
            }
            const days = [];
            for (const item of res.data) {
                days.push(new Date(item.created_at).getDate());
            }
            this.checkDay(...days);
        });
    }

    public refreshGrid(current: Date) {
        const year = current.getFullYear();
        const month = current.getMonth() + 1;
        this.title = year + '-' + twoPad(month);
        const date = new Date(year, month, 0);
        const count = date.getDate();
        date.setDate(1);
        const start = date.getDay();
        this.day_list = [];
        for (let i = 0; i < count + start; i++) {
            this.day_list.push(i < start ? {
                val: '',
            } : {
                val: twoPad(i - start + 1),
                day: i - start + 1,
            });
        }
    }

    /**
     * tapCheck
     */
    public tapCheck() {
        checkIn().then(res => {
            if (res.data) {
                this.checked = res.data;
                this.checkDay(new Date().getDate());
            }
        });
    }

    /**
     * checkDay
     */
    public checkDay(...days: number[]) {
        let len = days.length;
        if (len < 1) {
            return;
        }
        for (let i = 0; i < this.day_list.length; i++) {
            if (this.day_list[i].day && days.indexOf(this.day_list[i].day) >= 0) {
                this.day_list[i].active = true;
                len --;
            }
            if (len < 1) {
                break;
            }
        }
        this.$forceUpdate();
    }

}
</script>
<style lang="scss" scoped>
.top-header {
    background: #05a6b1;
    color: #fff;
    height: 200px;
    padding-top: 40px;
    .checked-btn,
    .check-btn {
        font-size: 30px;
        width: 130px;
        margin: 0 auto;
        text-align: center;
        border: 1px solid;
        line-height: 40px;
        border-radius: 20px;
    }
    .checked-btn {
        background-color: rgba(255, 255, 255, .1);
        font-size: 22px;
    }
    .checked-tip {
        text-align: center;
        margin-top: 10px;
        font-size: 13px;
        font-weight: 300;
    }
}
.date-grid {
    width: 280px;
    margin: -60px auto 0;
    background-color: #fff;
    .title {
        line-height: 40px;
        text-align: center;
    }
    .day-grid {
        ol {
            background: #eee;
        }
        li {
            display: inline-block;
            width: 40px;
            line-height: 40px;
            text-align: center;
            box-sizing: border-box;
            list-style: none;
            color: #333;
        }
        ul {
            li {
                cursor: pointer;
                &.active {
                    background: #006cff;
                    color: #fff;
                    border-radius: 50%;
                    &:before {
                        font-family: "Font Awesome 5 Free";
                        font-weight: 900;
                        content: "\f00c";
                        color: rgba(255, 255, 255, .3);
                        font-size: 30px;
                        position: absolute;
                    }
                }
                &.disable {
                    color: #ccc;
                }
            }
        }
    }
}
</style>