<template>
    <form method="POST" class="comment-form-item">
        <div class="goods-img">
            <img :src="item.thumb" alt="">
        </div>
        <div class="comment-star">
            <Star v-model="comment.rank"/>
        </div>
        <div class="comment-input">
            <p>分享您的使用体验吧</p>
            <textarea name="content" v-model="comment.content"></textarea>
            <div class="multi-image-box">
                <div class="image-item" v-for="(img, i) in comment.images" :key="i">
                    <img :src="img.image" alt="">
                    <i class="fa fa-times" @click="tapRemove(i)"></i>
                </div>
                <div class="add-item" >
                    <i class="fa fa-plus"></i>
                </div>
            </div>
        </div>
        <div class="input-radio">
            <span>匿名评价</span>
            <i class="fa toggle-box"></i>
        </div>
        <button type="button" @click="tapSave" class="btn">提交评价</button>
    </form>
</template>
<script lang="ts">
export class BackHeader extends WxComponent<any>  {
    @Prop(Object) readonly item!: IOrderGoods;

    comment: IComment = {
        title: '',
        content: '',
        rank: 10,
        images: [],
    };

    tapRemove(i: number) {
        if (!this.comment || !this.comment.images) {
            return;
        }
        this.comment.images.splice(i, 1);
    }

    tapSave() {
        const comment = {
            title: this.item.name,
            content: this.comment.content,
            rank: this.comment.rank,
            images: this.comment.images,
            goods: this.item.id,
        };
        if (!comment.content || comment.content.length < 10) {
            Toast('评论内容必须大于10个字符');
            return;
        }
        commentGoods(comment).then(() => {
            this.$emit('commented');
        });
    }
}
</script>
<style lang="scss" scoped>

</style>
