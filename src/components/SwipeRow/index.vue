<template>
    <div class="swipe-row" :style="{left: left + 'px'}">
        <div class="actions-left" ref="left">
            <slot name="left"></slot>
        </div>
        <div class="swipe-content {{name}}"  
            @touchstart='touchStart'
            @touchmove='touchMove'
            @touchend='touchEnd'>
            <slot></slot>
        </div>
        <div class="actions-right" ref="right">
            <slot name="right">
                <i class="fa fa-trash" @click="tapRemove"></i>
            </slot>
        </div>
    </div>
</template>
<script lang="ts">

interface IComponentData {
    left: number,
    name?: string,
    index?: number
}

export class SwipeRow extends WxComponent<IComponentData> {

    options = {
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
        index: Number
    }

    public data: IComponentData = {
        left: 0
    };

    oldLeft: number = 0;
    startX = 0;
    isTouch = false;
    leftWidth = 0;
    rightWidth = 0;

    ready() {
        this.updateWidth();
    }

    updateWidth() {
        const query = wx.createSelectorQuery().in(this);
        query.select('.left').boundingClientRect((res) => {
            this.leftWidth = res.width;
        }).exec();
        query.select('.right').boundingClientRect(res => {
            this.rightWidth = res.width;
        }).exec();
    }

    getLeftWidth(): number {
        return this.leftWidth;
    }

    getRightWidth(): number {
        return this.rightWidth;
    }

    tapRemove(item: any) {
        this.triggerEvent('remove', item);
    }

    touchStart(e: TouchEvent) {
        this.resetOther();
        this.oldLeft = this.data.left;
        this.isTouch = false;
        this.startX = (e.changedTouches[0] as Touch).clientX;
    }

    touchMove(e: TouchEvent) {
        this.isTouch = true;
        const diff = (e.changedTouches[0] as Touch).clientX - this.startX;
        if (this.oldLeft == 0) {
            if (diff < 0) {
                this.setData({
                    left: Math.max(diff, -this.getRightWidth())
                });
                return;
            }
            this.setData({
                left: Math.min(diff, this.getLeftWidth())
            });
            return;
        }
        if (this.oldLeft > 0) {
            if (diff > 0) {
                return;
            }
            this.setData({
                left: Math.max(this.oldLeft + diff, 0)
            });
            return;
        }
        if (diff < 0) {
            return;
        }
        this.setData({
            left: Math.min(this.oldLeft + diff, 0)
        });
    }

    touchEnd() {
        if (!this.isTouch) {
            this.animation(this.data.left, 0);
            this.triggerEvent('click');
            return;
        }
        //const diff = e.changedTouches[0].clientX - this.startX;
        if (this.data.left == 0) {
            return;
        }
        if (this.data.left > 0) {
            const width = this.getLeftWidth();
            this.animation(this.data.left, this.data.left * 3 > width ? width : 0);
            return;
        }
        const width = - this.getRightWidth();
        this.animation(this.data.left, this.data.left * 3 < width ? width : 0);
    }

    animation(
        start: number, end: number, endHandle?: Function) {
        const diff = start > end ? -1 : 1;
        let step = 1;
        let handle = setInterval(() => {
            start += (step ++) * diff;
            if ((diff > 0 && start >= end) || (diff < 0 && start <= end)) {
                clearInterval(handle);
                this.setData({
                    left: end
                });
                endHandle && endHandle();
                return;
            }
            this.setData({
                left: start
            });
        }, 16);
    }

    public reset() {
        if (this.data.left === 0) {
            return;
        }
        this.animation(this.data.left, 0);
    }

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
