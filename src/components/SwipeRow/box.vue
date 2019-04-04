<template>
    <div class="swipe-box">
        <slot></slot>
    </div>
</template>
<script lang="ts">
import { SwipeRow } from "./index.vue";


export class SwipeBox extends WxComponent<any> {

    public relations = {
        './index': {
            type: 'child', // 关联的目标节点应为子节点
            linked(target: SwipeRow) {
                // 每次有custom-li被插入时执行，target是该节点实例对象，触发在该节点attached生命周期之后
            },
            linkChanged(target: SwipeRow) {

            },
            unlinked(target: SwipeRow) {
                // 每次有custom-li被移除时执行，target是该节点实例对象，触发在该节点detached生命周期之后
            }
        }
    }

    ready() {

    }

    /**
     * hideRow
     */
    public hideRow(row: SwipeRow) {
        let nodes: SwipeRow[] = this.getRelationNodes<SwipeRow>('/components/SwipeRow/index');
        for (const item of nodes) {
            if (item.data.index === row.data.index) {
                continue;
            }
            item.reset();
        }
    }
    
}

</script>
<style lang="scss" scoped>

</style>
