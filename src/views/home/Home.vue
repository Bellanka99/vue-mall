<template>
  <div id="home">
    <nav-bar class="nav-bar">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control
      :titles="['流行','新款','精选']"
      @tabClick="tabClick"
      ref="tabControl1"
      class="tab-control"
      v-show="isTabFixed"
    ></tab-control>
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @listenScroll="contenScoll"
      :pull-up-load="true"
      @pullingUp="loadMore"
    >
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend :recommends="recommends"></recommend>
      <feature-view />
      <tab-control :titles="['流行','新款','精选']" @tabClick="tabClick" ref="tabControl2"></tab-control>
      <goods-list :goodsList="showGoods"></goods-list>
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
//页面子组件
import HomeSwiper from "./childComps/HomeSwiper";
import Recommend from "./childComps/Recommend";
import FeatureView from "./childComps/FeatureView";

//公共组件
import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";
import BackTop from "components/content/backTop/BackTop";

//方法（额外的数据）
import {
  getHomeMultidata,
  getGoodsTab,
  getHomeGoods
} from "../../network/home";
import { debounce } from "common/utils";
import {itemImgListenerMixin} from "common/mixin"

export default {
  name: "Home",
  components: {
    NavBar,
    HomeSwiper,
    Recommend,
    FeatureView,
    TabControl,
    GoodsList,
    Scroll,
    BackTop
  },
  mixins: [itemImgListenerMixin],//混入
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        //对象
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] }
      },
      currentType: "pop",
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0,
      // itemImgListener: null
    };
  },
  computed: {
    showGoods() {
      //数据字符串太长，利用计算属性
      return this.goods[this.currentType].list;
    }
  },
  created() {
    //该方法只写主要逻辑
    //1.请求多个数据
    this.getHomeMultidata();

    //2.请求数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },
  destroyed() {
    console.log("destroyed");
  },
  activated() {
    //通过scrollTo函数，设置离开时位置
    this.$refs.scroll.scrollTo(0, this.saveY, 0);
    this.$refs.scroll.refresh(); //刷新
  },
  deactivated() {
    //1.保存离开home时Y的位置
    this.saveY = this.$refs.scroll.getScrollY();
    //2.取消全局事件的监听
    this.$bus.$off('itemImageLoad',this.itemImgListener)
  },
  mounted() {
    // //1.图片加载完成的事件监听
    // const refresh = debounce(this.$refs.scroll.refresh, 50);

    // //2.对监听事件进行保存
    // this.itemImgListener = () => {
    //   // this.$refs.scroll.scroll.refresh();
    //   //this.$refs.scroll.refresh();
    //   refresh();
    // };
    // this.$bus.$on("itemImageLoad", this.itemImgListener);
  },
  methods: {
    /**
     * 事件监听方法
     */
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      //两个tabControl的currentIndex保持一致
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },

    backClick() {
      //ref获取组件的一个对象
      // this.$refs.scroll.scroll.scrollTo(0,0,500);
      this.$refs.scroll.scrollTo(0, 0);
    },
    contenScoll(position) {
      //1.回到顶部图标的隐藏与显示
      this.isShowBackTop = -position.y > 1000;

      // 2.判断tabControl是否吸顶（position：fixed）
      this.isTabFixed = -position.y > this.tabOffsetTop;
    },
    loadMore() {
      //上拉加载更多
      this.getHomeGoods(this.currentType);
    },
    //获取tabControl的offsetTop
    //所有的组件都有一个属性$el:用于获取组件中的元素
    swiperImageLoad() {
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
    },

    /**
     * 网络请求相关方法
     */

    //1.请求多个数据(方法名可以一样，但最好不)
    getHomeMultidata() {
      //进行具体的相关请求
      getHomeMultidata().then(res => {
        //  console.log(res)
        //this.result = res;
        this.banners = res.data.banner.list; //保存请求到的数据
        // console.log(this.banners);
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then(res => {
        //  console.log(res.data.list)
        //  const arr1 = [12,13,12,13]
        //  let totalNums = [];
        //  for(let n of arr1){
        //    totalNums.push(n)
        //  }
        // 相当于以上
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;

        //完成上来加载更多调用
        this.$refs.scroll.finishPullUp();
      });
    }
  }
};
</script>

<style scoped>
#home {
  /* padding-top:44px; */
  height: 100vh;
  /* position: relative; */
}
.nav-bar {
  background-color: var(--color-tint);
  font-weight: 700;
  color: #fff;

  /**在使用原生六拉尼滚动时，为了不让导航不跟随一起滚动 */
  /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; */
}

.tab-control {
  position: relative;
  z-index: 9;
}

.content {
  /**计算高度使用定位或者计算calc */
  /* height: calc(100% - 93px);
  overflow: hidden;
  margin-top:44px; */
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
</style>