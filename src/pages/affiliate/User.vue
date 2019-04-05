<template>
    <div>
        <BackHeader :title="$route.meta.title"/>
        <div class="has-header">
            <div class="swipe-box address-list">
                <div class="swipe-row" v-for="(item, index) in items" :key="index">
                    <div class="swipe-content address-item">
                        <div class="address-first">
                            <img :src="'/assets/images/avatar/14.png' | assets" alt="">
                        </div>
                        <div class="address-info">
                            <h3>213213213123</h3>
                            <p>
                               123
                            </p>
                        </div>
                    </div>
                    <div class="actions-right">
                        <i class="fa fa-trash"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import BackHeader from '@/components/BackHeader.vue';

@Component({
    components: {
        BackHeader,
    },
})
export default class User extends Vue {
    public items = [1];
}
</script>
<style lang="scss" scoped>

</style>
