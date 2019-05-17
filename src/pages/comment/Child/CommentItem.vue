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
import { IOrderGoods, IComment } from "../../../api/model";
import { WxJson, WxComponent, WxMethod } from "../../../../typings/wx/lib.wx.page";
import { commentGoods } from "../../../api/order";

interface IComponentData {
    item?: IOrderGoods[],
    comment: IComment
}

@WxJson({
    component: true,
    usingComponents: {
        Star: 'Star'
    }
})
export class CommentItem extends WxComponent<IComponentData>  {
    public options = {
        addGlobalClass: true,
    };

    public properties = {
        item: Object,
    }

    public data: IComponentData = {
        comment: {
            title: '',
            content: '',
            rank: 10,
            images: [],
        }
    }

    @WxMethod()
    tapRemove(i: number) {
        if (!this.data.comment || !this.data.comment.images) {
            return;
        }
        this.data.comment.images.splice(i, 1);
    }

    @WxMethod()
    tapSave() {
        const comment = {
            title: this.data.item.name,
            content: this.data.comment.content,
            rank: this.data.comment.rank,
            images: this.data.comment.images,
            goods: this.data.item.id,
        };
        if (!comment.content || comment.content.length < 10) {
            wx.showToast({
                title: '评论内容必须大于10个字符'
            });
            return;
        }
        commentGoods(comment).then(() => {
            this.triggerEvent('commented');
        });
    }
}
</script>
<style lang="scss" scoped>

</style>
