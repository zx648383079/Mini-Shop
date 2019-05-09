<template>
    <div class="dialog-panel-box">
        <div @click="showCalendar" class="dialog-panel__input-container">
            <slot name="input"></slot>
        </div>
        <div class="dialog dialog-content" v-if="calendarVisible">
            <div class="dialog-header">
                <slot name="header">
                    <div class="dialog-title">{{ title }}</div>
                    <i class="fa fa-close dialog-close" @click="hideCalerdar"></i>
                </slot>
            </div>
            <div class="dialog-body">
                <slot name="panel"></slot>
            </div>
            <div class="dialog-footer">
                <slot name="footer"></slot>
            </div>
        </div>
        <div class="dialog-bg" v-if="calendarVisible" @click="hideCalerdar"/>
    </div>
</template>
<script lang="ts">
import { WxJson, WxComponent, WxMethod } from "../../../typings/wx/lib.wx.page";

interface IComponentPage {
    calendarVisible: boolean
}

@WxJson({
    component: true
})
export class DialogPanel extends WxComponent<IComponentPage>  {

    public options = {
        addGlobalClass: true,
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    };

    public properties = {
        title: String,
        hide: Boolean,
    }

    public data: IComponentPage = {
        calendarVisible: false
    }

    ready() {
        
    }

    @Watch('calendarVisible')
    public onVisibleChanged(val: boolean, oldVal: boolean) {
        this.$emit('toggle', val);
    }

    @Watch('hide')
    public onHideChanged(val: boolean, oldVal: boolean) {
        if (this.calendarVisible === !val) {
            return;
        }
        this.calendarVisible = !val;
    }

    @WxMethod()
    public showCalendar() {
        this.setData({
            calendarVisible: true
        });
    }

    @WxMethod()
    public hideCalerdar() {
       this.setData({
           calendarVisible: false
       });
    }
}
</script>
<style lang="scss">
.dialog.dialog-content {
    bottom: 0px;
    top: 38%;
    animation: fadeInUp 0.5s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
</style>
