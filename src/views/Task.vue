<template>
  <div class="flex  w-full justify-between gap-[70px] bg-task-home-bg overflow-y-auto scrolbar">
    <Navigation />
    <div class="main w-full  ">
      <Header @search="handleSearch" />
      <div class="w-100     flex justify-start flex-col items-start   main-core px-8">
        <div class="flex">
          <span @click="goToLink"
            class="cursor-pointer font-mono font-bold leading-[28px] text-[24px] text-center text-black mr-2">Dashboard
            > </span>
          <CurrentPage :pageTitle="dashboardDetail.bordName" :active="true" />

        </div>
        <CreateDashBtn @button-clicked="onShowCategorieModal" btnText="Add columns" class="mt-3" />

        <TaskCategory :items="dashboardDetail.categories" @update-clicked="showTaskModal" @task-detail-clicked="showTaskDetailModal"/>





      </div>
    </div>

  </div>

  <modal :show="modelValue" @show="onShow" max-width="lg" class="my-auto h-auto">
    <div class="p-6">
      <div class="flex justify-between items-center">
        <h3 class="font-mono font-medium leading-7 text-[19px] text-task-black">{{ categorieObject.id != null ? 'Update   Column':'Add new Column' }}</h3>
        <component :is="CloseCircle" :size=18 class="text-task-blue cursor-pointer" @click="closeModal" />
      </div>
      <div class=" mt-2 bg-task-bg-blue w-full h-[6px] rounded-lg">

      </div>
      <div class="form-group mt-4">
        <label for="name"
          class="font-mono text-left text-task-black-label font-medium leading-6 text-[14px]">Name</label>
        <input
          class="w-full pl-3 h-11 border rounded-[6px] focus:outline-task-blue border-x-task-gray font-mono mt-2  font-medium leading-6 text-[14px] placeholder-task-input-placeholder"
          name="name" id="name" placeholder=" name" v-model="categorieObject.name" />

      </div>

      <div class="form-group mt-7">
        <label for="name" class="font-mono text-left text-task-black-label font-medium leading-6 text-[14px]">Index
          Color</label>
        <input v-model.trim="categorieObject.indexColor" type="color"
          class="w-full h-11  border rounded-[6px]  focus:outline-task-blue border-x-task-gray font-mono mt-3  font-medium leading-6 text-[14px] placeholder-task-input-placeholder"
          name="indexColor" id="indexColor" />

      </div>
      <v-row class="flex justify-center mt-4 mb-3">
        <v-btn :loading="isLoading" class="text-center w-[130px]  btnColor rounded-md" @click="newCategorie">
          <span class=" font-mono font-medium leading-6 text-[14px] spnLogin" v-if="!isLoading">{{ categorieObject.id !=
        null ?
        'Update' : 'Add' }}</span>
          <v-progress-circular class="font-mono" v-else indeterminate size="8" aria-colcount="white">

          </v-progress-circular>

        </v-btn>

      </v-row>
    </div>
  </modal>
  <modal :show="taskModelValue" @show="onShow" max-width="lg" class="my-auto">
    <div class="p-6">
     
      <div class="flex justify-between items-center">
        <h3 class="font-mono font-medium leading-7 text-[19px] text-task-black">{{ categorieObject.id != null ?
        'Update Task' : 'Add new Task' }}</h3>
        <component :is="CloseCircle" :size=18 class="text-task-blue cursor-pointer" @click="closeModal" />
      </div>
      <div class=" mt-2 bg-task-bg-blue w-full h-[6px] rounded-lg">

      </div>
   
      <div class="form-group mt-4">
        <label for="title"
          class="font-mono text-left text-task-black-label font-medium leading-6 text-[14px]">Title</label>
        <input
          class="w-full pl-3 h-11 border rounded-[6px] focus:outline-task-blue border-x-task-gray font-mono mt-2  font-medium leading-6 text-[14px] placeholder-task-input-placeholder"
          name="title" id="title" placeholder=" Title" v-model="taskObject.title" />

      </div>

      <div class="form-group mt-5">
        <label for="name" class="font-mono text-left text-task-black-label font-medium leading-6 text-[14px]">Tags
          </label>
    
            <div  
            class="w-full chips-input   flex items-center text-start h-11 border rounded-[6px]   font-mono mt-2  font-medium leading-6 text-[14px] placeholder-task-input-placeholder"
            :class="{'focused':isFocused}"
            @focusin="isFocused=true"
            @focusout="isFocused =false" 
            >
          <div v-for="(chip, index) in chips" :key="index" class="flex items-center justify-between w-auto bg-task-gray  rounded-[14px]  px-[6px] py-[5px] ml-2
           ">
            <span
              class="chip flex      text-gray-600   font-mono font-medium leading-4 text-[15px] ">
              {{ chip }}
            </span>
            <div class="flex ml-2">
              <component :is="CloseCircleSpan" :size=16 class="text-gray-500 cursor-pointer" @click="removeChip(index)" />

            </div>
          </div>
          <input  v-model="newChip" @keydown.enter.prevent="addChip" placeholder="New tags..."
      class=" w-full pl-3 h-11  rounded-[6px]  outline-none border-none font-mono   font-medium leading-6 text-[14px] placeholder-task-input-placeholder">


          </div>
          <div>
          
          </div>
      
       


 
  
    </div>
    <div class="form-group mt-5">
        <label for="name" class="font-mono text-left text-task-black-label font-medium leading-6 text-[14px]">
          Badge color
          </label>
    
            <div  
            class="w-full chips-input   flex items-center text-start h-11 border rounded-[6px]   font-mono mt-2  font-medium leading-6 text-[14px] placeholder-task-input-placeholder"
            :class="{'focused':isFocusedColor}"
            @focusin="isFocusedColor=true"
            @focusout="isFocusedColor =false" 
            >
          <div v-for="(color, index) in badgeColor" :key="index" class="flex items-center justify-between w-auto bg-task-gray  rounded-[14px]  px-[6px] py-[5px] ml-2
           ">
            <span
              class="chip flex      text-gray-700  font-mono font-medium leading-4 text-[15px] " :style="`background-color:${color}`">
              {{ color }}
            </span>
            <div class="flex ml-2">
              <component :is="CloseCircleSpan" :size=16 class="text-gray-500 cursor-pointer" @click="removeColor(index)" />

            </div>
          </div>
          <input  v-model="newColor" @keydown.enter.prevent="addColor" placeholder="New color..."
      class=" w-full pl-3 h-11  rounded-[6px]  outline-none border-none font-mono   font-medium leading-6 text-[14px] placeholder-task-input-placeholder">


          </div>
          <div>
          
          </div>
      
       


 
  
    </div>
    <div class="form-group mt-5">
        <label for="title"
          class="font-mono text-left text-task-black-label font-medium leading-6 text-[14px]">Deadline</label>
        <input
        type="date"
        pattern="\d{4}-\d{2}-\d{2}"
          class=" hide-placeholder w-full pl-3 pr-2 h-11 border rounded-[6px] focus:outline-task-blue border-x-task-gray font-mono mt-2  font-medium leading-6 text-[14px] placeholder-transparent"
          name="deadline" id="deadline" placeholder="YYYY-MM-DD"  v-model="taskObject.deadline"
          :style="`color:${taskObject.deadline!=''?'#212121':transparent}`"
          />
     
      </div>

    <v-row class="flex justify-center mt-4 mb-3">
      <v-btn :loading="isLoading" class="pt-1 pb-1 text-center w-[130px]  btnColor rounded-md cursor-pointer" @click="addNewTask">
        <span class=" font-mono font-medium leading-6 text-[14px] spnLogin" v-if="!isLoading">{{ taskObject.id !=
        null ?
        'Update' : 'Add' }}</span>
        <v-progress-circular class="font-mono" v-else indeterminate size="8" aria-colcount="white">

        </v-progress-circular>

      </v-btn>

    </v-row>
    </div>
  </modal>
  <v-snackbar v-model="categorieStateGood" :timeout=2000 color="success">
    {{snackValue}} !
  </v-snackbar>

  <v-snackbar v-model="categorieStateBad" :timeout=1000 color="red">
    {{snackValue}} !
  </v-snackbar>



