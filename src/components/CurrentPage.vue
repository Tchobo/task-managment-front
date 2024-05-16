<template>
    <div class="p-0 m-0" >
        <h4 class="font-mono font-bold leading-[28px] text-[24px] text-center  "
        :class="[
active ? 'text-task-blue':' text-black' ,

]"
        >
   {{pageTitle}}
        </h4>
    </div>
</template>

<script setup>
const emit =defineEmits(['button-clicked'])
const props = defineProps({
    pageTitle: {
    type: String,
    required: true,
    default:""
  },
  active: {
    type: Boolean,
    required: true,
    default:false
  },

})

  

</script>

<style scoped>

</style>