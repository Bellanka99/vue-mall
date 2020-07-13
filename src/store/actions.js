import {
    ADD_COUNTER,
    ADD_TO_CART
} from './mutation-types'


export default {
    addCart(context, payload) {
        //通过Promise返回操作的结果
        return new Promise((resolve, reject) => {
            //payload添加新的商品
            // let oldProduct = null;
            // for (let item of state.cartList) {
            //     if (item.iid === payload.iid) {
            //         oldProduct = item;
            //     }
            // }
            //1.查找之前数组中是否有该商品
            let oldProduct = context.state.cartList.find(item => item.iid === payload.iid);
            //2.判断oldProduct
            if (oldProduct) { //商品数量加1
                // oldProduct.count += 1
                // context.commit('add_counter', oldProduct)
                context.commit(ADD_COUNTER, oldProduct)
                resolve('当前的商品数量加1')
            } else { //添加新的商品
                payload.count = 1
                    // state.cartList.push(payload)
                    // context.state.cartList.push(payload)
                context.commit(ADD_TO_CART, payload)
                resolve('添加新的商品')
            }
        })
    }
}