<!-- Task detail -->

  <modal :show="taskDetailModelValue" @show="onShow" max-width="5xl" class="my-auto">
<!--     {{taskObject}} -->
    <div class="main-container relative">
      <div class="badge absolute h-[171px] w-[24px] bg-task-blue"></div>
      <div class="pl-12 p-6">
      <div class="flex justify-between items-center">
        <h3 class="font-mono font-medium leading-7 text-[19px] text-task-black"></h3>
        <component :is="CloseCircle" :size=18 class="text-task-blue cursor-pointer" @click="onCloseTaskDetailModel" />
      </div>
      <input type="text" v-model="taskObject.title"   class="font-mono p-2 font-medium leading-8 text-[24px] text-task-black  focus-visible:bg-white focus-visible:p-2  border-input truncate w-[300px]">
     
     
   <div class="heading-tag flex item-center justify-between mt-4">
    <div class="left-content flex items-center gap-10">
      <div class="relative flex p-0 items-center text-[18px]">
              <span class="font-mono font-medium">+</span>
              <img src="../assets/images/task_image.jpg" alt="person" class="ml-2 w-[28px] h-[28px] rounded-full">
              <img src="../assets/images/ProfilePic.png" alt="person"
                class=" absolute top-[0px] left-10 w-[28px] h-[28px] rounded-full object-cover">
            </div>
            <div class="tags flex grid-cols-4 gap-2" >
            <div class="tag  p-1  px-2 bg-task-home-bg rounded-[200px] font-mono font-light leading-5 text-[14px]" >
              <span class="font-mono font-medium">+</span> Tag
            </div>
            <div>
                
            </div>
            <div
            v-for="(tag, index) in taskObject.tags[0].split(',')" :key="index"
              class="tag p-1  px-2 bg-task-tag-violet text-task-tag-text-violet rounded-[500px] font-mono font-light leading-5 text-[14px]">
              {{tag}}
            </div>
           
          </div>
    </div>
    <div class="right-content flex gap-5">
      <button class="font-mono font-medium leading-2 text-[14px] px-3 bg-task-red text-white rounded-[6px]" @click=" taskDetailModelValue =false">
        Cancel
      </button>
      <v-btn :loading="isLoading" class="pt-1 pb-1 px-2 text-center   taskSaveBtn rounded-[6px] cursor-pointer" @click="patchTask">
        <span class=" font-mono font-medium leading-6 text-[14px] spnLogin text-task-blue" >Save changes </span>
        <v-progress-circular v-if="isLoading" class="font-mono"  indeterminate size="8" aria-colcount="white">

        </v-progress-circular>

      </v-btn>

    </div>
   </div>
   <div class="body-tag mt-12 flex">
    <div class="lef-side pr-4 w-full ">
      <div class="form-group ">
        <label for="description"
          class="font-mono text-left text-black font-medium leading-6 text-[14px]">Task description</label>
          <textarea v-model.trim="taskObject.description"
          class="w-full mt-2 resize-none text-task-black-label focus-visible:border focus-visible:pl-3 focus-visible:pt-2    rounded-[6px]   font-mono   font-light leading-6 text-[13px] placeholder-task-input-placeholder text-area-color"
          name="description" id="name" cols="28" rows="3" ></textarea>

      </div>
      <div class="mt-3 overflow-y-auto">
      <label for="discussions "
          class="font-mono text-left text-label font-medium leading-6 text-[14px] ">Discussions</label>
      <div class="flex items-start gap-2 w-full mt-2 ">
        <img src="../assets/images/task_image.jpg" alt="profile" class="w-8 h-8 rounded-full object-cover">
        <div class="form-group  w-full ">
        
          <textarea v-model.trim="commentObject.text"
          
          class="  w-full text-task-black-label  border rounded-[6px]   border-x-task-gray font-mono  pl-3 pt-2 font-light leading-6 text-[13px] placeholder-task-input-placeholder text-area-color"
          name="text" id="text" cols="28" rows="3" ></textarea>

      </div>
    </div>
      </div>
      <div class="right-content flex gap-5 justify-end mt-3">
      <button class="font-mono font-medium leading-2 text-[14px] px-3 bg-task-red text-white rounded-[6px]"  @click=" taskDetailModelValue =false">
        Cancel
      </button>
      <v-btn :loading="isLoadingComment===true" class="pt-1 pb-1 px-2 text-center   taskSaveBtn rounded-[6px] cursor-pointer" @click="saveDiscussion">
        <span class=" font-mono font-medium leading-6 text-[14px] spnLogin text-task-blue" >Save </span>
        <v-progress-circular v-if="isLoadingComment==true" class="font-mono"  indeterminate size="8" aria-colcount="white">

        </v-progress-circular>

      </v-btn>

    </div>

    <div class="mt-4 flex flex-col flex-nowrap overflow-x-auto h-[80px] discussion-container" ref="discussionContainer">
     
      <div class="flex items-center gap-2 w-full mt-2 " v-for="ele in taskObject.comments" :key="ele.id">
        <img src="../assets/images/task_image.jpg" alt="profile" class="w-7 h-7 rounded-full object-cover self-start items-start flex">
        <div class="form-group  w-full ">
        
          <input v-model.trim="ele.text"
          readonly
          class=" w-full text-task-black-label  border rounded-[6px] h-8   border-x-task-gray font-mono  pl-3 font-light leading-6 text-[13px] placeholder-task-input-placeholder"
          name="text" id="text"  />

      </div>
    </div>
      </div>
     
    </div>
    <div class="right-side relative border-l-[3px] border-gray-300 px-4 py-0 my-0 basis-[74%]">
      <label for="discussions"
          class="absolute top-[-5px] font-mono leading-6  pt-0 text-left text-task-black-label font-medium  text-[14px] ">Attachments</label>

          <div class="cursor-pointer w-full h-[70px] mt-8 flex border-[3px] bg-task-file-attach border-dashed border-task-blue rounded-lg"
          @click="handleFileSelection"
          >
