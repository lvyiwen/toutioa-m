<template>
  <div class='search-container'>
    <!-- 顶部搜索栏 -->
    <form action="/" class="search-from">
      <van-search v-model="searchText" show-action placeholder="请输入搜索关键词"
        @search="onSearch" @cancel="onCancel" background="#3296fa"
        @focus="isResultShow=false" />
    </form>
    <!-- 搜索结果 -->
    <search-result v-if="isResultShow" :search-text='searchText' />
    <!-- 联想建议 -->
    <search-suggestion @search="onSearch" v-else-if="searchText"
      :search-text='searchText' />
    <!-- 搜索历史记录 -->
    <search-history v-else :search-histories='SearchHistories'
      @clear-search-histories='SearchHistories = []' @search='onSearch' />

  </div>
</template>
<script>
import SearchHistory from './components/search-history'
import SearchSuggestion from './components/search-suggestion'
import SearchResult from './components/search-result'
import { setItem, getItem } from '@/utils/storage'
export default {
  name: 'SearchIndex',
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  props: {},
  data () {
    return {
      searchText: '', // 输入框的绑定数据
      isResultShow: false, // 控制搜索结果的展示
      SearchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || [] // 搜索的历史记录数据
    }
  },
  computed: {},
  watch: {
    SearchHistories (val) {
      setItem('TOUTIAO_SEARCH_HISTORIES', val)
    }
  },
  created () { },
  mounted () { },
  methods: {
    // 敲回车 触发onSearch事件
    // val文本框输入的内容
    onSearch (val) {
      // 更新文本框内容
      this.searchText = val

      // 存储搜索历史记录
      // 要求=：不要有重复历史记录， 最新的排在最前面
      const index = this.SearchHistories.indexOf(val)
      if (index !== -1) {
        this.SearchHistories.splice(index, 1)
      }
      // 将内容追加到数组的最前面unshift
      this.SearchHistories.unshift(val)

      // 渲染搜索结果
      this.isResultShow = true
    },
    // 当点击取消按钮会触发 onCancel事件
    onCancel () {
      // 点击返回首页
      this.$router.back()
    }
  }
}
</script>
<style lang='less' scoped>
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-from {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
