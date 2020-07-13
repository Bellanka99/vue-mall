import { request } from "./request"


/**
 * 请求轮播图、推荐相关的数据
 * @returns {*}
 */
//面向home.js开发
export function getHomeMultidata() {
    return request({
        url: '/home/multidata'
            // url: '/home/banner'
    })
}

/**
 * 请求首页商品相关数据
 * @param {*} type 
 * @param {*} page 
 */
export function getHomeGoods(type, page) {
    return request({
        url: '/home/data',
        params: {
            type,
            page
        }
    })
}