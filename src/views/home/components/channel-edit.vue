<template>
  <div class='channel-edit'>
    <van-cell :border='false'>
      <div slot="title" class="title-text">我的频道</div>
      <van-button type="danger" round size="mini" plain class="edit-btn"
        @click="isEdit = !isEdit">{{isEdit ? '完成' : '编辑'}}
      </van-button>
    </van-cell>
    <van-grid :gutter="10" class="my-grid">
      <van-grid-item class="grid-item" v-for="(channel, index) in myChannels"
        :key="index"
        :icon="isEdit && !fiexdChannels.includes(channel.id)  ? 'clear': ''">
        <span slot="text" class="text"
          :class="active === index ? ' active' : ''"
          @click="onChannelClick(channel, index)">{{channel.name}}</span>
      </van-grid-item>
    </van-grid>
    <van-cell :border='false'>
      <div slot="title" class="title-text">频道推荐
      </div>
    </van-cell>
    <van-grid :gutter="10" class="recommend-grid">
      <van-grid-item icon='plus' class="grid-item"
        v-for="(channel, index) in recommendChannels" :key="index"
        :text="channel.name" @click="onAddChannel(channel)" />
    </van-grid>
  </div>
</template>
<script>
import { getALLChannel, addUserChannel, deleteUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      // 所有频道列表数据
      allChannel: [],
      isEdit: false,
      fiexdChannels: [0]
    }
  },
  computed: {
    ...mapState(['user']),
    recommendChannels () {
      return this.allChannel.filter(channel => {
        return !this.myChannels.find(myChannels => {
          return myChannels.id === channel.id
        })
      })
    }
    // 筛选 推荐频道
    // recommendChannels () {
    //   // 存储推荐频道的数组
    //   const channels = []
    //   // 循环遍历数据
    //   this.allChannel.forEach(channel => {
    //     const ret = this.myChannels.find(myChannels => {
    //       return myChannels.id === channel.id
    //     })
    //     if (!ret) {
    //       channels.push(channel)
    //     }
    //   })
    //   return channels
    // }
  },
  watch: {},
  created () {
    this.loadALLChannel()
  },
  mounted () { },
  methods: {
    // 获取所有频道列表的数据
    async loadALLChannel () {
      try {
        const res = await getALLChannel()
        this.allChannel = res.data.channels
      } catch (err) {
        this.$toast('获取所有频道列表失败')
      }
    },
    // 点击将推荐频道的推荐添加到 我的频道中
    async onAddChannel (channel) {
      this.myChannels.push(channel)
      try {
        if (this.user) {
          // 已登录， 把数据请求接口放到线上
          await addUserChannel({
            id: channel.id, // 频道id
            seq: this.myChannels.length // 序列号
          })
        } else {
          // 未登录，把数据存储到本地
          setItem('TOKEN_CHANNELS', this.myChannels)
        }
      } catch (err) {
        this.$toast('保存失败，请稍后重试')
      }
      // 数据持久化处理
    },
    onChannelClick (channel, index) {
      if (this.isEdit) {
        if (this.fiexdChannels.includes(channel.id)) {
          // 编辑状态执行删除频道
          return
        }
        if (this.active <= index) {
          // 让激活频道索引-1
          this.$emit('update-active', this.active - 1, true)
        }
        this.deleteChannel(channel, index)
      } else {
        // 非编辑状态执行切换频道
        this.$emit('updata-active', index, false)
      }
    },
    async deleteChannel (channel, index) {
      try {
        if (this.user) {
          // 已登录， 则将数据更新到线上
          await deleteUserChannel(channel.id)
          this.myChannels.splice(index, 1)
        } else {
          // 未登录, 将数据更新到本地
          this.myChannels.splice(index, 1)
          setItem('TOKEN_CHANNELS', this.myChannels)
        }
      } catch (err) {
        this.$toast('操作失败，请稍后重试')
      }
    }
  }
}
</script>
<style lang='less' scoped>
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333333;
  }
  .edit-btn {
    width: 105px;
    height: 48px;
    border: 1px solid #f86060;
  }
  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      // 使文字不折行
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
    }
  }
  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        top: -10px;
        right: -10px;
        color: #cacaca;
        font-size: 30px;
        z-index: 2;
      }
    }
  }
  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 24px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
