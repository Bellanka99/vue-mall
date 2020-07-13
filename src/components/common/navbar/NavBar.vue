<template>
  <div class="nav-bar">
     <div class="nav-left"><slot name="left"></slot></div>
     <div class="nav-center"><slot name="center"></slot></div>
     <div class="nav-right"><slot name="right"></slot></div>
      
  </div>
</template>

<script>
export default {
    name:'NavBar'
}
</script>

<style scoped>
    .nav-bar{
        position: relative;
        z-index: 10;
        display: flex;
        line-height: 44px;
        height: 44px;
        text-align: center;
        box-shadow: 0 1px rgb(200, 195, 195);
    }
    .nav-left, .nav-right{
        width: 60px;
    }
    .nav-center{
        flex: 1;
    }


</style>