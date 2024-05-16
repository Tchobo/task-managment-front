<template>



  <Draggable v-model="items" group="items"
    class="drag-container dragab   flex flex-row flex-nowrap justify-between gap-x-6  flex-shrink-0 w-full bg-transparent  overflow-x-auto"
    item-key="id" tag="ul" 
    drag-class="drag" ghost-class="ghost"
    :options="dragOptions"
    @change="onChange"
    
    >
    <template #item="{ element }">


      <li class=" mt-5  overflow-hidden min-w-[280px] select-none shrink-0 card">

        <div class="flex header-categorie flex-row items-center  w-full justify-between">
          <div class="flex justify-start">
            <div class="">
              <div class="w-[15px] h-[15px] rounded-full " :style="getStyle(element.indexColor)">
              </div>
            </div> 
            <span class=" ml-2 font-mono font-medium leading-4 text-[14px] text-task-black select-none">{{
    element.name }}</span>
          </div>
          <div class=" more-icon  flex gap-2">

            <component :is="MoreIcon" :size=20 class="font-light"
            @click="handleClick(element)"

              :style="['color:rgba(41, 45, 50, 0.5);', 'cursor:pointer;']" />
            <div class="flex items-center gap-[1px] cursor-pointer">
              <div class="w-[4px] h-[4px] border-[1.5px] border-solid bg-white border-categorie-icon-text rounded-full">
              </div>
              <div class="w-[4px] h-[4px] border-[1.5px] border-solid bg-white border-categorie-icon-text rounded-full">
              </div>
              <div class="w-[4px] h-[4px] border-[1.5px] border-solid bg-white border-categorie-icon-text rounded-full">
              </div>
            </div>





          </div>


        </div>
        <Draggable 
        v-model="element.tasks" 
        group="element.tasks"
        type="list"
        
        @change="onChangeTask($event, element)"
       
    class="drag-container cursor-move drag-task "
    item-key="id" tag="ul" drag-class="drag-task" ghost-class="ghost-task" :options="dragOptions"

  
    >
    <template #item="{ element }">
<li >
  <TaskComponent v-if="element" :taskObjectProp="element"  class="task-comp" @detail-clicked="showTaskDetailModal" /> 
</li>
 

</template>
        </Draggable>



      </li>

    </template>
  </Draggable>


<v-snackbar v-model="categorieStateGood" :timeout=2000 color="success" >
 {{snackBarTesxt}} reordered !
</v-snackbar>

<v-snackbar v-model="categorieStateBad" :timeout=1000 color="red">
  {{snackBarTesxt}} not reordered !
 </v-snackbar>
 </template>

<script setup>
import { ref, computed, watch } from "vue";

import { useRoute } from 'vue-router'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import MoreIcon from "vue-material-design-icons/PlusCircleOutline.vue";
import EyeIcon from "vue-material-design-icons/Eye.vue";
import PaperAttach from "vue-material-design-icons/PlusCircleOutline.vue";
import MessageDialog from "vue-material-design-icons/Message.vue";
import DetailIcon from "vue-material-design-icons/DotsHorizontal.vue";
import { VCol } from "vuetify/lib/components/index.mjs";
import { VContainer } from "vuetify/lib/components/index.mjs";
import { VMenu } from "vuetify/lib/components/index.mjs";
import { VSelect } from "vuetify/lib/components/index.mjs";
import { VList } from "vuetify/lib/components/index.mjs";
import { faMessage as farFaMessage } from "@fortawesome/free-solid-svg-icons";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Draggable from "vuedraggable";
import TaskComponent from "./TaskComponent.vue";
import store from "../store";
import { VSnackbar } from "vuetify/lib/components/index.mjs";

// Assuming 'elementValue' is a prop passed to this component
const props = defineProps(['items']);
const items = ref(props.items);
const taskitems = items.tasks
const categorieStateGood = ref(false)
const categorieStateBad = ref(false)

const route = useRoute();
const activeItem = ref(null)
const hoveredContainer = ref(false)
const taskModalCliked = ref(false)
const snackBarTesxt = ref("")
// Props


const dragOptions = {
  direction: 'vertical', // Set the direction to vertical
};
const handleItemClick = (value) => {
  activeItem.value = value;
}

