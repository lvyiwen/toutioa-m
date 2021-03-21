<template>
  <div class='comment-reply'>
    <van-nav-bar
      :title="comment.reply_count > 0 ? `${comment.reply_count}条数据` : '暂无数据'">
      <van-icon slot="left" name="cross" @click="$emit('close')"></van-icon>
    </van-nav-bar>

    <div class="scorll-warp">
      <!-- 当前评论项 -->
      <comment-item :comment='comment' />

      <!-- 评论的回复列表 -->
      <van-cell title="全部回复" />
      <comment-list :source="comment.com_id" type="c" :list="commentList" />
    </div>

    <!-- 发布评论 -->
    <div class="post-warp">
      <van-button class="post-btn" size="small" round
        @click="isPostShow = true">写评论</van-button>
    </div>

    <!-- 发布评论 -->

    <van-popup v-model="isPostShow" position="bottom">
      <comment-post :target="comment.com_id" @post-success="onPostSuccess" />
    </van-popup>
  </div>
</template>
<script>
import CommentItem from './comment-item'
import CommentList from './comment-list'
import CommentPost from './comment-post'
export default {
  name: 'CommentReply',
  components: {
    CommentItem,
    CommentList,
    CommentPost
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isPostShow: false,
      // 评论的回复liebiao
      commentList: []
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    onPostSuccess (data) {
      // 更新回复的数量
      this.comment.reply_count++
      // 关闭弹层
      this.isPostShow = false
      // 将最新回复的内容展示到列表的顶部
      this.commentList.unshift(data.new_obj)
    }
  }
}
</script>
<style lang='less' scoped>
.scorll-warp {
  position: fixed;
  top: 92px;
  left: 0;
  right: 0;
  bottom: 88px;
  overflow-y: auto;
}
.post-warp {
  position: fixed;
  height: 88px;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-top: 1px solid #d8d8d8;
  .post-btn {
    width: 60%;
  }
}
</style>
