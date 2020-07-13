<template>
  <!-- 所有的item都展示同一个图片，同一个文字 -->
  <div class="tab-bar-item" @click="ItemClick">
    <!-- 添加样式要把插槽放在div中 ，防止在调用slot加载时替换掉 -->
    <div v-if="!isActive">
      <slot name="item-icon"></slot>
    </div>
    <!-- 点击时变换图片 -->
    <div v-else>
      <slot name="item-icon-active"></slot>
    </div>
    <!-- <div :class="{active:isActive}"> -->
    <div :style="activeStyle">
      <slot name="item-text"></slot>
    </div>
    <!-- <img src="../../assets/img/tabbar/home.svg" alt="">
    <div>首页</div>-->
  </div>
</template>

<script>
export default {
  name: "TabBarItem",
  props: {
    path: {
      type:String,
      required: true
    },
    activeColor: {//“点击按钮”动态修改样式
      type: String,
      default: "red" //默认颜色
    }
  },
  data() {
    return {
      // isActive:true,
    };
  },
  computed: {
    //计算属性
    isActive() {
      // 当前活跃home->item(/home)-true
      // 当前活跃home->item(/category)-false
      //当点击图标时显示红色
      return this.$route.path.indexOf(this.path) !== -1;
    },
    activeStyle() {
        //是否活跃，修改状态
      return this.isActive ? { color: this.activeColor } : {};
    }
  },
  methods: {
    ItemClick() {
      //出现错误：vue-router.esm.js?fe87:2060 Uncaught (in promise) Error: Avoided redundant navigation to current location: "/profile".
   this.$router.replace(this.path);
     
    }
  }
};
</script>

<style scoped>
.tab-bar-item {
  flex: 1;
  text-align: center;
  height: 49px;
  font-size: 14px;
}
.tab-bar-item img {
  width: 24px;
  height: 24px;
  margin-top: 4px;
  vertical-align: middle;
  margin-bottom: 2px;
}
/* .active {
  color: red;
} */
</style>