<span class="font-mono leading-4 my-auto mx-auto font-bold  text-[12px] text-task-blue ">Attach a file</span>
<input type="file" ref="fileInput" style="display: none;" @change="handleFileChange">
          </div>

          <div v-if="documentFile!=null" class="cursor-pointer w-full h-[70px] mt-3 flex justify-between items-center px-3 border-[2px] bg-task-file-attach-del  border-task-red rounded-lg"
        
          >
<span class="font-mono leading-4 font-bold  text-[12px] text-task-red "> {{ documentFile.name }}</span>
<component :is="CloseCircle" :size=18 class="text-task-red cursor-pointer" @click="deleteDocumentFile" />

          </div>


          <div v-if="imageupload" class=" relative cursor-pointer w-full  h-[130px] border mt-3 flex justify-between items-center  rounded-md"
        
        >
<img :src="imageFile" alt="image " class="w-100 h-100 object-cover rounded-md">
<component :is="CloseCircle" :size=18 class="text-task-red cursor-pointer  absolute bottom-[0.4rem] rounded-md right-[0.4rem]" @click="deleteImageFile" />

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
import { VProgressCircular } from "vuetify/lib/components/index.mjs";
import Modal from "../components/Modal.vue";
import { VRow } from "vuetify/lib/components/index.mjs";
import { VSelect } from "vuetify/lib/components/index.mjs";
import TaskCategory from "../components/TaskCategory.vue";
import DashBoardList from "../components/DashBoardList.vue";
import store from "../store";
import { ref, onMounted, reactive, watch } from "vue";
import { useRoute, useRouter } from 'vue-router'
import { computed } from "@vue/reactivity"
import CreateDashBtn from "../components/btn/CreateDashBtn.vue";
import MoreIcon from "vue-material-design-icons/DotsVertical.vue";
import CloseCircle from "vue-material-design-icons/CloseCircleOutline.vue";
import CloseCircleSpan from "vue-material-design-icons/CloseCircle.vue";
import { VSnackbar } from "vuetify/lib/components/index.mjs";
// Dro
import { VBtn } from "vuetify/lib/components/index.mjs";