const emit = defineEmits(['update-clicked', 'task-detail-clicked'])

const handleClick = (dashboardData) => {
  emit('update-clicked', dashboardData);

}

const getStyle = (colorValue) => {

  return {
    background: colorValue,
  };
};

// onChange Event 
const onChange = async (e)=>{


let item =  e.moved ;
console.log("item new value", item.newValue);

if (!item) return;

let index = item.newIndex;
let prevCard = items.value[index-1];
let nextCard = items.value[index+1];
let card = items.value[index];
let categoryPatchingStatus = false; 
let position =  card.indexNumber



if(prevCard && nextCard){
  position = (parseFloat(prevCard.indexNumber) + parseFloat( nextCard.indexNumber))/2;
  console.log("Preview index ", prevCard.indexNumber);
console.log("Next index ", nextCard.indexNumber);
}
else if(prevCard){
  position = parseFloat(prevCard.indexNumber) + (parseFloat(prevCard.indexNumber)/2);
  

}
else if (nextCard){
  position = (parseFloat(nextCard.indexNumber)/2);
  console.log("Preview index ", nextCard.indexNumber);
}
console.log("Id position ", position);

categoryPatchingStatus = await store.dispatch('patchCategoriePosition', {id:card.id, position:parseFloat(position)});

if (categoryPatchingStatus){
categorieStateGood.value=true
snackBarTesxt.value = "Column"
}
else{
  categorieStateBad.value= true
  snackBarTesxt.value = "Column"
}
 
}
const onChangeTask = async (e, element)=>{
let item = e.added || e.moved;
console.log("event ", e)
if (!item)return;



let index = item.newIndex;
let activeCategorie = items.value.find(ele=>  ele.id==item.element.taskCategorie);

// identifier les cards
let prevCard = activeCategorie.tasks[index-1];
let nextCard = activeCategorie.tasks[index+1];
let card = activeCategorie.tasks[index];
let taskPatchingStatus = false; 
let position =  card? card.position : 0;
let categoriId = null
//calculer la position  pour procéder à la modification
if (e.added){
  categoriId =element.id
  console.log("new caategorie id", categoriId);
}
else{
  categoriId=null
}

if(prevCard && nextCard){
  position = (parseFloat(prevCard.position) + parseFloat( nextCard.position))/2;
}
else if(prevCard){
  position = parseFloat(prevCard.position) + (parseFloat(prevCard.position)/2);
  

}
else if (nextCard){
  position = (parseFloat(nextCard.position)/2);

}
else{
  position ="60000.00"
  card=item.element
  console.log("task categorie ", card.taskCategorie);
}
taskPatchingStatus = await store.dispatch('patchTaskPosition', {id:card.id, position:parseFloat(position), categorie: categoriId !=null?categoriId:card.taskCategorie});

if (taskPatchingStatus){
  snackBarTesxt.value = "Task"
categorieStateGood.value=true
}
else{
  snackBarTesxt.value = "Task not"
  categorieStateBad.value= true
}



  
}


const showTaskDetailModal = (taskData)=>{
  console.log("Task detail clicked ", taskData.id);
  taskModalCliked.value = true

  emit('task-detail-clicked', taskData);
}


watch(() => props.items, (newValue) => {
  items.value = newValue;
},

);
</script>

<style scoped>
.dash-box {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.more-vert-icon {
  display: none;
}

.dashBoard-container:hover .menu-icon {
  display: block;
}

.drag-task>div {
  transform: rotate(5deg);
  cursor: move;


}


.ghost-task {
  background: lightgray;
  border-radius: 6px;

}
.ghost .drag-task {
visibility: hidden;
}

.ghost {
  background: lightgray;
  border-radius: 6px;
  min-height: 500px;
}

.ghost .task-comp {
  visibility: hidden;
}


.ghost >div {
  visibility: hidden;
}

.container {
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
    scrollbar-width: none;  /* Firefox */
}
.drag-container::-webkit-scrollbar { 
    display: none;  /* Safari and Chrome */
}
.container::-webkit-scrollbar-track {
  background-color: red; /* Color of the track */
}

.dragab:hover{
cursor: pointer;
}
</style>