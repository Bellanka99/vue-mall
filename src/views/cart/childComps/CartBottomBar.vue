<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button class="check-button" :is-checked="isSelectAll" @click.native="checkClick"  />
      <span>全选</span>
    </div>

    <div class="price">
        合计：{{taotalPrice}}
    </div>

    <div class="calculate" @click="calcClick">
        去计算：{{checkLength}}
    </div>
  </div>
</template>

<script>
import CheckButton from "components/content/checkButton/CheckButton";

import {mapGetters} from "vuex";
export default {
  name: "CartBottomBar",
  components: {
    CheckButton
  },
  computed: {
      ...mapGetters(['cartList']),
      taotalPrice(){
          return '¥ ' + this.cartList.filter(item => {
              return item.checked
          }).reduce((preValue,item)=>{
              return preValue + item.price * item.count
          },0).toFixed(2)
      },
      checkLength(){
          return this.cartList.filter(item => item.checked).length
      },
      isSelectAll(){
        if(this.cartList.length === 0) return false;
        //1.使用filter
        //   return !(this.cartList.filter(item => !item.checked).length)
        //2.使用find函数
        // return !this.cartList.find(item => !item.checked)
        //3.使用普通遍历
        for (let  item of this.cartList) {
          if(!item.checked){
              return false
          }
        }
        return true
      }
  },
  methods: {
      checkClick(){
         if(this.isSelectAll){//全部选中
            this.cartList.forEach(item => item.checked = false)
         }else{//部分或全部不选中
            this.cartList.forEach(item => item.checked = true)
         }
      },
      calcClick(){
          if(!this.isSelectAll){
              this.$toast.show('请选择购买的商品',2000);
          }
      }
  }
};
</script>

<style scoped>
.bottom-bar {
  display: flex;
  position: relative;
  height: 40px;
  line-height: 40px;
  background-color: #eee;
  font-size:14px;
}
.check-content {
  display: flex;
  align-items: center;
  width: 60px;
}

.check-content span {
    margin-left: 3px;
}

.check-button {
  width: 20px;
  height: 20px;
  line-height: 20px;
}
.price{
    margin-left: 20px;
    flex:1;
}

.calculate{
    width:100px;
    background-color: var(--color-tint);
    color:#fff;
    text-align: center;
}
</style>