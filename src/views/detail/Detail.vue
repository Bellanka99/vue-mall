<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav" />
    <scroll class="content" ref="scroll" :probe-type="3" @listenScroll="contentScroll">
      <!-- 属性：topImages  传入值：top-images-->
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info ref="params" :param-info="paramsInfo"></detail-param-info>
      <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
      <goods-list ref="recommend" :goods-list="recommends" />
    </scroll>
    <detail-bottom-bar @addCar="addToCar"></detail-bottom-bar>
    <back-top @click.native="backClick" v-show="isShowBackTop" />
    <!-- <toast :message="message" :show="show"/> -->
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";

import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/content/goods/GoodsList";
// import Toast from "components/common/toast/Toast"

import { mapActions } from "vuex";

import {
  getDetail,
  Goods,
  Shop,
  GoodsParam,
  getRecommend
} from "network/detail";

import { debounce } from "common/utils";
import { itemImgListenerMixin, backTopMixin } from "common/mixin";

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
    // Toast
  },
  mixins: [itemImgListenerMixin, backTopMixin], //混入
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramsInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0, 
      // message:'',
      // show:false,

    };
  },
  created() {
    //1.保存路径传进来的参数
    this.iid = this.$route.params.iid;

    //2.根据iid请求数据详情
    getDetail(this.iid).then(res => {
      // console.log(res);
      const data = res.result;
      //1.获取顶部轮播图
      this.topImages = data.itemInfo.topImages;

      //2.获取商品信息
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );

      //3.获取店铺信息对象
      this.shop = new Shop(data.shopInfo);

      //4.商品详情数据
      this.detailInfo = data.detailInfo;

      //5.获取商品参数信息
      this.paramsInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );

      //6.获取商品评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }

      // //nextTick异步更新队列
      // this.$nextTick(() => {
      //   //根据最新的数据，对应的DOM渲染出来。
      //   //图片没有加载完，offsetTop值不对是因为没有将图片的值计算在内
      //   //offsetTop值不对，一般是因为图片的问题
      //   this.themeTopYs = [];
      //   this.themeTopYs.push(0);
      //   this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      //   console.log(this.themeTopYs);
      // });
    });

    //3.请求商品推荐数据
    getRecommend().then(res => {
      // console.log(res);
      this.recommends = res.data.list;
    });

    //4.给getThemeTopY赋值(对themeTopYs赋值进行防抖操作)
    this.getThemeTopY = debounce(() => {
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      this.themeTopYs.push(Number.MAX_VALUE);
      // console.log(this.themeTopYs);
    }, 100);
  },
  mounted() {},
  destroyed() {
    console.log("destroyed");
    this.$bus.$off("itemImageLoad", this.itemImgListener);
  },
  methods: {
    //使用 mapActions 辅助函数将组件的 methods 映射为 store.dispatch 调用
    ...mapActions(['addCart']),
    imageLoad() {
      //两种方式
      // this.$refs.scroll.refresh();
      this.refresh();
      this.getThemeTopY();
    },
    titleClick(index) {
      // console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200);
    },
    contentScroll(position) {
      //监听事件
      //1.获取y的值
      const positionY = -position.y;

      //2.positionY和themeTopYs中的值进行对比
      // [0,7938,9120,9450]
      //positionY在0和7938之间，index = 0
      //positionY在7938和9120之间，index = 1
      //positionY在9120和9450之间，index = 2
      //positionY超出9450，index=30
      let length = this.themeTopYs.length;
      for (let i = 0; i < length; i++) {
        if (
          this.currentIndex !== i &&
          positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]
        ) {
          this.currentIndex = i;
          this.$refs.currentIndex = this.currentIndex;
        }
        // if (this.currentIndex !== i && ((i<length-1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])
        // || (i === length - 1 && positionY >= this.themeTopYs[i]))) {
        //   this.currentIndex = i;
        //   this.$refs.nav.currentIndex = this.currentIndex
        //   console.log(this.currentIndex)
        // }
      }
      // 是否显示回到顶部
      this.listenShowBackTop(positionY);
    },
    addToCar() {
      //1.获取购物车需要展示的信息
      const product = {};
      product.images = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;

      //2.将商品添加到购物车里（1.Promise 2.mapActions）
      // this.$store.cartList.push(product)
      //  this.$store.commit('addCart', product)
      // this.$store.dispatch("addCart", product).then(res => {
      //   console.log(res);
      // });
      this.addCart(product).then(res => {
        //添加商品至购物车提示信息
        // this.show = true;
        // this.message = res;
        // setTimeout(() => {
        //   this.show = false;
        //   this.message = ''
        // },1000)
       
         this.$toast.show(res,2000)
        //  console.log(this.$toast)
      })

    }
  }
};
</script>

<style scoped>
#detail {
  height: 100vh;
  position: relative; 
 z-index: 1;
  background-color: #fff;
}
.detail-nav {
  /* position: relative;
  z-index: 9; */
  background-color: #fff;
}
.content {
  overflow: hidden;
  height: calc(100% - 93px);
  background-color: #fff;
}
</style>