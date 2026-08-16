<template>
  <div class="flex min-h-screen pb-8 w-full justify-between gap-[70px] bg-task-home-bg overflow-y-auto scrolbar">
    <!-- <DebugPanel /> --> <!-- Décommentez pour activer le debug -->
    <Navigation />
    <div class="main w-full  ">
      <Header @search="handleSearch" />
      <div class="w-100 flex justify-start flex-col items-start main-core px-8">
        <div class="flex">
          <span @click="goToLink"
            class="cursor-pointer font-mono font-bold leading-[28px] text-[24px] text-center text-black mr-2">Dashboard
            > </span>
          <CurrentPage
            v-if="dashboardDetail" 
            :pageTitle="dashboardDetail.bordName" 
            :active="true" 
          />
        </div>

        <!-- Loading state -->
        <div v-if="isLoadingDashboard" class="mt-8">
          <p class="text-gray-500">Chargement du dashboard...</p>
        </div>

        <!-- No dashboard found -->
        <div v-else-if="!dashboardDetail" class="mt-8">
          <p class="text-red-500">Dashboard introuvable. Veuillez vérifier l'URL.</p>
          <button @click="goToLink" class="mt-4 px-4 py-2 bg-task-blue text-white rounded">
            Retour aux dashboards
          </button>
        </div>

        <!-- Dashboard content -->
        <template v-else>
          <CreateDashBtn @button-clicked="onShowCategorieModal" btnText="Add columns" class="mt-3" />

          <!-- Display categories/columns with tasks -->
          <TaskCategory 
            v-if="dashboardDetail.categories && dashboardDetail.categories.length > 0"
            :items="dashboardDetail.categories" 
            @update-clicked="showTaskModal" 
            @task-detail-clicked="showTaskDetailModal"
          />

          <!-- No categories message -->
          <div v-else class="mt-8">
            <p class="text-gray-500">Aucune colonne trouvée. Créez-en une nouvelle !</p>
          </div>
        </template>
      </div>
    </div>
  </div>

  <!-- Modal pour ajouter/modifier une colonne -->
  <modal :show="modelValue" @show="onShow" max-width="lg" class="my-auto h-auto">
    <div class="p-6">
      <div class="flex justify-between items-center">
        <h3 class="font-mono font-medium leading-7 text-[19px] text-task-black">
          {{ categorieObject.id != null ? 'Update Column':'Add new Column' }}
        </h3>
        <component :is="CloseCircle" :size="18" class="text-task-blue cursor-pointer" @click="closeModal" />
      </div>
      <div class="mt-2 bg-task-bg-blue w-full h-[6px] rounded-lg"></div>
      
      <div class="form-group mt-4">
        <label for="name" class="font-mono text-left text-task-black-label font-medium leading-6 text-[14px]">
          Name
        </label>
        <input
          class="w-full pl-3 h-11 border rounded-[6px] focus:outline-task-blue border-x-task-gray font-mono mt-2 font-medium leading-6 text-[14px] placeholder-task-input-placeholder"
          name="name" 
          id="name" 
          placeholder="Column name" 
          v-model="categorieObject.name" 
        />
      </div>

      <div class="form-group mt-7">
        <label for="indexColor" class="font-mono text-left text-task-black-label font-medium leading-6 text-[14px]">
          Index Color
        </label>
        <input 
          v-model.trim="categorieObject.indexColor" 
          type="color"
          class="w-full h-11 border rounded-[6px] focus:outline-task-blue border-x-task-gray font-mono mt-3 font-medium leading-6 text-[14px] placeholder-task-input-placeholder"
          name="indexColor" 
          id="indexColor" 
        />
      </div>
      
      <v-row class="flex justify-center mt-4 mb-3">
        <v-btn :loading="isLoading" class="text-center w-[130px] btnColor rounded-md" @click="newCategorie">
          <span class="font-mono font-medium leading-6 text-[14px] spnLogin" v-if="!isLoading">
            {{ categorieObject.id != null ? 'Update' : 'Add' }}
          </span>
          <v-progress-circular class="font-mono" v-else indeterminate size="8" aria-colcount="white">
          </v-progress-circular>
        </v-btn>
      </v-row>
    </div>
  </modal>

  <!-- Modal pour ajouter/modifier une tâche -->
  <modal :show="taskModelValue" @show="onShow" max-width="lg" class="my-auto">
    <div class="p-6">
      <div class="flex justify-between items-center">
        <h3 class="font-mono font-medium leading-7 text-[19px] text-task-black">
          {{ taskObject.id != null ? 'Update Task' : 'Add new Task' }}
        </h3>
        <component :is="CloseCircle" :size="18" class="text-task-blue cursor-pointer" @click="closeTaskModal" />
      </div>
      <div class="mt-2 bg-task-bg-blue w-full h-[6px] rounded-lg"></div>
   
      <div class="form-group mt-4">
        <label for="title" class="font-mono text-left text-task-black-label font-medium leading-6 text-[14px]">
          Title
        </label>
        <input
          class="w-full pl-3 h-11 border rounded-[6px] focus:outline-task-blue border-x-task-gray font-mono mt-2 font-medium leading-6 text-[14px] placeholder-task-input-placeholder"
          name="title" 
          id="title" 
          placeholder="Title" 
          v-model="taskObject.title" 
        />
      </div>

      <div class="form-group mt-5">
        <label for="tags" class="font-mono text-left text-task-black-label font-medium leading-6 text-[14px]">
          Tags
        </label>
        <div  
          class="w-full chips-input flex items-center text-start h-11 border rounded-[6px] font-mono mt-2 font-medium leading-6 text-[14px] placeholder-task-input-placeholder"
          :class="{'focused':isFocused}"
          @focusin="isFocused=true"
          @focusout="isFocused=false" 
        >
          <div v-for="(chip, index) in chips" :key="index" class="flex items-center justify-between w-auto bg-task-gray rounded-[14px] px-[6px] py-[5px] ml-2">
            <span class="chip flex text-gray-600 font-mono font-medium leading-4 text-[15px]">
              {{ chip }}
            </span>
            <div class="flex ml-2">
              <component :is="CloseCircleSpan" :size="16" class="text-gray-500 cursor-pointer" @click="removeChip(index)" />
            </div>
          </div>
          <input 
            v-model="newChip" 
            @keydown.enter.prevent="addChip" 
            placeholder="New tags..."
            class="w-full pl-3 h-11 rounded-[6px] outline-none border-none font-mono font-medium leading-6 text-[14px] placeholder-task-input-placeholder"
          >
        </div>
      </div>

      <div class="form-group mt-5">
        <label for="badgeColor" class="font-mono text-left text-task-black-label font-medium leading-6 text-[14px]">
          Badge color
        </label>
        <div  
          class="w-full chips-input flex items-center text-start h-11 border rounded-[6px] font-mono mt-2 font-medium leading-6 text-[14px] placeholder-task-input-placeholder"
          :class="{'focused':isFocusedColor}"
          @focusin="isFocusedColor=true"
          @focusout="isFocusedColor=false" 
        >
          <div v-for="(color, index) in badgeColor" :key="index" class="flex items-center justify-between w-auto bg-task-gray rounded-[14px] px-[6px] py-[5px] ml-2">
            <span class="chip flex text-gray-700 font-mono font-medium leading-4 text-[15px]" :style="`background-color:${color}`">
              {{ color }}
            </span>
            <div class="flex ml-2">
              <component :is="CloseCircleSpan" :size="16" class="text-gray-500 cursor-pointer" @click="removeColor(index)" />
            </div>
          </div>
          <input 
            v-model="newColor" 
            @keydown.enter.prevent="addColor" 
            placeholder="New color..."
            class="w-full pl-3 h-11 rounded-[6px] outline-none border-none font-mono font-medium leading-6 text-[14px] placeholder-task-input-placeholder"
          >
        </div>
      </div>

      <div class="form-group mt-5">
        <label for="deadline" class="font-mono text-left text-task-black-label font-medium leading-6 text-[14px]">
          Deadline
        </label>
        <input
          type="date"
          pattern="\d{4}-\d{2}-\d{2}"
          class="hide-placeholder w-full pl-3 pr-2 h-11 border rounded-[6px] focus:outline-task-blue border-x-task-gray font-mono mt-2 font-medium leading-6 text-[14px] placeholder-transparent"
          name="deadline" 
          id="deadline" 
          placeholder="YYYY-MM-DD"  
          v-model="taskObject.deadline"
          :style="`color:${taskObject.deadline!=''?'#212121':'transparent'}`"
        />
      </div>

      <v-row class="flex justify-center mt-4 mb-3">
        <v-btn :loading="isLoading" class="pt-1 pb-1 text-center w-[130px] btnColor rounded-md cursor-pointer" @click="addNewTask">
          <span class="font-mono font-medium leading-6 text-[14px] spnLogin" v-if="!isLoading">
            {{ taskObject.id != null ? 'Update' : 'Add' }}
          </span>
          <v-progress-circular class="font-mono" v-else indeterminate size="8" aria-colcount="white">
          </v-progress-circular>
        </v-btn>
      </v-row>
    </div>
  </modal>

  <!-- Snackbars pour les notifications -->
  <v-snackbar v-model="categorieStateGood" :timeout="2000" color="success">
    {{ snackValue }} !
  </v-snackbar>

  <v-snackbar v-model="categorieStateBad" :timeout="1000" color="red">
    {{ snackValue }} !
  </v-snackbar>

  <!-- Modal de détail de tâche (code identique à votre version originale) -->
  <modal :show="taskDetailModelValue" @show="onShow" max-width="5xl" class="my-auto">
    <div class="main-container relative">
      <div class="badge absolute h-[171px] w-[24px] bg-task-blue"></div>
      <div class="pl-12 p-6">
        <div class="flex justify-between items-center">
          <h3 class="font-mono font-medium leading-7 text-[19px] text-task-black"></h3>
          <component :is="CloseCircle" :size="18" class="text-task-blue cursor-pointer" @click="onCloseTaskDetailModel" />
        </div>
        <input 
          type="text" 
          v-model="taskObject.title"   
          class="font-mono p-2 font-medium leading-8 text-[24px] text-task-black focus-visible:bg-white focus-visible:p-2 border-input truncate w-[300px]"
        >
       
        <div class="heading-tag flex item-center justify-between mt-4">
          <div class="left-content flex items-center gap-10">
            <div class="relative flex p-0 items-center text-[18px]">
              <span class="font-mono font-medium">+</span>
              <img src="../assets/images/task_image.jpg" alt="person" class="ml-2 w-[28px] h-[28px] rounded-full">
              <img src="../assets/images/ProfilePic.png" alt="person" class="absolute top-[0px] left-10 w-[28px] h-[28px] rounded-full object-cover">
            </div>
            <div class="tags flex grid-cols-4 gap-2">
              <div class="tag p-1 px-2 bg-task-home-bg rounded-[200px] font-mono font-light leading-5 text-[14px]">
                <span class="font-mono font-medium">+</span> Tag
              </div>
              <div 
                v-for="(tag, index) in taskObject.tags[0]?.split(',')" 
                :key="index"
                class="tag p-1 px-2 bg-task-tag-violet text-task-tag-text-violet rounded-[500px] font-mono font-light leading-5 text-[14px]"
              >
                {{ tag }}
              </div>
            </div>
          </div>
          <div class="right-content flex gap-5">
            <button class="font-mono font-medium leading-2 text-[14px] px-3 bg-task-red text-white rounded-[6px]" @click="taskDetailModelValue = false">
              Cancel
            </button>
            <v-btn :loading="isLoading" class="pt-1 pb-1 px-2 text-center taskSaveBtn rounded-[6px] cursor-pointer" @click="patchTask">
              <span class="font-mono font-medium leading-6 text-[14px] spnLogin text-task-blue">Save changes</span>
              <v-progress-circular v-if="isLoading" class="font-mono" indeterminate size="8" aria-colcount="white">
              </v-progress-circular>
            </v-btn>
          </div>
        </div>

        <div class="body-tag mt-12 flex">
          <div class="lef-side pr-4 w-full">
            <div class="form-group">
              <label for="description" class="font-mono text-left text-black font-medium leading-6 text-[14px]">
                Task description
              </label>
              <textarea 
                v-model.trim="taskObject.description"
                class="w-full mt-2 resize-none text-task-black-label focus-visible:border focus-visible:pl-3 focus-visible:pt-2 rounded-[6px] font-mono font-light leading-6 text-[13px] placeholder-task-input-placeholder text-area-color"
                name="description" 
                id="description" 
                cols="28" 
                rows="3"
              ></textarea>
            </div>

            <div class="mt-3 ">
              <label for="discussions" class="font-mono text-left text-label font-medium leading-6 text-[14px]">
                Discussions
              </label>
              <div class="flex items-start gap-2 w-full mt-2">
                <img src="../assets/images/task_image.jpg" alt="profile" class="w-8 h-8 rounded-full object-cover">
                <div class="form-group w-full relative">
                  <button
                    type="button"
                    @click="showPicker = !showPicker"
                    class="absolute top-1 right-2 text-xl hover:scale-110 transition text-gray-600"
                  >
                    😊
                  </button>
                  <textarea 
                    v-model.trim="commentObject.text"
                    class="w-full text-task-black-label border rounded-[6px] border-x-task-gray font-mono pl-3 pt-2 font-light leading-6 text-[13px] placeholder-task-input-placeholder text-area-color"
                    name="text" 
                    id="text" 
                    cols="28" 
                    rows="3"
                  ></textarea>
                  
                  <div v-if="showPicker" class="absolute top-[-280px] right-0 w-[320px] h-[280px] overflow-y-auto z-[9999] shadow-x  rounded-lg">
                    <EmojiPicker @select="insertEmoji" />
                  </div>
                </div>
              </div>
            </div>

            <div class="right-content flex gap-5 justify-end mt-3">
              <button class="font-mono font-medium leading-2 text-[14px] px-3 bg-task-red text-white rounded-[6px]" @click="taskDetailModelValue = false">
                Cancel
              </button>
              <v-btn :loading="isLoadingComment===true" class="pt-1 pb-1 px-2 text-center taskSaveBtn rounded-[6px] cursor-pointer" @click="saveDiscussion">
                <span class="font-mono font-medium leading-6 text-[14px] spnLogin text-task-blue">Save</span>
                <v-progress-circular v-if="isLoadingComment==true" class="font-mono" indeterminate size="8" aria-colcount="white">
                </v-progress-circular>
              </v-btn>
            </div>

            <div class="mt-4 flex flex-col flex-nowrap overflow-x-auto h-[80px] discussion-container" ref="discussionContainer">
              <div class="flex items-center gap-2 w-full mt-2" v-for="ele in taskObject.comments" :key="ele.id">
                <img src="../assets/images/task_image.jpg" alt="profile" class="w-7 h-7 rounded-full object-cover self-start items-start flex">
                <div class="form-group w-full">
                  <input 
                    v-model.trim="ele.text"
                    readonly
                    class="w-full text-task-black-label border rounded-[6px] h-8 border-x-task-gray font-mono pl-3 font-light leading-6 text-[13px] placeholder-task-input-placeholder"
                    name="text" 
                    id="text"  
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="right-side relative border-l-[3px] border-gray-300 px-4 py-0 my-0 basis-[74%]">
            <label for="attachments" class="absolute top-[-5px] font-mono leading-6 pt-0 text-left text-task-black-label font-medium text-[14px]">
              Attachments
            </label>

            <div 
              class="cursor-pointer w-full h-[70px] mt-8 flex border-[3px] bg-task-file-attach border-dashed border-task-blue rounded-lg"
              @click="handleFileSelection"
            >
              <span class="font-mono leading-4 my-auto mx-auto font-bold text-[12px] text-task-blue">Attach a file</span>
              <input type="file" ref="fileInput" style="display: none;" @change="handleFileChange">
            </div>

            <div v-if="documentFile!=null" class="cursor-pointer w-full h-[70px] mt-3 flex justify-between items-center px-3 border-[2px] bg-task-file-attach-del border-task-red rounded-lg">
              <span class="font-mono leading-4 font-bold text-[12px] text-task-red">{{ documentFile.name }}</span>
              <component :is="CloseCircle" :size="18" class="text-task-red cursor-pointer" @click="deleteDocumentFile" />
            </div>

            <div v-if="imageupload" class="relative cursor-pointer w-full h-[130px] border mt-3 flex justify-between items-center rounded-md">
              <img :src="imageFile" alt="image" class="w-100 h-100 object-cover rounded-md">
              <component :is="CloseCircle" :size="18" class="text-task-red cursor-pointer absolute bottom-[0.4rem] rounded-md right-[0.4rem]" @click="deleteImageFile" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </modal>
