<template>
    <div class="w-100    p-8 pb-0 flex justify-center  ">
        <div class="flex  justify-between w-100">
            <div class="w-[450px] h-20 relative">
                <input
                    class=" mt-2 pl-10 font-mono font-medium leading-6 text-[14px] focus:outline-task-blue border border-x-task-gray h-[40px] w-full rounded-md"
                    placeholder="Search for task" @input="search" outlined />
                <component :is="Loop" :size=20
                    class="ml-0 cursor-pointer text-task-black text-center absolute top-[9px] left-0 font-mono font-medium leading-4 text-[14px] p-[10px]"
                    @click="changePasswordVisibility()" />
            </div>
            <div class="relative h-[70px] user-profile-section cursor-pointer">
                <div
                    class="absolute bottom-[4px] left-[-14px] w-[30px] h-[30px] rounded-full bg-white text-center p-[4px]">
                    <component :is="Notification" :size=18 class="text-task-bg-blue mt-2" />

                </div>
                <img class="w-[60px] h-[60px] rounded-full object-cover "
                    src="https://cdn.pixabay.com/photo/2022/08/22/11/38/woman-7403494_1280.jpg" alt="enfant">
              

                   
                    <div class=" absolute top-5 right-[-24px]  menu-icon hidden ">

<Menu as="div" class="relative inline-block text-left">
    <div>
        <MenuButton
            class="inline-flex w-full justify-center rounded-md  px-4 py-2 text-sm font-medium  focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
            <component :is="MoreIcon" :size=22 class="justify-end text-transparent " />
        </MenuButton>
    </div>

    <transition enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0">
        <MenuItems
            class="absolute right-0 mt-1 w-30 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">

            <div class="px-1 py-1">
                <MenuItem v-slot="{ active }">
                <button  :class="[
active ? 'bg-task-blue text-white' : 'text-gray-900',
'group flex w-full items-center rounded-md px-2 py-2 text-sm',
]">
                   <svg 
:class="[
active ? ' text-white' : 'text-task-blue',
'mr-2 h-5 w-5',
]"

 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>

                    Profile
                </button>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                <button @click="onLogoutOut" :class="[
active ? 'bg-task-blue text-white' : 'text-gray-900',
'group flex w-full items-center rounded-md px-2 py-2 text-sm',
]" >
                   
<svg
:class="[
active ? ' text-white' : 'text-task-blue',
'mr-2 h-5 w-5',
]"

 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
</svg>
                    Logout
                </button>
                </MenuItem>
            </div>

        </MenuItems>
    </transition>
</Menu>





</div>




           

            </div>


        

        </div>

    </div>

</template>

<script setup>
import Loop from "vue-material-design-icons/Magnify.vue";
import Notification from "vue-material-design-icons/BellOutline.vue";
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import MoreIcon from "vue-material-design-icons/DotsVertical.vue";
import { useRoute, useRouter } from 'vue-router'

const emit = defineEmits(['search'])
const search = (e) => {
    emit('search', e.target.value)

}
const router = useRouter();
const onLogoutOut = ()=>{
    localStorage.removeItem('userToken');

    router.push(
      { "name": "Login" }
    )
}

</script>

<style scoped>
.user-profile-section:hover .menu-icon {
    display: block;
}
</style>