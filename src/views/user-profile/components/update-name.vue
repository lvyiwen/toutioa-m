<template>
  <div class='update-name'>
    <!-- 导航栏 -->
    <van-nav-bar title="修改昵称" left-text="取消" right-text="完成"
      @click-left="$emit('close')" @click-right="onConfirm" />

    <!-- 输入框 -->
    <div class="update-wrap">
      <van-field v-model.trim="locaname" rows="2" autosize type="textarea"
        maxlength="7" placeholder="请输入昵称" show-word-limit />
    </div>

  </div>
</template>
<script>
import { UpdateUserProfile } from '@/api/user'
export default {
  name: 'UpdateName',
  components: {},
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      locaname: this.value // 文本框输入的内容
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        const locaname = this.locaname
        if (!locaname.length) {
          this.$toast('昵称不能为空')
          return
        }
        await UpdateUserProfile({
          name: locaname
        })
        // 更新视图
        this.$emit('input', locaname)
        // 关闭弹层
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast('更新失败')
      }
    }
  }
}
</script>
<style lang='less' scoped>
/deep/.van-nav-bar__content {
  background-color: #fff;
  .van-nav-bar__title {
    color: black !important;
  }
}
.update-wrap {
  padding: 20px;
}
</style>
