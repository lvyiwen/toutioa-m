<template>
  <van-button v-if="isFollowed" class="follow-btn" round size="small"
    :loading='loading' @click="onFollow">已关注
  </van-button>
  <van-button v-else class="follow-btn" type="info" color="#3296fa" round
    size="small" icon="plus" :loading='loading' @click="onFollow">关注
  </van-button>
</template>
<script>
import { addFollow, deleteFollow } from '@/api/user'
export default {
  name: 'FollowUser',
  components: {},
  model: {
    prop: 'isFollowed',
    event: 'update-is_followed'
  },
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    userId: {
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
    async onFollow () {
      this.loading = true // 展示关注按钮的loading状态
      try {
        if (this.isFollowed) {
          // 已关注，取消关注
          await deleteFollow(this.userId)
        } else {
          // 没有关注，添加关注
          await addFollow(this.userId)
        }
        // 更新是否关注的状态
        // this.article.is_followed = !this.article.is_followed
        this.$emit('update-is_followed', !this.isFollowed)
      } catch (err) {
        this.$toast('操作失败，请重试')
      }
      this.loading = false // 关闭关注按钮的loading状态
    }
  }
}
</script>
<style lang='less' scoped>
</style>
