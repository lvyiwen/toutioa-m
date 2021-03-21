<template>
  <div class='article-list'>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh"
      :success-text="refreshThePrompt" success-duration='1500'>
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了"
        @load="onLoad" :error.sync="error" error-text="请求失败，点击重新加载">
        <article-item v-for="(article, index) in list" :key="index"
          :article='article' />
        <!-- <van-cell v-for="(article, index) in list" :key="index"
          :title="article.title" /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import { getArticle } from '@/api/article.js'
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channels: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      // 存储列表数据的数组
      list: [],
      // 控制加载中loading状态
      loading: false,
      // 控制数据加载结束的状态
      finished: false,
      timestamp: null, // 请求获取下一页数据的时间戳
      error: false, // 控制列表加载失败的提示状态
      isLoading: false, // 控制下拉刷新的loading状态
      refreshThePrompt: '刷新成功' // 刷新成功提示消息
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    // 初始化或滚动到底部的时候会触发调用onLoad
    async onLoad () {
      // 1、请求获取数据
      try {
        const res = await getArticle({
          channel_id: this.channels.id, // 频道id
          // 简单理解就是请求数据的页码 pre_timestamp
          timestamp: this.timestamp || Date.now(),
          with_top: 1 // 是否包含置顶文章1包含置顶 0不包含置顶
        })
        // 2、把请求结果数据放在list数组中
        const { results } = res.data
        this.list.push(...results)
        // 3、本次数据加载结束之后要把加载状态设置为结束
        this.loading = false
        // 4、判断数据是否全部加载完成
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = res.data.pre_timestamp
        } else {
          // 没有数据了将finished设置为true
          this.finished = true
        }
      } catch (err) {
        // 请求失败了
        this.error = true
        this.loading = false
      }

      // 如果没有数据了，把finished设置为true， 之后不再触发加载更多
    },
    // 当下啦刷新的时候会触发调用该函数
    async onRefresh () {
      try {
        // 请求获取数据
        const res = await getArticle({
          channel_id: this.channels.id, // 频道id
          // 简单理解就是请求数据的页码 pre_timestamp
          timestamp: Date.now(), // 因为是刷新 所以需要传递过去最新的时间戳
          with_top: 1 // 是否包含置顶文章1包含指定 0不包含置顶
        })
        // 将数据追加到列表的顶部
        // 2、把请求结果数据放在list数组中
        const { results } = res.data
        this.list.unshift(...results)
        // 关闭下拉刷新的loading状态
        this.isLoading = false
        // 更新提示的消息
        this.refreshThePrompt = `刷新成功,更新了${results.length}条数据`
      } catch (err) {
        // 提示错误消息
        this.refreshThePrompt = '刷新失败'
        // 关闭下拉刷新的loading状态
        this.isLoading = false
      }
    }
  }
}
</script>
<style lang='less' scoped>
.article-list {
  // css3中新增的一种窗口高度的视口
  height: 79vh;
  overflow-y: auto;
}
</style>
