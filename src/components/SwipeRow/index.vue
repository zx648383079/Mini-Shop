<template>
    <movable-area style="width: {{width}}rpx; height: {{height}}rpx;">
        <movable-view class="swipe-row" direction="horizontal"  out-of-bounds="{{out}}" damping="20" x="{{left}}" style="width: {{width + leftWidth + rightWidth}}rpx; height: {{height}}rpx;" inertia  @touchstart='touchStart'
                bindchange='touchMove'
                @touchend='touchEnd'>
            <div class="actions-left">
                <slot name="left"></slot>
            </div>
            <div class="swipe-content {{name}}">
                <slot name="content"></slot>
            </div>
            <div class="actions-right">
                <slot name="right">
                    
                </slot>
            </div>
        </movable-view>

    </movable-area>
</template>
<script lang="ts">
import { WxComponent, WxJson, WxMethod, TouchEvent, Touch, CustomEvent } from "../../../typings/wx/lib.wx.page";


interface IComponentData {
    viewWidth: number,
    left: number,
    name?: string,
    index?: number,
    out: boolean
}

const _windowWidth = wx.getSystemInfoSync().windowWidth // (px)

@WxJson({
    component: true
})
export class SwipeRow extends WxComponent<IComponentData> {

    public options = {
        addGlobalClass: true,
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    };

    public relations = {
        './box': {
            type: 'parent', // 关联的目标节点应为子节点
            linked(target: any) {
                // 每次有custom-li被插入时执行，target是该节点实例对象，触发在该节点attached生命周期之后
            },
            linkChanged(target: any) {

            },
            unlinked(target: any) {
                // 每次有custom-li被移除时执行，target是该节点实例对象，触发在该节点detached生命周期之后
            }
        }
    }

    public properties = {
        name: String,
        index: Number,
        //  组件显示区域的宽度 (rpx)
        width: {
            type: Number,
            value: 750 // 750rpx 即整屏宽
        },
        //  组件显示区域的高度 (rpx)
        height: {
            type: Number,
            value: 80,
        },
        //  组件滑动显示区域的宽度 (rpx)
        leftWidth: {
            type: Number,
            value: 0
        },
        rightWidth: {
            type: Number,
            value: 0
        }
    }

    public data: IComponentData = {
        viewWidth: _windowWidth, // (rpx)
        //  movable-view偏移量
        left: 0,
        //  movable-view是否可以出界
        out: false,
    };

    oldLeft: number = 0;
    startX = 0;
    isTouch = false;
    leftWidth = 0;
    rightWidth = 0;

    ready() {
        this.updateWidth();
    }
    @WxMethod()
    updateWidth() {
        const query = wx.createSelectorQuery().in(this);
        query.select('.actions-left').boundingClientRect((res) => {
            this.leftWidth = res.width;
        }).exec();
        query.select('.actions-right').boundingClientRect(res => {
            this.rightWidth = res.width;
        }).exec();
    }
    @WxMethod()
    getLeftWidth(): number {
        return this.leftWidth;
    }
    @WxMethod()
    getRightWidth(): number {
        return this.rightWidth;
    }
    @WxMethod()
    tapRemove(item: any) {
        this.triggerEvent('remove', item);
    }
    @WxMethod()
    touchStart(e: TouchEvent) {
        this.resetOther();
        this.oldLeft = this.data.left;
        this.isTouch = false;
        this.startX = (e.changedTouches[0] as Touch).clientX;
    }
    @WxMethod()
    touchMove(e: CustomEvent) {
        if (!this.data.out && e.detail.x < -this._threshold) {
        this.setData({
          out: true
        })
      } else if (this.data.out && e.detail.x >= -this._threshold) {
        this.setData({
          out: false
        })
      }
    }
    @WxMethod()
    touchEnd() {
        this._endX = e.changedTouches[0].pageX
      const {_endX, _startX, _threshold} = this
      if (_endX > _startX && this.data.out === false) return
      if (_startX - _endX >= _threshold) {
        this.setData({
          x: -this._slideWidth
        })
      } else if (_startX - _endX < _threshold && _startX - _endX > 0) {
        this.setData({
          x: 0
        })
      } else if (_endX - _startX >= _threshold) {
        this.setData({
          x: 0
        })
      } else if (_endX - _startX < _threshold && _endX - _startX > 0) {
        this.setData({
          x: -this._slideWidth
        })
      }
    }
    @WxMethod()
    public reset() {
        if (this.data.left === 0) {
            return;
        }
    }
    @WxMethod()
    resetOther() {
        if (typeof this.data.index == 'undefined') {
            return;
        }
        // const items: SwipeRow[] = this.$parent.$refs.swiperow as SwipeRow[];
        // if (!items || items.length < 1) {
        //     return;
        // }
        // for (let i = 0; i < items.length; i++) {
        //     if (items[i].index == this.data.index) {
        //         continue;
        //     }
        //     items[i].reset();
        // }
    }
}

</script>
<style lang="scss" scoped>

</style>
