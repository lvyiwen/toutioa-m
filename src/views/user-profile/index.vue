<template>
  <div class='user-profile'>
    <!-- 导航栏 -->
    <van-nav-bar title="个人信息" left-arrow @click-left="$router.back()"
      class="page-nav-bar" />

    <input type="file" hidden ref="file" @change="onFileChange" />
    <!-- 个人信息 -->
    <van-cell title="头像" is-link>
      <van-image class="avatar" fit="cover" round :src="user.photo"
        @click="$refs.file.click()" />
    </van-cell>
    <van-cell title="昵称" :value="user.name" is-link
      @click="isUpdataNameShow = true" />
    <van-cell title="性别" :value="user.gender === 0 ? '男' : '女'" is-link
      @click="isUpdataGenderShow = true" />
    <van-cell title="生日" :value="user.birthday" is-link
      @click="isUpdataBirthdayShow = true" />

    <!-- 编辑昵称的弹出层 -->
    <van-popup v-model="isUpdataNameShow" style="height: 100%;"
      position="bottom">
      <update-name v-if="isUpdataNameShow" @close='isUpdataNameShow = false'
        v-model="user.name" />
    </van-popup>

    <!-- 编辑性别 -->
    <van-popup v-model="isUpdataGenderShow" position="bottom">
      <update-gender v-if="isUpdataGenderShow" v-model="user.gender"
        @close='isUpdataGenderShow = false' />
    </van-popup>
    <!-- 编辑生日 -->
    <van-popup v-model="isUpdataBirthdayShow" position="bottom">
      <update-birthday v-model="user.birthday" v-if="isUpdataBirthdayShow"
        @close="isUpdataBirthdayShow = false" />
    </van-popup>

    <!-- 编辑头像 -->
    <van-popup v-model="isUpdataPhotoShow" position="bottom"
      style="height: 100%;">
      <update-photo v-if="isUpdataPhotoShow" :img="img"
        @close="isUpdataPhotoShow = false" @update-photo="user.photo=$event" />
    </van-popup>
  </div>
</template>
<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdateBirthday from './components/update-birthday'
import UpdatePhoto from './components/update-photo'

export default {
  name: 'UserProfile',
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto

  },
  props: {},
  data () {
    return {
      user: {}, // 个人信息
      isUpdataNameShow: false, // 控制编辑昵称的弹出层显示隐藏
      isUpdataGenderShow: false,
      isUpdataBirthdayShow: false,
      isUpdataPhotoShow: false,
      img: null // 预览的图片
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUserProfile()
  },
  mounted () { },
  methods: {
    async loadUserProfile () {
      try {
        const res = await getUserProfile()
        // 将获取到的数据保存到data 中
        this.user = res.data
        console.log(this.user)
      } catch (err) {
        this.$toast('获取数据失败')
      }
    },
    onFileChange () {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 基于文章对象获取blob数据
      this.img = window.URL.createObjectURL(file)
      // 展示预览图片弹出层
      this.isUpdataPhotoShow = true
      // file-input 如果选了同一个文件不会触发change事件
      // 解决办法 就是每次使用完毕，把它的value清空
      this.$refs.file.value = ''
    }
  }
}
</script>
<style lang='less' scoped>
.avatar {
  width: 60px;
  height: 60px;
}

.van-popup {
  background-color: #f5f7f9;
}
</style>
