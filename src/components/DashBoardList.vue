<template>
    <div class="pt-3 grid grid-cols-3 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 select-none w-100" >

<div
v-for="dashboard in items" :key="dashboard.id"
  class="flex w-full cursor-pointer select-none h-[130px] p-3 pt-4 pb-3  items-start  flex-col bg-white rounded-[8px] shadow-sm hover:shadow-md dashBoard-container"
>

  <div class="relative flex flex-row  justify-between w-full">
    <div class="flex  gap-2">
      <img src="../assets/images/dash_default.jpg" alt="dahboard image"
        class="w-[60px] h-[60px] sm:w-[30px] sm:h-[30px] md:h-[50px]  md:w-[50px] rounded-[4px] object-cover">
      <h3 class="sm:text-[16px] text-nowrap md:text-[16px] lg:text-[19px] self-center font-mono font-medium leading-7 text-[19px] text-black">{{dashboard.bordName
}}</h3>

    </div>
    <div class=" absolute top-1 right-[-10px]  menu-icon hidden ">

      <Menu as="div" class="relative inline-block text-left">
        <div>
          <MenuButton
            class="inline-flex w-full justify-center rounded-md  px-4 py-2 text-sm font-medium  focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
            <component  :is="MoreIcon" :size=22 class="justify-end "  />
          </MenuButton>
        </div>

        <transition enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
          <MenuItems
            class="absolute right-0 mt-1 w-30 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">

            <div class="px-1 py-1">
              <MenuItem v-slot="{ active }">
              <button
              @click="gotoDetail(dashboard)"
              
              :class="[
active ? 'bg-task-blue text-white' : 'text-gray-900',
'group flex w-full items-center rounded-md px-2 py-2 text-sm',
]">
                <svg :class="[
active ? ' text-white' : 'text-task-blue',
'mr-2 h-5 w-5',
]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                </svg>
                Détail
              </button>
              </MenuItem>
              <MenuItem v-slot="{ active }">
              <button :class="[
active ? 'bg-task-blue text-white' : 'text-gray-900',
'group flex w-full items-center rounded-md px-2 py-2 text-sm',
]"   @click="handleClick(dashboard)" >
                <svg :class="[
active ? ' text-white' : 'text-task-blue',
'mr-2 h-5 w-5',
]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" 
                    />
                </svg>
                Modifier
              </button>
              </MenuItem>
            </div>

          </MenuItems>
        </transition>
      </Menu>





    </div>


  </div>
  <p class=" mt-3 mr-8 font-mono text-justify font-normal leading-4 text-[12px] text-task-black">
    {{ dashboard.bordDescription }}
  </p>
</div>




</div>

</template>

<script setup>
import { ref, computed } from "vue";

import { useRoute } from 'vue-router'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import MoreIcon from "vue-material-design-icons/DotsVertical.vue";
import { VCol } from "vuetify/lib/components/index.mjs";
import { VContainer } from "vuetify/lib/components/index.mjs";
import { VMenu } from "vuetify/lib/components/index.mjs";
import { VSelect } from "vuetify/lib/components/index.mjs";
import { VList } from "vuetify/lib/components/index.mjs";



const route = useRoute();
const activeItem = ref(null)
const hoveredContainer = ref(false)
// Props
const props = defineProps({
  items: {
    type: Array,
    required: true
  },

})
const handleItemClick = (value) => {
  activeItem.value = value;
}

const emits =defineEmits(['update-clicked', 'detail-clicked'])


const handleClick=(dashboardData)=>{
emits('update-clicked', dashboardData);

}

const gotoDetail=(dashboardData)=>{
  emits('detail-clicked', dashboardData);
}

</script>

<style  scoped>
.dash-box {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.more-vert-icon {
  display: none;
}

.dashBoard-container:hover .menu-icon {
  display: block;
}
</style>