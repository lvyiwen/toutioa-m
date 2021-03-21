<template>
  <div class='search-result'>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了"
      @load="onLoad" :error.sync="error" error-text="请求失败，点击重新加载">
      <van-cell v-for="(article, index) in list" :key="index"
        :title="article.title" />
    </van-list>
  </div>
</template>
<script>
import { getSearchResult } from '@/api/search'
export default {
  name: 'SearchResult',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      // 搜索结果的页码值
      page: 1,
      // 搜索结果每页显示的数据
      per_page: 20,
      // 控制 提示错误消息
      error: false

    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    async onLoad () {
      try {
        // 1、获取数据
        const res = await getSearchResult({
          page: this.page, // 页码值
          per_page: this.per_page, // 每页传递数据的数量
          q: this.searchText// 输入的搜索关键词

        })
        // 2、将数据追加到数组中
        const { results } = res.data
        this.list.push(...results)
        // 3、结束loading状态
        this.loading = false
        // 4、判断是否还有数据 是否继续获取下一页数据
        if (results.length) {
          this.page++
        } else {
          // 5、没有数据 结束获取状态
          this.finished = true
        }
      } catch (err) {
        // 展示加载失败的提示状态
        this.error = true
        // 加载失败loading也要停止
        this.loading = false
        this.$toast('获取搜索结果失败')
      }
    }
  }
}
</script>
<style lang='less' scoped>
</style>
