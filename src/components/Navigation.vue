<template>
    <div>
        <v-card>
            <v-layout>
                <v-navigation-drawer :width="328" class=" w-10 m-auto" v-model="drawer" :rail="rail" permanent>
                    <v-list-item class=" mt-7"  nav>
                        <span class="font-mono font-bold leading-8 text-[20px] text-task-blue">Ttr.</span>
                    </v-list-item>



                    <v-list density="compact" nav class="ml-1">
                        <v-list-item class="hover:rounded-full listIconBg"  :value="1" @click="handleItemClick(1) "  :class="{ 'active-item': activenumber === 1 }"
                        >
                            <component :is="Dashboard" :size=22 />

                        </v-list-item>
                        <v-list-item class="mt-5 hover:rounded-full listIconBg" :value="2" @click="handleItemClick(2)"  :class="{ 'active-item': activenumber === 2 }
                           ">
                            <component :is="Notification" :size=22 />

                        </v-list-item>
                        <v-list-item class="mt-5 hover:rounded-full listIconBg" :value="3" @click="handleItemClick(3)"
                        :class="{ 'active-item': activenumber === 3 }">
                            <component :is="Cog" :size=22 />

                        </v-list-item>


                    </v-list>
                </v-navigation-drawer>

            </v-layout>
        </v-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { VCard } from 'vuetify/lib/components/index.mjs'
import { VNavigationDrawer } from 'vuetify/lib/components/index.mjs'
import { VList } from 'vuetify/lib/components/index.mjs'
import { VListItem } from 'vuetify/lib/components/index.mjs'
import { VLayout } from 'vuetify/lib/components/index.mjs'
import { VDivider } from 'vuetify/lib/components/index.mjs'
import { VMain } from 'vuetify/lib/components/index.mjs'
import Dashboard from "vue-material-design-icons/ViewDashboardOutline.vue";
import Notification from "vue-material-design-icons/BellOutline.vue";
import Cog from "vue-material-design-icons/CogOutline.vue";
import { useRouter } from 'vue-router'
/**  Variable */
const drawer = ref(true)
const rail = ref(true)

const props = defineProps({
    activenumber: {
    type: Number,
    required: true,
    default:1
  },
 

})


const drawerWidth = '500px';
const activeItem = ref(1);
const router = useRouter();
const handleItemClick = (value) => {
    // Update the active item when clicked

  // Perform actions based on the clicked item
  if (value === 1) {
    router.push('/taskmanager'); // Example: Navigate to the home page
  } else if (value === 2) {
    router.push('/taskmanager/notifications'); // Example: Navigate to the profile page
  }

  else if (value === 3) {
    router.push('/taskmanager/profile'); // Example: Navigate to the profile page
  }
};
</script>

<style scoped>
.listIconBg.active-item {
    background-color: rgba(0, 122, 255, 1);
    /* Set your desired active color */
    color: white;
    border-radius: 100%;
    /* Set text color for active item */
}

.listIconBg {
    background-color: rgba(0, 122, 255, 0.1);
    border-radius: 100%;
    /* Set text color for active item */
    color: rgba(41, 45, 50, 1);
    width: 40px;
    height: 40px;
    ;
    /* Set your desired active color */

}

.custom-drawer {
    border-right: 2px solid #ccc;
    /* Set border color and thickness */
}


.v-navigation-drawer {
    width: 66px !important;
    border-right: 2px solid rgba(248, 248, 248, 1);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>