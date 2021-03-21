<template>
  <div class='search-history'>
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span @click="$emit('clear-search-histories', [])">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon name="delete" v-else @click="isDeleteShow = true" />
    </van-cell>
    <van-cell v-for="(item, index) in SearchHistories" :key="index"
      :title="item" @click="onSearchItemClick(item, index)">
      <van-icon name="close" v-show="isDeleteShow" />
    </van-cell>

  </div>
</template>
<script>
export default {
  name: 'SearchHistory',
  components: {},
  props: {
    SearchHistories: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isDeleteShow: false // 控制删除显示状态
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    onSearchItemClick (item, index) {
      if (this.isDeleteShow) {
        // 删除状态，删除历史记录数据
        this.SearchHistories.splice(index, 1)
      } else {
        // 非删除状态，直接进入搜索
        this.$emit('search', item)
      }
    }
  }
}
</script>
<style lang='less' scoped>
</style>
