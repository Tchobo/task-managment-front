import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'vuetify/dist/vuetify.min.css'; // Ensure you have the correct path to the Vuetify CSS
import router from './router/index.js'; // Import your router configuration
import { createVuetify } from 'vuetify'; // Import createVuetify from Vuetify
 import draggable from 'vuedraggable'
 import CKEditor from '@ckeditor/ckeditor5-vue';


const app = createApp(App);

const vuetify = createVuetify();

app.component('draggable', draggable)

app.use(vuetify);
app.use(router);
app.use( CKEditor )

app.mount('#app')