const verifyIfPageisActive = ref(false)
const route = useRoute();
const router = useRouter();
const modelValue = ref(false)
const searchItem = ref("")
const isLoading = ref(false)
const isLoadingComment = ref(false)
const dashboardId = ref(null)
const categorieObject = reactive({ id: null, name: '', dashboard: null, indexColor: "" });
const commentObject = reactive({ id: null, text: '', task: null });
const taskObject = reactive({ id: null, title: '', taskCategory: null, tags: [], badgeColor: [], deadline: "", description:"", uploaded_file: [], comments:[] });
const inputField = ref(null);
const dashboardIdentifiant = ref(null)
const categorieStateGood = ref(false)
const categorieStateBad = ref(false)
const taskModelValue = ref(false)
const isFocused = ref(false)
const isFocusedColor = ref(false)
const chips = ref([]);
const newChip = ref("");
const badgeColor = ref([]);
const newColor = ref("")
const snackValue = ref("")
const taskDetailModelValue = ref(false)
const taskDataObjectDetail =  ref(null)
const fileInput = ref(null);
const selectedFile = ref(null);
const imageFile = ref(null);
const imageupload = ref(null)
const documentFile=ref(null)
const discussionContainer = ref(null);

const currentPageTitle = computed(() => {
  console.log("the root name", route.name);
  if (route.name == "Task Active") {
    verifyIfPageisActive.value = true
  }
  return route.name
})


