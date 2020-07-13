<template>
  <div class="back-top">
      <img src="~assets/img/common/top.png" alt="" srcset="">
  </div>
</template>

<script>
export default {
    name:'BackTop',
    // methods:{
    //     backClick(){
    //         this.$emit('backClick')
    //     }
    // }
}
</script>

<style>
    .back-top{
        position: fixed;
        right: 5px;
        bottom:52px;
    } 

     .back-top img {
        width:43px;
        height: 43px;
     }
</style>