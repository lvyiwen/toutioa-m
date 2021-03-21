import Vue from 'vue'
import dayjs from 'dayjs'
// 加载中文语言包
import 'dayjs/locale/zh-cn'

import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用处理相对时间的插件
dayjs.extend(relativeTime)
// dayjs  默认语言是英文， 我们需要配置成中文、
dayjs.locale('zh-cn') // 全局使用

// dayjs()获取当前最新时间

// 定义一个全局过滤器，然后就可以在任何组件的模板中使用了
// 参数1：过滤器名称
// 参数2：过空滤器函数

Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
})