</template>

<script setup>
import CurrentPage from '../components/CurrentPage.vue';
import Header from '../components/Header.vue';
import Navigation from '../components/Navigation.vue';
import { VProgressCircular, VRow, VBtn, VSnackbar } from "vuetify/lib/components/index.mjs";
import Modal from "../components/Modal.vue";
import TaskCategory from "../components/TaskCategory.vue";
import store from "../store";
import { ref, onMounted, reactive, watch, computed, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from 'vue-router';
import CreateDashBtn from "../components/btn/CreateDashBtn.vue";
import CloseCircle from "vue-material-design-icons/CloseCircleOutline.vue";
import CloseCircleSpan from "vue-material-design-icons/CloseCircle.vue";
import EmojiPicker from 'vue3-emoji-picker';
import 'vue3-emoji-picker/css';
// import DebugPanel from '../components/DebugPanel.vue'; // Décommentez pour activer le debug

const verifyIfPageisActive = ref(false);
const route = useRoute();
const router = useRouter();
const modelValue = ref(false);
const searchItem = ref("");
const isLoading = ref(false);
const isLoadingComment = ref(false);
const isLoadingDashboard = ref(true);
const dashboardId = ref(null);

const categorieObject = reactive({ 
  id: null, 
  name: '', 
  dashboard: null, 
  indexColor: "" 
});

const commentObject = reactive({ 
  id: null, 
  text: '', 
  task: null 
});

const taskObject = reactive({ 
  id: null, 
  title: '', 
  taskCategory: null, 
  tags: [], 
  badgeColor: [], 
  deadline: "", 
  description: "", 
  uploaded_file: [], 
  comments: [] 
});

const categorieStateGood = ref(false);
const categorieStateBad = ref(false);
const taskModelValue = ref(false);
const isFocused = ref(false);
const isFocusedColor = ref(false);
const chips = ref([]);
const newChip = ref("");
const badgeColor = ref([]);
const newColor = ref("");
const snackValue = ref("");
const taskDetailModelValue = ref(false);
const fileInput = ref(null);
const selectedFile = ref(null);
const imageFile = ref(null);
const imageupload = ref(null);
const documentFile = ref(null);
const discussionContainer = ref(null);
const showPicker = ref(false);

const dashboardDetail = computed(() => store.state.dashboardDetail);
const taskObjectDetail = computed(() => store.state.taskDetail);

function handleEscape(event) {
  if (event.key === 'Escape') {
    taskDetailModelValue.value = false;
  }
}

onMounted(async() => {
  window.addEventListener('keydown', handleEscape);
  try {
    // Récupérer l'ID depuis les paramètres de route
    dashboardId.value = route.params.slug;
    
    
    if (!dashboardId.value) {
      console.error("Aucun ID de dashboard trouvé dans l'URL");
      categorieStateBad.value = true;
      snackValue.value = "Erreur: ID de dashboard manquant";
      isLoadingDashboard.value = false;
      return;
    }

    // Charger les détails du dashboard
    await store.dispatch('detailDashboard', dashboardId.value);
    
    // Vérifier si le dashboard a été chargé
    if (!dashboardDetail.value) {
      console.error("Dashboard non trouvé");
      categorieStateBad.value = true;
      snackValue.value = "Dashboard introuvable";
    } else {
    }
  } catch (error) {
    console.error("Erreur lors du chargement du dashboard:", error);
    categorieStateBad.value = true;
    snackValue.value = "Erreur lors du chargement";
  } finally {
    isLoadingDashboard.value = false;
  }
});


onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEscape);
});
const currentPageTitle = computed(() => {
  if (route.name == "Task Active") {
    verifyIfPageisActive.value = true;
  }
  return route.name;
});

