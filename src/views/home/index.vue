<template>
  <div class='home-container'>
    <!-- 导航栏 -->
    <div class="login-container">
      <van-nav-bar class="page-nav-bar" title="文本" fixed>
        <van-button class="search-btn page-nav-bar" slot="title" type="info"
          size="small" round icon="search" to="/search">搜索
        </van-button>
      </van-nav-bar>
    </div>

    <!-- 频道列表 -->
    <!-- 通过 v-model 绑定当前激活标签对应的索引值，
    默认情况下启用第一个标签。 -->
    <van-tabs v-model="active" animated swipeable class="channel-tabs">
      <van-tab :key="item.id" :title="item.name" v-for="item in channels">
        <!-- 文章列表 -->
        <article-list :channels='item'></article-list>
      </van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <div slot="nav-right" class="hamburger-btn"
        @click="ischannelsEditshow = true">
        <i class="iconfont icongengduo"></i>
      </div>
    </van-tabs>

    <!-- 频道编辑弹出层 -->
    <van-popup v-model="ischannelsEditshow" position="bottom"
      :style="{ height: '100%' }" closeable close-icon-position="top-left">
      <channel-edit :my-channels='channels' :active='active'
        @updata-active="onUpdateActive"></channel-edit>
    </van-popup>
    <!-- /频道编辑弹出层 -->
  </div>
</template>
<script>
import { getUserChannels } from '@/api/user'
// 导入文章列表组件
import ArticleList from './components/article-list'
// 导入频道编辑组件
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  name: 'HomeIndex',
  components: {
    // 注册为子组件
    ArticleList,
    ChannelEdit
  },
  props: {},
  data () {
    return {
      active: 0,
      // 频道列表
      channels: [],
      ischannelsEditshow: false// 是否展示弹出层
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {
    this.loadChannels()
  },
  mounted () { },
  methods: {
    async loadChannels () {
      try {
        let channels = []
        if (this.user) {
          // 已登录，请求获取使用户频道列表
          const res = await getUserChannels()
          // 将数据保存到本地的data中
          channels = res.data.channels
        } else {
          // 未登录，判断是否有本地的频道列表数据
          const localChannels = getItem('TOKEN_CHANNELS')
          if (localChannels) {
            // 有，拿来使用
            channels = localChannels
          } else {
            // 没有， 请求获取默认频道列表
            const res = await getUserChannels()
            // 将数据保存到本地的data中
            channels = res.data.channels
          }
        }
        this.channels = channels
      } catch (err) {
        this.$toast('获取频道数据列表失败')
      }
    },
    onUpdateActive (index, ischannelsEditshow = true) {
      this.active = index
      // 控制弹出层关闭
      this.ischannelsEditshow = false
    }
  }
}
</script>
<style lang='less' scoped>
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }

  /deep/ .channel-tabs {
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      left: 0;
      right: 0;
      z-index: 1;
      height: 82px;
    }
    .van-tab {
      min-width: 200px;
      border-right: 1px solid #edeff3;
      font-size: 30px;
      color: #777;
    }
    .van-tab--active {
      color: #333;
    }
    .van-tabs__nav {
      padding: 0;
    }
    .van-tabs__line {
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
      bottom: 8px;
    }
    .placeholder {
      width: 66px;
      height: 82px;
      //不参与flex布局剩余空间的计算
      flex-shrink: 0;
    }
    .hamburger-btn {
      position: fixed;
      display: flex;
      justify-content: center;
      align-items: center;
      right: 0;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.902;
      i.iconfont {
        font-size: 40px;
      }
      &:before {
        content: "";
        position: absolute;
        left: 0;
        width: 1px;
        height: 100%;
        background: url("../../assets/gradient-gray-line.png");
        background-size: contain;
      }
    }
  }
}
</style>
