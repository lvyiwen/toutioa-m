<template>
  <!-- 导航栏 -->
  <div class="login-container">
    <van-nav-bar class="page-nav-bar" title="登录">
      <template #left>
        <van-icon name="cross" @click="$router.back()" />
      </template>
    </van-nav-bar>

    <!-- 登录的表单 -->
    <!--
      表单验证：
      1、给van-field组件配置rules验证规则
      2、当表单提交的时候会自动触发表单验证
      如果验证通过，会触发submit事件
      如果验证失败，不会触发 submit
     -->
    <van-form @submit="onSubmit" ref="loginFormRef">
      <!-- number只能输入数字 maxlength输入的最大长度 -->
      <van-field v-model="user.mobile" name="mobile" placeholder="请输入手机号"
        :rules="userFormRules.mobile" type="number" maxlength='11'>
        <i slot="left-icon" class="iconfont iconshouji"></i>
      </van-field>
      <van-field v-model="user.code" name="code" placeholder="请输入验证码"
        :rules="userFormRules.code" type="number" maxlength='6'>
        <i slot="left-icon" class="iconfont iconyanzhengma"></i>
        <template #button>
          <!--
            time: 倒计时时间
           -->
          <van-count-down v-if="isCountDownShow" :time="1000 * 60" format='ss s'
            @finish='isCountDownShow = false' />
          <van-button v-else class="send-sms-btn" size="small" type="default"
            round native-type="button" @click="onSendSms">
            发送验证码
          </van-button>
        </template>
      </van-field>
      <div class="login-btn-warp">
        <van-button block type="info" native-type="submit" class="login-btn">
          登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      // 提交表单数据的对象
      user: {
        mobile: '', // 手机号13911111111
        code: '' // 验证码246810
      },
      // 表单的验证规则
      userFormRules: {
        // 手机号的验证规则
        mobile: [
          { required: true, message: '手机号不能为空' },
          { pattern: /1[3|5|7|8]\d{9}/, message: '手机号格式错误' }
        ],
        // 验证码的验证规则
        code: [
          { required: true, message: '请填写验证码' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      isCountDownShow: false // 是否展示倒计时
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    // 登录请求
    async onSubmit () {
      // 1、获取 表单数据
      const user = this.user
      // TODO 2、表单验证

      // 在组件中必须通过 this.$toast 来调用Toast组件
      this.$toast.loading({
        message: '登陆中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 持续时间 默认是2秒 如果为0 就持续展示
      })
      // 3、提交表单请求登录
      try {
        const res = await login(user)
        this.$store.commit('setUser', res.data)
        this.$toast.success('登陆成功')
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('登录失败，请稍后重试')
        }
      }
      // 4、根据请求响应结果来处理后续操作
    },
    // 验证码的发送
    async onSendSms () {
      // 1、校验手机号
      try {
        await this.$refs.loginFormRef.validate('mobile')
      } catch (err) {
        console.log('验证失败', err)
      }
      // 2、验证码通过显示倒计时
      this.isCountDownShow = true
      // 3、请求发送验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        if (err.response.status === 429) {
          // 关闭显示定时器
          this.isCountDownShow = false
          // 显示错误消息
          this.$toast('发送太频繁了，请稍后重试')
        } else {
          this.$toast('发送失败，请稍后重试')
        }
      }
    }
  }

}
</script>

<style scoped lang = 'less'>
.login-container {
  .iconfont {
    font-size: 37px;
  }
  .send-sms-btn {
    background-color: #ededed;
    width: 160px;
    height: 46px;
    line-height: 46px;
    font-size: 22px;
    color: #666;
  }
  .login-btn-warp {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
