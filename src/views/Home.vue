<template>
  <div class="flex h-screen w-full justify-between gap-[70px] bg-task-home-bg ">
    <Navigation :activenumber="1"/>
    <div class="main w-full ">
      <Header @search="handleSearch" />
      <div class="w-100 px-8    flex justify-start flex-col items-start ">
        <CurrentPage :pageTitle="currentPageTitle" :active="verifyIfPageisActive" />
        <CreateDashBtn @button-clicked="onCreateDash" btnText="Add new one" class="mt-3" />
        <DashBoardList :items="dashboardList" @update-clicked="showClick" @detail-clicked="goToDetail" />




      </div>
    </div>

  </div>

  <modal :show="modelValue"  max-width="lg" class="my-auto">
    <div class="p-6">
      <div class="flex justify-between items-center">
        <h3 class="font-mono font-medium leading-7 text-[19px] text-task-black">{{ dashObject.id !=null?'Update Dashboard':'Add new Dashboard' }}</h3>
        <component :is="CloseCircle" :size=18 class="text-task-blue cursor-pointer" @click="closeModal" />
      </div>
      <div class=" mt-2 bg-task-bg-blue w-full h-[6px] rounded-lg">

      </div>
      <div class="form-group mt-4">
        <label for="name"
          class="font-mono text-left text-task-black-label font-medium leading-6 text-[14px]">Name</label>
        <input
          class="w-full  h-11 border rounded-[6px] focus:outline-task-blue border-x-task-gray font-mono mt-2 pl-3 font-medium leading-6 text-[14px] placeholder-task-input-placeholder"
          name="description" id="name" placeholder="dashboard name" v-model="dashObject.bordName" />

      </div>

      <div class="form-group mt-7">
        <label for="name"
          class="font-mono text-left text-task-black-label font-medium leading-6 text-[14px]">Description Simple</label>
        <textarea v-model.trim="dashObject.bordDescription"
          class="w-full   border rounded-[6px]  focus:outline-task-blue border-x-task-gray font-mono mt-3 pl-3 font-medium leading-6 text-[14px] placeholder-task-input-placeholder"
          name="description" id="name" cols="30" rows="5" placeholder="My dashboard description here !"></textarea>

      </div>
      <v-row class="flex justify-center mt-4 mb-3">
        <v-btn :loading="isLoading" class="text-center w-[130px]  btnColor rounded-md" @click="newDash">
          <span class=" font-mono font-medium leading-6 text-[14px] spnLogin" v-if="!isLoading">{{ dashObject.id != null ?
        'Update' : 'Add'}}</span>
          <v-progress-circular class="font-mono" v-else indeterminate size="8" aria-colcount="white">

          </v-progress-circular>

        </v-btn>

      </v-row>
    </div>
  </modal>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { useRoute, useRouter } from 'vue-router'
import Navigation from "../components/Navigation.vue";
import Header from "../components/Header.vue";

import { VRow } from "vuetify/lib/components/index.mjs";
import { VBtn } from "vuetify/lib/components/index.mjs";
import { VProgressCircular } from "vuetify/lib/components/index.mjs";
import { VCol } from "vuetify/lib/components/index.mjs";
import { VContainer } from "vuetify/lib/components/index.mjs";
import { VMenu } from "vuetify/lib/components/index.mjs";
import { VSelect } from "vuetify/lib/components/index.mjs";
import { VList } from "vuetify/lib/components/index.mjs";
import CreateDashBtn from "../components/btn/CreateDashBtn.vue";
import CurrentPage from "../components/CurrentPage.vue";
import MoreIcon from "vue-material-design-icons/DotsVertical.vue";
import CloseCircle from "vue-material-design-icons/CloseCircleOutline.vue";

// DropDown Menu

import Modal from "../components/Modal.vue";
import DashBoardList from "../components/DashBoardList.vue";
import store from "../store";
import { computed } from "@vue/reactivity"




/**  Variable */

const route = useRoute();
const router = useRouter();
const drawer = ref(true)
const rail = ref(true)
const drawerWidth = '500px';
const hoveredContainer = ref(false)
const modelValue = ref(false)
const searchItem = ref("")
const isLoading = ref(false)
const receivedDashboardId = ref(null);
const verifyIfPageisActive=ref(false)
// Model data
const dashObject = reactive({ id: null, bordName: '', bordDescription: '' });

const handleItemClick = (value) => {
  activeItem.value = value;
}

const closeModal = () => {
  modelValue.value = false;
}
const currentPageTitle = computed(() => {
  console.log("the root name", route.name);
  if(route.name =="Dashboard"){
    verifyIfPageisActive.value=true
  }
  return route.name
})
const handleSearch = (search) => {
  searchItem.value = search
  console.log("la valeur entrée est", searchItem.value)
}
// handle onCreateDash btn action
const onCreateDash = () => {
  console.log("Le button est clické", modelValue.value)

  modelValue.value = true

}


const showClick = async (dashboardData) => {
  const receivData = await dashboardData
  if (receivData) {
    dashObject.id = dashboardData.id
    dashObject.bordName = dashboardData.bordName
    dashObject.bordDescription = dashboardData.bordDescription
    modelValue.value = true
    console.log("Le button update est clické", dashObject.bordName)

  }


}

const goToDetail = async (dashboardData) =>{
  const dashData = await dashboardData
  if (dashData) {
    router.push({ name: 'Task Active', params: { slug :dashData.slug } });   
  }
}


const newDash = async () => {
  try {
    isLoading.value = true
    let dashStatus = false; 

    let ObjectToSent = { ...dashObject }; // Create a copy of dashObject
    console.log("this is the object", ObjectToSent);
    if (dashObject.id == null) {
      dashStatus = await store.dispatch('addDashboard', ObjectToSent);

    }
    else {
      dashStatus = await store.dispatch('updateDashboard', ObjectToSent);

    }
    console.log("Le status actuel ", dashStatus);
    if (dashStatus) {
    
      // Redirect to dashboard or any other route on successful login
      modelValue.value = false
      isLoading.value = false
      store.dispatch('getDashboardList')
      dashObject.id=null

    } else {
      console.log("Donnée non ajoutée"); // Handle unsuccessful login (show error message, etc.)
    }
  } catch (error) {
    console.error('Error d\'enregistrement dans :', error);
    // Handle error (show error message, retry login, etc.)
  }
};

onMounted(() => { store.dispatch('getDashboardList') })
const dashboardList = computed(() => store.state.dashboardList)

</script>

<style scoped>
.listIconBg.my-active-item {
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
  width: 65px !important;
  border-right: 2px solid rgba(248, 248, 248, 1);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.dash-box {
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.05);
}


.btnColor {
  background: rgba(0, 122, 255, 1);
  color: #ffffff;
}

textarea {
  resize: none;
}
</style>