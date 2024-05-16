// actions.js

import { userService } from "../helpers/user.service";
import { apiRequest } from "../helpers/api-call";
export async function loginUser({ commit }, loginData) {
  try {
    const response = await userService.login(loginData.email, loginData.password);
 
    if (response.data.token) {
      localStorage.setItem('userToken', response.data.token);
      commit('setLoggedUserToken', response.data.token);
    
      return true; // Return true for successful login
    } else {
      commit('setLoggedUserToken', '');
      return false; // Return false for unsuccessful login
    }
  } catch (error) {
    console.error('Error logging in:', error);
    commit('setLoggedUserToken', '');
    return false; // Return false for any error during login
  }
}


export async function getDashboardList({ commit }) {
  try {
    const response = await  apiRequest(
      "GET",
      "api/dashboard/dashboard-list/",
      undefined,
      false
    );
    console.log("la réponse", response);
    if (response.data) {
      commit('setDashboardList', response.data);
    
      return true; // Return true for successful login
    } else {
      commit('setDashboardList', '');
      return false; // Return false for unsuccessful login
    }
  } catch (error) {
    console.error('Error logging in:', error);
    commit('setDashboardList', '');
    return false; // Return false for any error during login
  }
}


export async function addDashboard({ commit }, dashObject) {
  try {
    const response = await  apiRequest(
      "POST",
      "api/dashboard/dashboard-create/",
      {
        bordName:dashObject.bordName,
        bordDescription:dashObject.bordDescription
      },
      false
    );
    console.log("la réponse", response);
    if (response.data) {
    
    
      return true; // Return true for successful login
    } else {
     
      return false; // Return false for unsuccessful login
    }
  } catch (error) {
    console.error('Error logging in:', error);
 
    return false; // Return false for any error during login
  }
}


export async function updateDashboard({ commit }, dashObject) {
  try {
    const response = await  apiRequest(
      "PUT",
      "api/dashboard/dashboard-update/"+dashObject.id,
      {
        
        bordName:dashObject.bordName.trim(),
        bordDescription:dashObject.bordDescription.trim()
      },
      false
    );
    console.log("la réponse", response);
    if (response.data) {
    
    
      return true; // Return true for successful login
    } else {
     
      return false; // Return false for unsuccessful login
    }
  } catch (error) {
    console.error('Error logging in:', error);
 
    return false; // Return false for any error during login
  }
}

export async function detailDashboard({ commit }, dashId) {
  try {
    const response = await  apiRequest(
      "GET",
      "api/dashboard/dashboard-list/"+dashId,
     null,
      false
    );
    console.log("la réponse", response);
    if (response.data) {
      commit('setDashboardDetail', response.data);
   
      return true; // Return true for successful login
    } else {
     
      return false; // Return false for unsuccessful login
    }
  } catch (error) {
    console.error('Error logging in:', error);
 
    return false; // Return false for any error during login
  }
}



export async function patchCategoriePosition({ commit }, category) {
  try {
    const response = await  apiRequest(
      "PATCH",
      "api/dashboard/category-patch/"+category.id,
      {
        
        indexNumber:category.position < 0.00002? 60000.00:category.position,
       
      },
      false
    );
    console.log("la réponse", response);
    if (response.data) {
    
    
      return true; // Return true for successful login
    } else {
     
      return false; // Return false for unsuccessful login
    }
  } catch (error) {
    console.error('Error patching position value: ', error);
 
    return false; // Return false for any error during login
  }
}


export async function patchTaskPosition({ commit }, task) {
  try {
    const response = await  apiRequest(
      "PATCH",
      "api/tasks/task-patch/"+task.id,
      {
        
        position:task.position < 0.00002? 60000.00:task.position,
        taskCategorie : task.categorie
       
      },
      false
    );
    console.log("la réponse", response);
    if (response.data) {
    
    
      return true; // Return true for successful login
    } else {
     
      return false; // Return false for unsuccessful login
    }
  } catch (error) {
    console.error('Error patching position value: ', error);
 
    return false; // Return false for any error during login
  }
}


export async function addCategory({ commit }, categorieObject) {
  try {
    const response = await  apiRequest(
      "POST",
      "api/dashboard/category-create",
      {
        name:categorieObject.name,
        indexColor:categorieObject.indexColor,
        dashboard:categorieObject.dashboard
      },
      false
    );
    console.log("la réponse", response);
    if (response.data) {
    
    
      return true; // Return true for successful login
    } else {
     
      return false; // Return false for unsuccessful login
    }
  } catch (error) {
    console.error('Error during the save operation:', error);
 
    return false; // Return false for any error during login
  }
}


export async function addTask({ commit }, taskObject) {
  const formData = new FormData()
  formData.append("title" , taskObject.title)
  formData.append("badgeColor", taskObject.badgeColor)
  formData.append("taskCategorie" , taskObject.taskCategory)
  formData.append("tags" , taskObject.tags)
  formData.append("deadline" , taskObject.deadline)
 
  try {
    const response = await  apiRequest(
      "POST",
      "api/tasks/task-create/",
      
        formData
      ,
      { "Content-Type": "multipart/form-data" }
    );
    console.log("la réponse", response);
    if (response.data) {
    
    
      return true; // Return true for successful login
    } else {
     
      return false; // Return false for unsuccessful login
    }
  } catch (error) {
    console.error('Error during the save operation:', error);
 
    return false; // Return false for any error during login
  }
}

export async function detailTask({ commit }, taskId) {
  try {
    const response = await  apiRequest(
      "GET",
      "api/tasks/task-detail/"+taskId,
     null,
      false
    );
    console.log("la réponse", response);
    if (response.data) {
      commit('setTaskDetail', response.data);
   
      return true; // Return true for successful login
    } else {
     
      return false; // Return false for unsuccessful login
    }
  } catch (error) {
    console.error('Error logging in:', error);
 
    return false; // Return false for any error during login
  }
}


export async function patchTask({ commit }, taskObj) {
  const formDatas = new FormData()
  formDatas.append("title" , taskObj.title)
  formDatas.append("description", taskObj.description)

  if (taskObj.uploaded_file && taskObj.uploaded_file.length > 0) {
    console.log("let go ", taskObj.uploaded_file);
    taskObj.uploaded_file.forEach(file => {
      formDatas.append("uploaded_files", file, file.name);
    });
  }
console.log("form Data ", formDatas)
  try {
    const response = await  apiRequest(
      "PATCH",
      "api/tasks/task-patch/"+taskObj.id,
      formDatas
    
    );
    console.log("la réponse", response);
    if (response.data) {
      commit('setTaskDetail', response.data);
    
      return true; // Return true for successful login
    } else {
     
      return false; // Return false for unsuccessful login
    }
  } catch (error) {
    console.error('Error logging in:', error);
 
    return false; // Return false for any error during login
  }
}


export async function addTaskComment({ commit }, taskObject) {
  
  try {
    const response = await  apiRequest(
      "POST",
      "api/tasks/taskcomment-create/",
      
        {
          text:taskObject.text,
          task:taskObject.task
      }
      ,
      false
    );
    console.log("la réponse", response);
    if (response.data) {
    
    
      return true; // Return true for successful login
    } else {
     
      return false; // Return false for unsuccessful login
    }
  } catch (error) {
    console.error('Error during the save operation:', error);
 
    return false; // Return false for any error during login
  }
}