<template>
  <div class="comment-post">
    <van-field class="post-field" v-model.trim="message" rows="2" autosize
      type="textarea" maxlength="50" placeholder="优质评论将会被优先展示"
      show-word-limit />
    <van-button type="primary" size="small" class='post-btn' @click="onPost"
      :disabled="!message.length">发布
    </van-button>
  </div>
</template>

<script>
import { addComment } from '@/api/comment'
export default {
  name: 'CommentPost',
  components: {},
  // 接收祖先组件传递到所有后代组件的数据
  // 注意：不要滥用
  inject: {
    articleId: {
      type: [Number, String, Object],
      default: null
    }
  },
  props: {
    // target是评论的目标（文章/评论）
    // 对文章的评论 称为 评论
    // 对评论的评论 称为 回复
    target: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      // 评论内容
      message: ''
    }
  },
  computed: {},
  watch: {},
  created () {

  },
  mounted () { },
  methods: {
    async onPost () {
      this.$toast.loading({
        message: '发布中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 持续时间 默认是2秒 如果为0 就持续展示
      })
      try {
        const res = await addComment(
          {
            target: this.target.toString(), // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
            content: this.message, // 评论内容
            art_id: this.articleId ? this.articleId.toString() : null// 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
          }
        )
        // console.log(res)

        // 清空输入框
        this.message = ''
        this.$emit('post-success', res.data)
        this.$toast.success('发布成功')
      } catch (err) {
        this.$toast('发布失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    background: #fff;
    &::before {
      display: none;
    }
  }
}
</style>
