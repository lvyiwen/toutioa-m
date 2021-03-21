<template>
  <div class='search-suggestion'>
    <van-cell @click='$emit("search", text)' icon="search"
      v-for="(text,index) in suggestions" :key="index">
      <span slot="title" v-html="hightlight(text)"></span>
    </van-cell>
  </div>
</template>
<script>
import { getSearchSuggestion } from '@/api/search'
// 按需加载只会把使用到的成员打包到结果中
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      // 联想建议数据列表
      suggestions: [],
      timer: null
    }
  },
  computed: {},
  watch: {
    searchText: {
      // debounce：
      // 参数一：一个函数
      // 参数二：延迟的毫秒数
      // 返回值：防抖之后的函数
      handler: debounce(function (value) {
        this.loadSearchSuggestions(value)
      }, 200),
      // 当searchText发生改变的时候就会调用handler函数
      // handler (value) {
      //   clearTimeout(this.timer)
      //   this.timer = setTimeout(function () {
      //     this.loadSearchSuggestions(value)
      //   }, 200)
      // },
      immediate: true // 该回调将会在真挺开始之后被立即调用
    }
  },
  created () { },
  mounted () { },
  methods: {
    async loadSearchSuggestions (q) {
      try {
        const res = await getSearchSuggestion(q)
        this.suggestions = res.data.options
      } catch (err) {
        this.$toast('数据获取失败，请稍后重试')
      }
    },
    hightlight (text) {
      // 正则表达式中不能使用数据变量正则表达式会将中间的内容都当做匹配字符串来使用
      // 而不是数据变量如果需要使用数据来充当匹配的字符串需要使用正则表达式中的RegExp
      // 方法来创建正则表达式的构造函数
      // 参数1：匹配模式字符串，它会根据字符串创建正则对象
      // 参数2：匹配的模式，要写到字符串中
      const reg = `<span class="active">${this.searchText}</span>`
      const hightlightStr = new RegExp(this.searchText, 'gi')
      return text.replace(hightlightStr, reg)
    }
  }
}
</script>
<style lang='less' scoped>
.search-suggestion {
  /deep/ .active {
    color: #3296fa !important;
  }
}
</style>
