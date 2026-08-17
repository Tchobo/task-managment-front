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
  group="tasks"
  item-key="id"
  class="drag-container cursor-grab"
  tag="ul"
  drag-class="drag-task"
  ghost-class="ghost-task"
  :options="dragOptions"
  @change="onChangeTask($event, element)"
>
  <template #item="{ element }">
    <li>
      <TaskComponent 
        v-if="element" 
        :taskObjectProp="element"  
        class="task-comp" 
        @detail-clicked="showTaskDetailModal" 
      /> 
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
  direction: 'vertical',
  // Force Sortable.js fallback mode (mouse-simulated drag instead of native
  // HTML5 drag). Native HTML5 drag lets the browser own the cursor style,
  // ignoring our CSS `cursor: grabbing`. Fallback mode uses a real DOM clone
  // that we can style via .sortable-drag / .drag-task, so the closed-hand
  // cursor actually shows while dragging.
  forceFallback: true,
  fallbackTolerance: 3,
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

if (!item) return;

let index = item.newIndex;
let prevCard = items.value[index-1];
let nextCard = items.value[index+1];
let card = items.value[index];
let categoryPatchingStatus = false; 
let position =  card.indexNumber



if(prevCard && nextCard){
  position = (parseFloat(prevCard.indexNumber) + parseFloat( nextCard.indexNumber))/2;

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
// Position algorithm — fractional indexing with safety rails.
// - STEP = default gap between neighbour positions
// - DB stores 5 decimals (DecimalField(decimal_places=5)), so we round to
//   avoid silent truncation & collisions
// - When the gap between neighbours becomes dangerously narrow, we ask the
//   backend to rebalance the whole category and refresh — cleaner than
//   fighting a nearly-collided sequence forever.
const POSITION_STEP = 60000;
const MIN_GAP = 0.001;

function roundToDbPrecision(value) {
  return Math.round(value * 1e5) / 1e5;
}

const onChangeTask = async (e, element) => {
  const item = e.added || e.moved;
  if (!item) return;

  const index = item.newIndex;
  const activeCategorie = items.value.find(ele => ele.id == item.element.taskCategorie);
  if (!activeCategorie) return;

  const prevCard = activeCategorie.tasks[index - 1];
  const nextCard = activeCategorie.tasks[index + 1];
  const card = activeCategorie.tasks[index] || item.element;

  const categoriId = e.added ? element.id : null;

  let position;
  let needsRebalance = false;

  if (prevCard && nextCard) {
    // Insert between two cards: midpoint, but flag if the gap is too small.
    const prev = parseFloat(prevCard.position);
    const next = parseFloat(nextCard.position);
    position = (prev + next) / 2;
    if (Math.abs(next - prev) < MIN_GAP) {
      needsRebalance = true;
    }
  } else if (prevCard) {
    // Append at the end: fixed step (linear growth, safe for a long time).
    position = parseFloat(prevCard.position) + POSITION_STEP;
  } else if (nextCard) {
    // Insert at the beginning: subtract a fixed step if there's room, else halve.
    const next = parseFloat(nextCard.position);
    position = next > POSITION_STEP * 2 ? next - POSITION_STEP : next / 2;
    if (position < MIN_GAP) {
      needsRebalance = true;
    }
  } else {
    // Empty category (only one card, the one being dropped in).
    position = POSITION_STEP;
  }

  position = roundToDbPrecision(position);

  const targetCategoryId = categoriId !== null ? categoriId : card.taskCategorie;

  // If the gap is too small to represent safely, rebalance the target category
  // (evens out all positions to STEP, 2*STEP, 3*STEP, …), then reload the
  // dashboard so the local state reflects the new positions. The user's move
  // has been persisted visually by vuedraggable; rebalance keeps it consistent.
  if (needsRebalance) {
    const ok = await store.dispatch('rebalanceCategory', targetCategoryId);
    if (ok) {
      snackBarTesxt.value = 'Positions rebalanced';
      categorieStateGood.value = true;
      // Trigger a dashboard refetch so cards show their fresh positions
      const dashSlug = route.params.slug;
      if (dashSlug) {
        await store.dispatch('detailDashboard', dashSlug);
      }
      return;
    }
    // If rebalance failed, fall through to the normal patch — better than nothing.
  }

  const taskPatchingStatus = await store.dispatch('patchTaskPosition', {
    id: card.id,
    position: position,
    categorie: targetCategoryId,
  });

  if (taskPatchingStatus) {
    snackBarTesxt.value = 'Task';
    categorieStateGood.value = true;
  } else {
    snackBarTesxt.value = 'Task not';
    categorieStateBad.value = true;
  }
};


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

/* During drag: rotate the card + force closed-hand cursor everywhere in the
   dragged element and its clone (Sortable.js adds `.sortable-drag` to the
   floating clone that follows the mouse). !important is needed because child
   components (TaskComponent) set their own cursor: pointer. */
.drag-task > div {
  transform: rotate(5deg);
}
.drag-task,
.drag-task *,
.sortable-drag,
.sortable-drag * {
  cursor: grabbing !important;
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