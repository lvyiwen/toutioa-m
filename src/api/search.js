/**
 * 获取用户频道列表
 */
import request from '@/utils/request'
/**
 *
 * @param {*} q
 * 获取联想建议
 */
export const getSearchSuggestion = (q) => {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params: {
      q
    }
  })
}

/**
 *
 * @param {*} q
 * 获去取搜索 结果
 */
export const getSearchResult = (params) => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search',
    params
  })
}
