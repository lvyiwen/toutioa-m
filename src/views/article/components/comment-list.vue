<template>
  <div class='comment-list'>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了"
      @load="onLoad" :error.sync='error' error-text='加载失败请点击重试'
      :immediate-check="false">
      <comment-item v-for="(item, index) in list" :key="index"
        :title="item.content" :comment='item'
        @reply-click="$emit('reply-click', $event)" />
    </van-list>
  </div>
</template>
<script>
import { getComment } from '@/api/comment.js'
import CommentItem from './comment-item'
export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      // 自定义Prop数据验证
      validator (value) {
        // 验证传入的数据必须是a ， c两个字符串 如果不是就会报错
        // 类型不对 返回一个布尔值
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }

  },
  data () {
    return {
      // list: [],
      loading: false,
      finished: false,
      // 获取下一页数据的时间戳
      offset: null,
      // 获取的每页数据的多少
      limit: 10,
      error: false
    }
  },
  computed: {},
  watch: {},
  created () {
    // 需要在没到可视区域的时候就加在数据
    // 当自己手动调用onLoad的的时候不会触发loading事件所以需要我们手动的在
    // created中调用loading
    this.loading = true
    this.onLoad()
  },
  mounted () { },
  methods: {
    async onLoad () {
      try {
        // 请求获取数据
        const res = await getComment({
          type: this.type, // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source.toString(), // 源id，文章id或评论id
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        })

        // console.log(res)
        // 将数据添加到列表中
        const { results } = res.data
        this.list.push(...results)

        // 将文章的评论总数传递到父组件
        this.$emit('onload-success', res.data)
        // 将loading设置为false
        this.loading = false
        // 判断是否还有数据
        if (results.length) {
          // 有就更新获取下一页的数据页码
          this.offset = res.data.last_id
        } else {
          // 没有就将finished设置结束
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>
<style lang='less' scoped>
</style>