const handleFileSelection = ()=>{
  fileInput.value.click();
}

const handleFileChange = ()=>{
const file = fileInput.value.files[0];
if (file){
  selectedFile.value = file
  console.log(selectedFile.value);
if (isDocuments(selectedFile.value.name)){
  documentFile.value=selectedFile.value

}
else if(isImage(selectedFile.value)){
  imageupload.value=selectedFile.value

}
}
}

const deleteDocumentFile = ()=>{
  documentFile.value =null
}


const deleteImageFile = ()=>{
  imageupload.value =null
  imageFile.value=null

}

const addChip = (event) => {
  const text = newChip.value.trim();
  console.log("le chips est ", newChip.value);
  if (text !== '' && !chips.value.includes(text)) {
    chips.value.push(text);
    taskObject.tags=chips.value
    newChip.value = '';
  }
};


const isDocuments =(file)=>{
  let typeChecker = ['pdf', 'docx', 'txt', 'csv']
if(typeChecker.includes(file.split('.')[1])){
  console.log("a doc file");

 
  return true;
}
else{

  return false;
}
}

const isImage=(file)=> {
  let typeChecker = ['jpeg', 'jpg', 'png', 'svg']
if(typeChecker.includes(file.name.split('.')[1])){
  console.log("a doc file");
  const reader = new FileReader();
  reader.onload =(e)=>{
    imageFile.value=e.target.result;
  }
  reader.readAsDataURL( file)
  return true;
}
else{
  console.log("not a doc file", file.split('.')[1]);
  return false;
}
}