const handleFileSelection = () => {
  fileInput.value.click();
};

function insertEmoji(emoji) {
  commentObject.text += emoji.i;
  showPicker.value = false;
}

const handleFileChange = () => {
  const file = fileInput.value.files[0];
  if (file) {
    selectedFile.value = file;
    if (isDocuments(selectedFile.value.name)) {
      documentFile.value = selectedFile.value;
    } else if (isImage(selectedFile.value)) {
      imageupload.value = selectedFile.value;
    }
  }
};

const deleteDocumentFile = () => {
  documentFile.value = null;
};

const deleteImageFile = () => {
  imageupload.value = null;
  imageFile.value = null;
};

const addChip = (event) => {
  const text = newChip.value.trim();
  if (text !== '' && !chips.value.includes(text)) {
    chips.value.push(text);
    taskObject.tags = chips.value;
    newChip.value = '';
  }
};

const isDocuments = (file) => {
  let typeChecker = ['pdf', 'docx', 'txt', 'csv'];
  if (typeChecker.includes(file.split('.')[1])) {
    return true;
  } else {
    return false;
  }
};

const isImage = (file) => {
  let typeChecker = ['jpeg', 'jpg', 'png', 'svg'];
  if (typeChecker.includes(file.name.split('.')[1])) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imageFile.value = e.target.result;
    };
    reader.readAsDataURL(file);
    return true;
  } else {
    return false;
  }
};

