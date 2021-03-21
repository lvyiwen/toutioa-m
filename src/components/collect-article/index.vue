<template>
  <van-button :loading='loading' @click="onCollect"
    :icon="value ? 'star' :'star-o'" :class="{collected: value}" />
</template>
<script>
import { addCollect, deleteCollect } from '@/api/article'
export default {
  name: 'CollectArticle',
  components: {},
  props: {
    value: {
      type: Boolean,
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
      this.loading = true
      try {
        if (this.value) {
          // 已收藏，取消收藏
          await deleteCollect(this.articleId)
        } else {
          // 没有收藏，添加收藏
          await addCollect(this.articleId)
        }
        // 自定义修改数据并不是立即的
        this.$toast.success(!this.value ? '收藏成功' : '取消收藏')
        // 更新视图
        this.$emit('input', !this.value)
      } catch (err) {
        this.$toast('操作失败，请重试！')
      }
      this.loading = false
    }
  }
}
</script>
<style lang='less' scoped>
.collected {
  .van-icon {
    color: #ffa500;
  }
}
</style>
