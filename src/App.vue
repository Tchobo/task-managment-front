
<template>
<div class="bg-task-gray min-h-screen">

  <router-view></router-view>

</div>



</template>

<script setup>

</script>
<style scoped>

* {
  box-sizing: border-box;
}

.page-enter-active,
.page-leave-active {
  transition: 600ms ease all;
}

.page-enter-from, 
.page-leave-to {
  opacity: 0;
}


</style>