const addColor = (event) => {
  const text = newColor.value.trim();
  if (text !== '' && !badgeColor.value.includes(text)) {
    badgeColor.value.push(text);
    taskObject.badgeColor = badgeColor.value;
    newColor.value = '';
  }
};

const removeChip = (index) => {
  chips.value.splice(index, 1);
};

const removeColor = (index) => {
  badgeColor.value.splice(index, 1);
};

const goToLink = () => {
  router.push({ "name": "Dashboard" });
};

const newCategorie = async () => {
  try {
    isLoading.value = true;
    let categoriStatus = false;

    categorieObject.dashboard = dashboardDetail.value.id;

    let ObjectToSent = { ...categorieObject };
    
    if (categorieObject.id == null) {
      snackValue.value = `Column ${categorieObject.name} created`;
      categoriStatus = await store.dispatch('addCategory', ObjectToSent);
    } else {
      snackValue.value = "Column updated";
      categoriStatus = await store.dispatch('updateCategory', ObjectToSent);
    }
    
    if (categoriStatus) {
      modelValue.value = false;
      isLoading.value = false;
      await store.dispatch('getDashboardList');
      await store.dispatch('detailDashboard', dashboardId.value);
      categorieStateGood.value = true;
      
      // Réinitialiser le formulaire
      categorieObject.id = null;
      categorieObject.name = '';
      categorieObject.indexColor = '';
    } else {
      snackValue.value = "Column not created";
      categorieStateBad.value = true;
    }
  } catch (error) {
    console.error('Error d\'enregistrement:', error);
    snackValue.value = "Error occurred";
    categorieStateBad.value = true;
  } finally {
    isLoading.value = false;
  }
};