const addColor = (event) => {
  const text = newColor.value.trim();

  if (text !== '' && !badgeColor.value.includes(text)) {
    badgeColor.value.push(text);
    taskObject.badgeColor=badgeColor.value
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
  router.push(
    { "name": "Dashboard" }
  )
}


const newCategorie = async () => {

  try {
    isLoading.value = true
    let categoriStatus = false;

    categorieObject.dashboard = dashboardDetail.value.id
    console.log("Identifiant du dash ", categorieObject.dashboard);

    let ObjectToSent = { ...categorieObject }; // Create a copy of dashObject
    console.log("this is the object", ObjectToSent);
    if (categorieObject.id == null) {
      snackValue.value =`Column ${categorieObject.name} created`
      categoriStatus = await store.dispatch('addCategory', ObjectToSent);

    }
    else {
      snackValue.value ="Column not created"
      categoriStatus = await store.dispatch('updateCategory', ObjectToSent);

    }
    console.log("Le status actuel ", newCategorie);
    if (categoriStatus) {

      // Redirect to dashboard or any other route on successful login
      modelValue.value = false
      isLoading.value = false
      store.dispatch('getDashboardList')
  store.dispatch('detailDashboard', dashboardId.value)
     


      categorieStateGood.value = true

    } else {
      categorieStateBad.value = true
    }
  } catch (error) {
    console.error('Error d\'enregistrement dans :', error);
    // Handle error (show error message, retry login, etc.)
  }
}


const addNewTask = async () => {
  try {
    isLoading.value = true
    let taskStatus = false;


    console.log("Identifiant de la categorie ", taskObject.taskCategory);

    let ObjectToSent = { ...taskObject }; // Create a copy of dashObject
    console.log("this is the object", ObjectToSent);
   if (taskObject.id == null) {
    taskStatus = await store.dispatch('addTask', ObjectToSent);

    }
    else {
      taskStatus = await store.dispatch('updateTask', ObjectToSent);

    } 
    //console.log("Le status actuel ", newCategorie);
    if (taskStatus) {

      // Redirect to dashboard or any other route on successful login
      taskModelValue.value = false
      isLoading.value = false
   
      store.dispatch('detailDashboard', dashboardId.value)
      snackValue.value =`Task ${taskObject.title} created`
      categorieStateGood.value = true


    } else {
      snackValue.value ="Task not saved"
      categorieStateBad.value = true
    } 
  } catch (error) {
    console.error('Error d\'enregistrement dans :', error);
    // Handle error (show error message, retry login, etc.)
  }
}


const patchTask = async () => {
  try {
    isLoading.value = true
    let taskStatus = false;




    let ObjectToSent = { ...taskObject }; // Create a copy of dashObject
    console.log("this is the object", ObjectToSent);
   if (documentFile.value != null) {
    taskObject.uploaded_file.push(documentFile.value)

    }
    if (imageupload.value!=null){
      taskObject.uploaded_file.push(imageupload.value)
    }

console.log("image to uploade ", taskObject.uploaded_file);
    taskStatus = await store.dispatch('patchTask', ObjectToSent);

 
    //console.log("Le status actuel ", newCategorie);
    if (taskStatus) {

      // Redirect to dashboard or any other route on successful login
      imageupload.value=null
      documentFile.value=null
      taskObject.uploaded_file =[]
      
      isLoading.value = false
      let taskDetailFound = store.state.taskDetail

 
taskObject.title = taskDetailFound.title
taskObject.description = taskDetailFound.description
taskObject.tags = taskDetailFound.tags
taskObject.id = taskDetailFound.id

   

      snackValue.value ="Saved"
      categorieStateGood.value = true

      
      store.dispatch('getDashboardList')
      store.dispatch('detailDashboard', dashboardId.value)

    } else {
      snackValue.value ="Not saved"
      categorieStateBad.value = true
    } 
  } catch (error) {
    console.error('Error d\'enregistrement dans :', error);
    // Handle error (show error message, retry login, etc.)
  }
}

const saveDiscussion = async () => {
  try {
    isLoadingComment.value = true
    let taskStatus = false;

    commentObject.task = taskObject.id


    let ObjectToSent = { ...commentObject }; // Create a copy of dashObject
    console.log("this is the object", ObjectToSent);

   if (ObjectToSent) {
    taskStatus = await store.dispatch('addTaskComment', ObjectToSent);

    }

  
 
    //console.log("Le status actuel ", newCategorie);
    if (taskStatus) {
      isLoadingComment.value = false
      commentObject.text =""

      console.log("This is the task ", taskStatus);
      console.log("This is the loader state ",  isLoadingComment.value);

      // Redirect to dashboard or any other route on successful login
      store.dispatch('detailTask', ObjectToSent.task);
     

   
      snackValue.value ="Saved"
      categorieStateGood.value = true
    } else {
      snackValue.value ="Not saved"
      categorieStateBad.value = true
    } 
  } catch (error) {
    console.error('Error d\'enregistrement dans :', error);
    // Handle error (show error message, retry login, etc.)
  }
}

const taskObjectDetail = computed(() => store.state.taskDetail)

watch(taskObjectDetail, (newValue, oldValue) => {
      

console.log("task detail computed ", taskObjectDetail);
taskObject.title = newValue.title
taskObject.description = newValue.description
taskObject.tags = newValue.tags
taskObject.id = newValue.id
taskObject.comments = newValue.comments


console.log("task object ", oldValue.tags);
// Log the computed value whenever it changes

if (discussionContainer.value) {
        discussionContainer.value.scrollTop = discussionContainer.value.scrollHeight;
      }
});



const handleSearch = (search) => {
  searchItem.value = search
  console.log("la valeur entrée est", searchItem.value)
 
}

const onShowCategorieModal = () => {
  modelValue.value = true

}


const closeModal = () => {
  taskModelValue.value = false;
}
onMounted(() => {
  dashboardId.value = route.params.slug;
  console.log(dashboardId.value);
  store.dispatch('detailDashboard', dashboardId.value)
  


});





const dashboardDetail = computed(() => store.state.dashboardDetail)
const showTaskModal = async (categorieData) => {

  const receivData = await categorieData
  if (receivData) {
    console.log("l'id de la categorie ", receivData.id)
    taskModelValue.value = true
    taskObject.taskCategory = receivData.id
  }


}

const showTaskDetailModal = async (taskData) => {
  let taskStatus = false;
  const receivData = await taskData
  if (receivData) {
    taskObject.uploaded_file=[]


  taskStatus = await store.dispatch('detailTask', receivData.id)
  if(taskStatus){
    let taskDetailFound = store.state.taskDetail

 
    taskObject.title = taskDetailFound.title
    taskObject.description = taskDetailFound.description
    taskObject.tags = taskDetailFound.tags
    taskObject.id = taskDetailFound.id

    taskDetailModelValue.value =true
  }


    
  }


}

const onCloseTaskDetailModel = ()=>{
  taskDetailModelValue.value = false
}

const taskDetail = computed(() => store.state.taskDetail)


/* watch(() => inputField.value, () => {
  inputField.value = chips.value.join(',');
},

);
 */

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



/* chips style */

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


.chips-input{
  position: relative;
}
.focused{
  border:2px solid #007AFF!important;
  outline-color: #007AFF;
  
}

.isFocusedColor{
  border:2px solid #007AFF!important;
  outline-color: #007AFF;
}

.hide-placeholder{
  color: transparent;
  cursor:pointer
}


.taskSaveBtn{
  border: 1px solid #007AFF;
}


.border-input{
  border: 1px solid transparent;
}

.border-input:focus{
  outline-color: rgba(0, 0, 0, 0.12)!important;
  border-width: 1px;
  border-style: solid;
  outline-width: thin;
}

.text-area-color:focus-visible{
  outline-color: rgba(0, 0, 0, 0.12);
  border-width: 0px;
  outline-width: 0.30rem;
}

.btnColor {
  background: rgba(0, 122, 255, 1);
  color: #ffffff;
}

.discussion-container::-webkit-scrollbar { 
    display: none;  /* Safari and Chrome */
}




.scrolbar::-webkit-scrollbar {
        width: 0;
        height: 2em;
        scrollbar-width: thin;
    } 



</style>