<template>
  <div class="flex min-h-screen w-full justify-between gap-[70px] bg-task-home-bg">
    <Navigation :activenumber="1"/>
    <div class="main w-full">
      <Header @search="handleSearch" />
      <div class="w-100 px-8 pb-8 flex justify-start flex-col items-start">
        <CurrentPage :pageTitle="currentPageTitle" :active="verifyIfPageisActive" />
        <CreateDashBtn @button-clicked="onCreateDash" btnText="Add new one" class="mt-3" />

        <div v-if="isLoadingDashboards" class="mt-8">
          <p class="text-gray-500">Chargement des dashboards...</p>
        </div>

        <div v-else-if="!hasDashboards" class="mt-8">
          <p class="text-gray-500">Aucun dashboard trouvé. Créez-en un nouveau !</p>
        </div>

        <DashBoardList 
          v-else
          :items="filteredDashboards" 
          @update-clicked="showClick" 
          @detail-clicked="goToDetail" 
        />
      </div>
    </div>
  </div>

  <modal :show="modelValue" max-width="lg" class="my-auto">
    <div class="p-6">
      <div class="flex justify-between items-center">
        <h3 class="font-mono font-medium leading-7 text-[19px] text-task-black">
          {{ dashObject.id != null ? 'Update Dashboard' : 'Add new Dashboard' }}
        </h3>
        <component :is="CloseCircle" :size="18" class="text-task-blue cursor-pointer" @click="closeModal" />
      </div>
      <div class="mt-2 bg-task-bg-blue w-full h-[6px] rounded-lg"></div>
      
      <div class="form-group mt-4">
        <label for="name" class="font-mono text-left text-task-black-label font-medium leading-6 text-[14px]">
          Name
        </label>
        <input
          class="w-full h-11 border rounded-[6px] focus:outline-task-blue border-x-task-gray font-mono mt-2 pl-3 font-medium leading-6 text-[14px] placeholder-task-input-placeholder"
          name="description" 
          id="name" 
          placeholder="dashboard name" 
          v-model="dashObject.bordName" 
        />
      </div>

      <div class="form-group mt-7">
        <label for="description" class="font-mono text-left text-task-black-label font-medium leading-6 text-[14px]">
          Description Simple
        </label>
        <textarea 
          v-model.trim="dashObject.bordDescription"
          class="w-full border rounded-[6px] focus:outline-task-blue border-x-task-gray font-mono mt-3 pl-3 font-medium leading-6 text-[14px] placeholder-task-input-placeholder"
          name="description" 
          id="description" 
          cols="30" 
          rows="5" 
          placeholder="My dashboard description here !"
        ></textarea>
      </div>
      
      <v-row class="flex justify-center mt-4 mb-3">
        <v-btn :loading="isLoading" class="text-center w-[130px] btnColor rounded-md" @click="newDash">
          <span class="font-mono font-medium leading-6 text-[14px] spnLogin" v-if="!isLoading">
            {{ dashObject.id != null ? 'Update' : 'Add' }}
          </span>
          <v-progress-circular class="font-mono" v-else indeterminate size="8" aria-colcount="white">
          </v-progress-circular>
        </v-btn>
      </v-row>
    </div>
  </modal>
</template>

<script setup>
import { ref, onMounted, reactive, computed, watch } from "vue";
import { useRoute, useRouter } from 'vue-router'
import Navigation from "../components/Navigation.vue";
import Header from "../components/Header.vue";
import { VRow, VBtn, VProgressCircular } from "vuetify/lib/components/index.mjs";
import CreateDashBtn from "../components/btn/CreateDashBtn.vue";
import CurrentPage from "../components/CurrentPage.vue";
import CloseCircle from "vue-material-design-icons/CloseCircleOutline.vue";
import Modal from "../components/Modal.vue";
import DashBoardList from "../components/DashBoardList.vue";
import store from "../store";

const route = useRoute();
const router = useRouter();
const modelValue = ref(false);
const searchItem = ref("");
const isLoading = ref(false);
const isLoadingDashboards = ref(true);
const verifyIfPageisActive = ref(false);

const dashObject = reactive({ 
  id: null, 
  bordName: '', 
  bordDescription: '' 
});

// Computed pour vérifier si des dashboards existent
const hasDashboards = computed(() => {
  const dashList = store.state.dashboardList;
  return dashList && dashList.length > 0;
});

const dashboardList = computed(() => store.state.dashboardList || []);

const currentPageTitle = computed(() => {
  if (route.name === "Dashboard") {
    verifyIfPageisActive.value = true;
  }
  return route.name;
});

onMounted(async () => {
  try {
    await store.dispatch('getDashboardList');
  } catch (error) {
    console.error('Erreur lors du chargement des dashboards:', error);
  } finally {
    isLoadingDashboards.value = false;
  }
});

const closeModal = () => {
  modelValue.value = false;
  // Réinitialiser le formulaire
  dashObject.id = null;
  dashObject.bordName = '';
  dashObject.bordDescription = '';
};

const handleSearch = (search) => {
  searchItem.value = search;
  dashList.FileSystemEntry()
};

const filteredDashboards = computed(() => {
  return dashboardList.value.filter(item =>
    item.bordName.toLowerCase().includes(searchItem.value.toLowerCase())
  );
});

const onCreateDash = () => {
  // Réinitialiser avant d'ouvrir
  dashObject.id = null;
  dashObject.bordName = '';
  dashObject.bordDescription = '';
  modelValue.value = true;
};

const showClick = async (dashboardData) => {
  if (dashboardData) {
    dashObject.id = dashboardData.id;
    dashObject.bordName = dashboardData.bordName;
    dashObject.bordDescription = dashboardData.bordDescription;
    modelValue.value = true;
  }
};

const goToDetail = async (dashboardData) => {
  if (dashboardData) {
    
    // Vérifier que l'ID existe
    if (!dashboardData.id) {
      console.error('ID manquant pour le dashboard:', dashboardData);
      return;
    }
    
    // Stocker le dashboard actuel dans le store si nécessaire
    await store.commit('setCurrentDashboard', dashboardData);
    
    // Naviguer vers la page de détail avec l'ID
    router.push({ 
      name: 'Task Active', 
      params: { slug: dashboardData.slug } 
    });
  }
};

const newDash = async () => {
  // Validation
  if (!dashObject.bordName.trim()) {
    alert('Le nom du dashboard est requis');
    return;
  }

  try {
    isLoading.value = true;
    let dashStatus = false;
    let ObjectToSent = { ...dashObject };

    if (dashObject.id == null) {
      dashStatus = await store.dispatch('addDashboard', ObjectToSent);
    } else {
      dashStatus = await store.dispatch('updateDashboard', ObjectToSent);
    }

    if (dashStatus) {
      modelValue.value = false;
      // Réinitialiser le formulaire
      dashObject.id = null;
      dashObject.bordName = '';
      dashObject.bordDescription = '';
    } else {
      alert('Erreur lors de l\'enregistrement du dashboard');
    }
  } catch (error) {
    console.error('Erreur d\'enregistrement:', error);
    alert('Une erreur est survenue');
  } finally {
    isLoading.value = false;
  }
};

watch(() => store.state.dashboardList, (val) => {
});
</script>

<style scoped>
.listIconBg.my-active-item {
  background-color: rgba(0, 122, 255, 1);
  color: white;
  border-radius: 100%;
}

.listIconBg {
  background-color: rgba(0, 122, 255, 0.1);
  border-radius: 100%;
  color: rgba(41, 45, 50, 1);
  width: 40px;
  height: 40px;
}

.custom-drawer {
  border-right: 2px solid #ccc;
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