const addNewTask = async () => {
  try {
    isLoading.value = true;
    let taskStatus = false;

    let ObjectToSent = { ...taskObject };
    
    if (taskObject.id == null) {
      taskStatus = await store.dispatch('addTask', ObjectToSent);
    } else {
      taskStatus = await store.dispatch('updateTask', ObjectToSent);
    } 
    if (taskStatus ) {
      taskModelValue.value = false;
      isLoading.value = false;
      await store.dispatch('detailDashboard', dashboardId.value);
      snackValue.value = `Task ${taskObject.title} created`;
      categorieStateGood.value = true;
      
      // Réinitialiser le formulaire
      taskObject.id = null;
      taskObject.title = '';
      taskObject.taskCategory = null;
      taskObject.tags = [];
      taskObject.badgeColor = [];
      taskObject.deadline = '';
      chips.value = [];
      badgeColor.value = [];
    } else {
      snackValue.value = "Task not saved. Check the values and retry";
      categorieStateBad.value = true;
    } 
  } catch (error) {
    console.error('Error d\'enregistrement:', error);
    snackValue.value = "Error occurred";
    categorieStateBad.value = true;
  } finally {
    isLoading.value = false;
  }
};

const patchTask = async () => {
  try {
    isLoading.value = true;
    let taskStatus = false;

    let ObjectToSent = { ...taskObject };
    
    if (documentFile.value != null) {
      taskObject.uploaded_file.push(documentFile.value);
    }
    if (imageupload.value != null) {
      taskObject.uploaded_file.push(imageupload.value);
    }

    taskStatus = await store.dispatch('patchTask', ObjectToSent);

    if (taskStatus) {
      imageupload.value = null;
      documentFile.value = null;
      taskObject.uploaded_file = [];
      isLoading.value = false;
      
      let taskDetailFound = store.state.taskDetail;
      taskObject.title = taskDetailFound.title;
      taskObject.description = taskDetailFound.description;
      taskObject.tags = taskDetailFound.tags;
      taskObject.id = taskDetailFound.id;

      snackValue.value = "Saved";
      categorieStateGood.value = true;
      
      await store.dispatch('getDashboardList');
      await store.dispatch('detailDashboard', dashboardId.value);
    } else {
      snackValue.value = "Not saved";
      categorieStateBad.value = true;
    } 
  } catch (error) {
    console.error('Error d\'enregistrement:', error);
    snackValue.value = "Error occurred";
    categorieStateBad.value = true;
  } finally {
    isLoading.value = false;
  }
};

