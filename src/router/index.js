import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Notification from '../views/Notification.vue'
import Profile from '../views/Profile.vue'
import Task from '../views/Task.vue'
import store from "../store";




  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
routes:[
  
    {
      path: '/',
      name: 'Login',
      component: Login,
      meta:{
        title:"Login"
      }     
    },
    {
      
      path: '/taskmanager',
      beforeEnter:(to, from, next) =>{
        localStorage.getItem('userToken') ? next() : next('/')
      },   
      children:[
        {
        path:'',
        component:Home,
        name:'Dashboard',
        meta:{
          title:"Dashboard"
        }    
        },
        {
          path:'/tasks/:slug',
          component:Task,
          name:'Task Active',
          meta:{
            title:"Task Active"
          }    
          },

          {
            path:'notifications',
            component:Notification,
            name:'Notifications',
            meta:{
              title:"Notifications"
            }    
            },

            {
              path:'profile',
              component:Profile,
              name:'Profile',
              meta:{
                title:"Profile"
              }    
              },
       
      ],
    },
  ]

})
   
  



router.beforeEach((to, from, next)=>{
  document.title = `${to.params.slug ? to.params.slug: to.meta.title} | Taskello`;
  next();
});
  

export default router
