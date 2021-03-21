<template>
  <van-button :loading='loading' @click="onCollect"
    :icon="value === 1 ? 'good-job' :'good-job-o'"
    :class="{liked: value === 1}" />
</template>
<script>
import { addLiked, deleteLiked } from '@/api/article'
export default {
  name: 'LikedArticle',
  components: {},
  props: {
    value: {
      type: Number,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    async onCollect () {
      // 让loading在一开始的时候就加载
      this.loading = true
      let status = -1
      try {
        if (this.value === 1) {
          // 以点赞， 取消点赞
          await deleteLiked(this.articleId)
        } else {
          // 未点赞，点击点赞
          await addLiked(this.articleId)
          status = 1
        }
        // 更新视图变更点赞与未点赞
        this.$emit('input', status)
        this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')
      } catch (err) {
        this.$toast.fail('操作失败， 请重试')
      }
      this.loading = false
    }
  }
}
</script>
<style lang='less' scoped>
.liked {
  .van-icon {
    color: #e5645f;
  }
}
</style>
