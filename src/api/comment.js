/**
 * 评论请求模块
 */
import request from '@/utils/request'
/**
  * 获取文章评论列表
  */

export const getComment = (params) => {
  return request({
    method: 'GET',
    url: '/app/v1_0/comments',
    // 在发起get请求的时候发送过去参数是一个对象
    // 但是在发送的过程中axios会将传递的参数拼接到地址中
    // 但是多了个引号和双斜线
    params
  })
}

/**
  * 评论点赞
  */

export const addCommentLike = (target) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comment/likings',
    data: {
      target
    }
  })
}

/**
  * 取消评论点赞
  */

export const deleteCommentLike = (target) => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/comment/likings/${target}`

  })
}

/**
  *发布文章评论或评论回复
  */

export const addComment = (data) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comments',
    data
  })
}
