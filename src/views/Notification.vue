<template>
    <div class="flex  w-full justify-between gap-[70px] bg-task-home-bg overflow-y-auto scrolbar">
      <Navigation :activenumber="2"/>
      <div class="main w-full  ">
        <Header @search="handleSearch" />
        <div class="w-100 px-8    flex justify-start flex-col items-start ">
        <CurrentPage :pageTitle="currentPageTitle" :active="verifyIfPageisActive" />
        </div>
       
      </div>
  
    </div>

  

  </template>
  
  <script setup>

  import Header from '../components/Header.vue';
  import Navigation from '../components/Navigation.vue';

  import store from "../store";
  import { ref, onMounted, reactive, watch } from "vue";
  import { useRoute, useRouter } from 'vue-router'
  import { computed } from "@vue/reactivity"
  import CurrentPage from '../components/CurrentPage.vue';
  
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
  
  
  const currentPageTitle = computed(() => {
    console.log("the root name", route.name);
    if (route.name == "Notifications") {
      verifyIfPageisActive.value = true
    }
    return route.name
  })
  
  
  const handleFileSelection = ()=>{
    fileInput.value.click();
  }
  

  
  

  

  
  
  const goToLink = () => {
    router.push(
      { "name": "Dashboard" }
    )
  }
  dashboardIdentifiant.value = store.state.dashboardDetail
  

  
  
  
  
  
  
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
  
      } else {
        snackValue.value ="Not saved"
        categorieStateBad.value = true
      } 
    } catch (error) {
      console.error('Error d\'enregistrement dans :', error);
      // Handle error (show error message, retry login, etc.)
    }
  }

  const handleSearch = (search) => {
    searchItem.value = search
    console.log("la valeur entrée est", searchItem.value)
   
  }
  
  const onShowCategorieModal = () => {
    modelValue.value = true
  }
  


  
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