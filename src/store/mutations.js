import {
    ADD_COUNTER,
    ADD_TO_CART
} from './mutation-types'

export default {
    //mutations唯一的目的是修改state中状态
    //mutations中每个方法尽可能完成的事件比较单一一点
    [ADD_COUNTER](state, payload) {
        payload.count++
    },
    [ADD_TO_CART](state, payload) {
        payload.checked = false //默认不选中
        state.cartList.push(payload)
    }
}