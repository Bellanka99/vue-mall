import { request } from "./request"

//对请求首页的数据接口进行封装
//面向home.js开发
export function getHomeMultidata() {
    return request({
        url: '/home/multidata'
    })
}