const saveDiscussion = async () => {
  try {
    isLoadingComment.value = true;
    let taskStatus = false;

    commentObject.task = taskObject.id;

    let ObjectToSent = { ...commentObject };

    if (ObjectToSent) {
      taskStatus = await store.dispatch('addTaskComment', ObjectToSent);
    }

    if (taskStatus) {
      isLoadingComment.value = false;
      commentObject.text = "";


      await store.dispatch('detailTask', ObjectToSent.task);
      snackValue.value = "Saved";
      categorieStateGood.value = true;
    } else {
      snackValue.value = "Not saved";
      categorieStateBad.value = true;
    } 
  } catch (error) {
    console.error('Error d\'enregistrement:', error);
    snackValue.value = "Error occurred";
    categorieStateBad.value = true;
  } finally {
    isLoadingComment.value = false;
  }
};

const handleSearch = (search) => {
  searchItem.value = search;
};

const onShowCategorieModal = () => {
  // Réinitialiser le formulaire avant d'ouvrir
  categorieObject.id = null;
  categorieObject.name = '';
  categorieObject.indexColor = '';
  modelValue.value = true;
};

const closeModal = () => {
  modelValue.value = false;
  taskModelValue.value = false;
};

const closeTaskModal = () => {
  taskModelValue.value = false;
  // Réinitialiser le formulaire
  taskObject.id = null;
  taskObject.title = '';
  taskObject.taskCategory = null;
  taskObject.tags = [];
  taskObject.badgeColor = [];
  taskObject.deadline = '';
  chips.value = [];
  badgeColor.value = [];
};

