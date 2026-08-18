<template>

        <div class="task-container w-full pt-6 bg-white rounded-[6px] p-3 mt-3 relative">
          <div class="bar-color grid grid-cols-3 gap-2 "  >
            <div   class=" rounded-sm h-1 w-full" :style="`background :${ele}`" v-for="(ele,index) in taskObjectProp.badgeColor[0].split(',')" :key="index">
            </div>



          </div>
          <h3 class="text-left mt-3 font-mono font-semibold leading-5 text-[15px] text-black">{{taskObjectProp.title}}</h3>
          <img   :src="imageFile" class="mt-3 w-100 h-[210px] rounded-[14px] object-cover"
            alt="">
          <div class="tags flex grid-cols-4 mt-4 gap-2" >
            <div class="tag  p-1 px-2 bg-task-home-bg rounded-[200px] font-mono font-light leading-5 text-[14px]" >
              + Tag
            </div>
            <div>
                
            </div>
            <div
            v-for="(tag, index) in taskObjectProp.tags[0].split(',')" :key="index"
              class="tag p-1  px-2 bg-task-tag-violet text-task-tag-text-violet rounded-[500px] font-mono font-light leading-5 text-[14px]">
              {{tag}}
            </div>
           
          </div>
          <div class="assign font-mono font-bold text-[17px] flex mt-3 items-center  justify-between">

            <!-- Assignee avatar (real user, not a placeholder). Falls back to
                 an "unassigned" hint when the task has no assign_To. -->
            <div class="relative flex p-0 items-center">
              <div
                v-if="assigneeUser"
                class="w-[32px] h-[32px] rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                :style="{ backgroundColor: assigneeUser.profile_image ? 'transparent' : '#007AFF' }"
                :title="assigneeUser.name || assigneeUser.email"
              >
                <img
                  v-if="assigneeUser.profile_image"
                  :src="assigneeAvatarUrl"
                  :alt="assigneeUser.name || 'avatar'"
                  class="w-full h-full object-cover"
                />
                <span
                  v-else
                  class="text-white font-mono font-bold"
                  style="font-size: 13px; line-height: 1;"
                >
                  {{ assigneeInitial }}
                </span>
              </div>
              <div
                v-else
                class="w-[32px] h-[32px] rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-normal text-[16px]"
                title="Non assignée"
              >
                +
              </div>
            </div>
            <div class="font-mono  text-[14px] font-medium leading-4 text-task-black ml-5 ">{{ taskObjectProp.deadline  }}</div>
            <div class="end-tag flex gap-1 items-center ">
              <FontAwesomeIcon :icon="farFaMessage" class="text-task-tag-end-color" />
              <span class="text-task-tag-end-color">{{ taskObjectProp.comments.length }}</span>
              <FontAwesomeIcon :icon="faPaperclip" class=" ml-2 text-task-tag-end-color" />

              <span class="text-task-tag-end-color">{{ taskObjectProp.files.length }}</span>

            </div>
          </div>
        <component :is="Eye"  :size=20 class="z-10 detail-icon cursor-pointer font-light absolute top-[0.95rem] text-gray-500  right-[0.55rem]" 
        @click="handleClick(taskObjectProp)"
        />

        </div>
        <modal :show="modelValue" @show="onShow" max-width="lg" class="my-auto">
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
</template>

<script setup>
import Eye from "vue-material-design-icons/Eye.vue"
import Modal from "../components/Modal.vue";
import { VProgressCircular } from "vuetify/lib/components/index.mjs";
import CloseCircle from "vue-material-design-icons/CloseCircleOutline.vue";
import CloseCircleSpan from "vue-material-design-icons/CloseCircle.vue";
import { VSelect } from "vuetify/lib/components/index.mjs";
import { VList } from "vuetify/lib/components/index.mjs";
import { faMessage as farFaMessage } from "@fortawesome/free-solid-svg-icons";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { computed } from "vue";
import store from "../store";
import { apiUrl } from "../helpers/api-call";

const props = defineProps({
  taskObjectProp: {
    type: Object,
    required: true,
  },
});


const emit = defineEmits(['detail-clicked'])

const handleClick = (taskData) => {
  emit('detail-clicked', taskData);

}

// Extensions d’images à reconnaître
const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']

const imageFile = computed(() => {
  const files = props.taskObjectProp?.files || []

  const img = files.find(file => {
    const ext = file.file.split('.').pop().toLowerCase()
    return imageExtensions.includes(ext)
  })

  return img ? `${apiUrl}${img.file}` : new URL('../assets/images/task_image.jpg', import.meta.url).href
})

// --- Assignee avatar ------------------------------------------------------
// Look up the assignee's full record in the shared usersList so we can show
// the real profile image (or an initial fallback) on the card, instead of
// a hardcoded placeholder.

const assigneeUser = computed(() => {
  const id = props.taskObjectProp?.assign_To;
  if (id == null) return null;
  const list = store.state.usersList || [];
  return list.find((u) => u.id === id) || null;
});

const assigneeAvatarUrl = computed(() => {
  const path = assigneeUser.value?.profile_image;
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return apiUrl + (path.startsWith('/') ? path : '/' + path);
});

const assigneeInitial = computed(() => {
  const u = assigneeUser.value;
  if (!u) return '?';
  const source = u.name || u.email || '?';
  return source.charAt(0).toUpperCase();
});

</script>

<style  scoped>
.ghost-task >div {
  visibility: hidden;
}
.ghost-task {
  background: lightgray;
  border-radius: 6px;

}

.drag-task>div {
  transform: rotate(5deg);


}
.detail-icon{
  display: none;

}

.task-container:hover .detail-icon{
display: inline;
}

</style>