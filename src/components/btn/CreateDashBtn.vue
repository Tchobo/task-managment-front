<template>
    <div>
        <button class="font-mono font-medium leading-6 text-[14px] text-center bg-task-blue border text-white p-1 w-[115px] rounded-sm"
         @click="handleClick">
   {{btnText}}
</button>
    </div>
</template>

<script setup>
const emit =defineEmits(['button-clicked'])
const props = defineProps({
  btnText: {
    type: String,
    required: true,
    default:"Clicked Me"
  },

})
const handleClick=()=>{
emit('button-clicked');

}
  

</script>

<style scoped>

</style>