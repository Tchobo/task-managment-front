
<template>
<div class="bg-task-gray h-screen">

  <router-view></router-view>

</div>



</template>

<script setup>

</script>
<style scoped>

*{
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  text-align: center;
  display: flex;
  justify-content: center;
  text-transform: none;
}

.page-enter-active,
 .page-leave-active
 {
  transition:600ms ease all;
}

.page-enter-from, 
.page-leave-to{
  opacity:0;
}





</style>