const showTaskModal = async (categorieData) => {
  const receivData = await categorieData;
  if (receivData) {
    // Réinitialiser le formulaire
    taskObject.id = null;
    taskObject.title = '';
    taskObject.tags = [];
    taskObject.badgeColor = [];
    taskObject.deadline = '';
    taskObject.description = '';
    chips.value = [];
    badgeColor.value = [];
    
    taskModelValue.value = true;
    taskObject.taskCategory = receivData.id;
  }
};

const showTaskDetailModal = async (taskData) => {
  let taskStatus = false;
  const receivData = await taskData;
  if (receivData) {
    taskObject.uploaded_file = [];

    taskStatus = await store.dispatch('detailTask', receivData.id);
    if (taskStatus) {
      let taskDetailFound = store.state.taskDetail;

      taskObject.title = taskDetailFound.title;
      taskObject.description = taskDetailFound.description;
      taskObject.tags = taskDetailFound.tags;
      taskObject.id = taskDetailFound.id;
      taskObject.comments = taskDetailFound.comments || [];

      taskDetailModelValue.value = true;
    }
  }
};

const onCloseTaskDetailModel = () => {
  taskDetailModelValue.value = false;
};

watch(taskObjectDetail, (newValue, oldValue) => {
  if (newValue) {
    taskObject.title = newValue.title;
    taskObject.description = newValue.description;
    taskObject.tags = newValue.tags;
    taskObject.id = newValue.id;
    taskObject.comments = newValue.comments || [];


    if (discussionContainer.value) {
      discussionContainer.value.scrollTop = discussionContainer.value.scrollHeight;
    }
  }
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

.hidden-input {
  opacity: 0;
  position: absolute;
  pointer-events: none;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
}

.chips-input {
  position: relative;
}

.focused {
  border: 2px solid #007AFF !important;
  outline-color: #007AFF;
}

.isFocusedColor {
  border: 2px solid #007AFF !important;
  outline-color: #007AFF;
}

.hide-placeholder {
  color: transparent;
  cursor: pointer;
}

.taskSaveBtn {
  border: 1px solid #007AFF;
}

.border-input {
  border: 1px solid transparent;
}

.border-input:focus {
  outline-color: rgba(0, 0, 0, 0.12) !important;
  border-width: 1px;
  border-style: solid;
  outline-width: thin;
}

.text-area-color:focus-visible {
  outline-color: rgba(0, 0, 0, 0.12);
  border-width: 0px;
  outline-width: 0.30rem;
}

.btnColor {
  background: rgba(0, 122, 255, 1);
  color: #ffffff;
}

.discussion-container::-webkit-scrollbar { 
  display: none;
}

.scrolbar::-webkit-scrollbar {
  width: 0;
  height: 2em;
  scrollbar-width: thin;
}
</style>