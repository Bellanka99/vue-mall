import { debounce } from "./utils";
import BackTop from "components/content/backTop/BackTop";

export const itemImgListenerMixin = {
    data() {
        return {
            itemImgListener: null,
            refresh: null
        }
    },
    mounted() {
        //1.图片加载完成的事件监听
        // const refresh = debounce(this.$refs.scroll.refresh, 50);
        this.refresh = debounce(this.$refs.scroll.refresh, 50);
        //2.对监听事件进行保存
        this.itemImgListener = () => {
            this.refresh();
        };
        this.$bus.$on("itemImageLoad", this.itemImgListener);
        // console.log("混入内容111")
    }
}

/**
 * 顶部导航
 */
export const backTopMixin = {
    components: {
        BackTop
    },
    data() {
        return {
            isShowBackTop: false,
        }
    },
    methods: {
        backClick() {
            //返回顶部
            this.$refs.scroll.scrollTo(0, 0, 300);
        },
        listenShowBackTop(position) {
            // 是否显示回到顶部
            this.isShowBackTop = position > 1000;
        }
    }

}