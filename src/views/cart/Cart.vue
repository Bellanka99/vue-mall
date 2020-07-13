<template>
  <div class="cart">
    <!-- 导航 -->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{length}})</div>
    </nav-bar>

    <!-- 商品列表 -->
    <cart-list />
    <!-- 底部汇总 -->
    <cart-bottom-bar />
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";

import CartList from "./childComps/CartList";
import CartBottomBar from "./childComps/CartBottomBar";

import { mapMutations, mapGetters } from "vuex";

export default {
  name: "Cart",
  components: {
    NavBar,
    CartList,
    CartBottomBar
  },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    //两种写法：1数组形式
    // ...mapGetters(['cartLength', 'cartList'])
    //2.对象形式
    // 把 `this.length` 映射为 `this.$store.getters.length`
    ...mapGetters({
      length: "cartLength",
      list: "cartList"
    })
    // cartLength(){
    //   // return this.$store.state.cartList.length
    //    return this.$store.getters.cartLength
    // }
  }
};
</script>
<style scoped>
.cart{
  height: 100vh;
}
.nav-bar {
  background-color: var(--color-tint);
  color: #fff;
}
</style>