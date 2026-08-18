// actions.js

import { userService } from "../helpers/user.service";
import { apiRequest } from "../helpers/api-call";
import store from "../store";

export async function loginUser({ commit }, loginData) {
  try {
    const response = await userService.login(loginData.email, loginData.password);
 
    if (response.data.token) {
      localStorage.setItem('userToken', response.data.token);
      commit('setLoggedUserToken', response.data.token);
      return true;
    } else {
      commit('setLoggedUserToken', '');
      return false;
    }
  } catch (error) {
    console.error('Error logging in:', error);
    commit('setLoggedUserToken', '');
    return false;
  }
}

export async function getDashboardList({ commit }) {
  try {
    const response = await apiRequest(
      "GET",
      "api/dashboard/dashboard-list/",
      undefined,
      false
    );
    
    
    if (response.data) {
      commit('setDashboardList', response.data);
      return true;
    } else {
      commit('setDashboardList', []);
      return false;
    }
  } catch (error) {
    console.error('Error getting dashboard list:', error);
    commit('setDashboardList', []);
    return false;
  }
}

export async function addDashboard({ commit }, dashObject) {
  try {
    const response = await apiRequest(
      "POST",
      "api/dashboard/dashboard-create/",
      {
        bordName: dashObject.bordName,
        bordDescription: dashObject.bordDescription
      },
      false
    );
    
    
    if (response.data) {
      commit('addDashboardToList', response.data);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error adding dashboard:', error);
    return false;
  }
}

export async function updateDashboard({ commit }, dashObject) {
  try {
    const response = await apiRequest(
      "PUT",
      "api/dashboard/dashboard-update/" + dashObject.id,
      {
        bordName: dashObject.bordName.trim(),
        bordDescription: dashObject.bordDescription.trim()
      },
      false
    );
    
    
    if (response.data) {
      commit('updateDashboardInList', response.data);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error updating dashboard:', error);
    return false;
  }
}

export async function detailDashboard({ commit }, dashId) {
  try {
    
    const response = await apiRequest(
      "GET",
      "api/dashboard/dashboard-list/" + dashId,
      null,
      false
    );
    
    
    if (response.data) {
      // Vérifier si les catégories existent
      if (!response.data.categories) {
        console.warn('⚠️ Attention: Le dashboard ne contient pas de catégories');
        response.data.categories = [];
      } else {
        
        // Vérifier si chaque catégorie a des tâches
        response.data.categories.forEach((cat, index) => {
          if (!cat.tasks) {
            console.warn(`⚠️ La catégorie "${cat.name}" n'a pas de tâches`);
            cat.tasks = [];
          } else {
          }
        });
      }
      
      commit('setDashboardDetail', response.data);
      return true;
    } else {
      console.error('❌ Pas de données dans la réponse');
      commit('setDashboardDetail', null);
      return false;
    }
  } catch (error) {
    console.error('❌ Error getting dashboard detail:', error);
    commit('setDashboardDetail', null);
    return false;
  }
}

export async function patchCategoriePosition({ commit }, category) {
  try {
    const response = await apiRequest(
      "PATCH",
      "api/dashboard/category-patch/" + category.id,
      {
        indexNumber: category.position < 0.00002 ? 60000.00 : category.position,
      },
      false
    );
    
    
    if (response.data) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error patching position value:', error);
    return false;
  }
}

export async function patchTaskPosition({ commit }, task) {
  try {
    // Position is computed on the frontend (see TaskCategory.vue onChangeTask),
    // then rounded to 5 decimals (matching the DB DecimalField precision) so
    // there's no silent truncation. We no longer force position=60000 when it
    // gets too small — that was misplacing cards. When gaps become dangerously
    // narrow, the frontend triggers rebalanceCategory instead.
    const response = await apiRequest(
      "PATCH",
      "api/tasks/task-patch/" + task.id,
      {
        position: task.position,
        taskCategorie: task.categorie,
      },
      false
    );

    if (response.data) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error patching position value:', error);
    return false;
  }
}

export async function fetchUsersList({ commit }) {
  try {
    const response = await apiRequest("GET", "api/user/list/", null, false);
    if (response && response.status === 200) {
      commit("setUsersList", response.data || []);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error fetching users list:", error);
    return false;
  }
}

export async function rebalanceCategory({ commit }, categoryId) {
  try {
    const response = await apiRequest(
      "POST",
      "api/tasks/rebalance-category/" + categoryId + "/",
      {},
      false
    );
    return response && response.status === 200;
  } catch (error) {
    console.error('Error rebalancing category positions:', error);
    return false;
  }
}

export async function addCategory({ commit }, categorieObject) {
  try {
    
    const response = await apiRequest(
      "POST",
      "api/dashboard/category-create",
      {
        name: categorieObject.name,
        indexColor: categorieObject.indexColor,
        dashboard: categorieObject.dashboard
      },
      false
    );
    
    
    if (response.data) {
      // Recharger les détails du dashboard pour avoir la nouvelle catégorie
      // Note: Vous devriez idéalement avoir l'ID du dashboard dans categorieObject
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error during the save operation:', error);
    return false;
  }
}

export async function updateCategory({ commit }, categorieObject) {
  try {
    
    const response = await apiRequest(
      "PUT",
      "api/dashboard/category-update/" + categorieObject.id,
      {
        name: categorieObject.name,
        indexColor: categorieObject.indexColor,
        dashboard: categorieObject.dashboard
      },
      false
    );
    
    
    if (response.data) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error updating category:', error);
    return false;
  }
}

export async function addTask({ commit }, taskObject) {
  try {

    const formData = new FormData();
    formData.append("title", taskObject.title);
    formData.append("badgeColor", taskObject.badgeColor);
    formData.append("taskCategorie", taskObject.taskCategory);
    formData.append("tags", taskObject.tags);
    formData.append("deadline", taskObject.deadline);
    // Only send assign_To when actually set — backend defaults to null otherwise.
    if (taskObject.assign_To != null && taskObject.assign_To !== "") {
      formData.append("assign_To", taskObject.assign_To);
    }

    const response = await apiRequest(
      "POST",
      "api/tasks/task-create/",
      formData,
      { "Content-Type": "multipart/form-data" }
    );
    
    
    if (response.data && response.data.status==201 ) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error during the save operation:', error);
    return false;
  }
}

export async function updateTask({ commit }, taskObject) {
  try {

    const formData = new FormData();
    formData.append("title", taskObject.title);
    formData.append("badgeColor", taskObject.badgeColor);
    formData.append("tags", taskObject.tags);
    formData.append("deadline", taskObject.deadline);

    if (taskObject.description) {
      formData.append("description", taskObject.description);
    }
    // Send assign_To as user id, or empty string to clear it. DRF's
    // PrimaryKeyRelatedField converts "" to null when allow_null is on
    // (which it is, since the model field has null=True, blank=True).
    formData.append(
      "assign_To",
      taskObject.assign_To != null ? taskObject.assign_To : ""
    );

    const response = await apiRequest(
      "PUT",
      "api/tasks/task-update/" + taskObject.id,
      formData,
      { "Content-Type": "multipart/form-data" }
    );
    
    
    if (response.data) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error updating task:', error);
    return false;
  }
}

export async function detailTask({ commit }, taskId) {
  try {
    
    const response = await apiRequest(
      "GET",
      "api/tasks/task-detail/" + taskId,
      null,
      false
    );
    
    
    if (response.data) {
      // S'assurer que comments existe
      if (!response.data.comments) {
        response.data.comments = [];
      }
      
      commit('setTaskDetail', response.data);
      return true;
    } else {
      commit('setTaskDetail', null);
      return false;
    }
  } catch (error) {
    console.error('Error getting task detail:', error);
    commit('setTaskDetail', null);
    return false;
  }
}

export async function patchTask({ commit }, taskObj) {
  try {

    const formDatas = new FormData();
    formDatas.append("title", taskObj.title);
    formDatas.append("description", taskObj.description);
    // Include assign_To on every patch — empty string clears the assignment.
    formDatas.append(
      "assign_To",
      taskObj.assign_To != null ? taskObj.assign_To : ""
    );

    if (taskObj.uploaded_file && taskObj.uploaded_file.length > 0) {
      taskObj.uploaded_file.forEach(file => {
        formDatas.append("uploaded_files", file, file.name);
      });
    }

    const response = await apiRequest(
      "PATCH",
      "api/tasks/task-patch/" + taskObj.id,
      formDatas
    );
    
    
    if (response.data) {
      commit('setTaskDetail', response.data);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error patching task:', error);
    return false;
  }
}

export async function deleteTask({ commit }, taskId) {
  try {
    
    const response = await apiRequest(
      "DELETE",
      "api/tasks/task-delete/" + taskId,
      null,
      false
    );
    
    
    if (response.status === 200 || response.status === 204) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    return false;
  }
}

export async function addTaskComment({ commit }, taskObject) {
  try {
    
    const response = await apiRequest(
      "POST",
      "api/tasks/taskcomment-create/",
      {
        text: taskObject.text,
        task: taskObject.task
      },
      false
    );
    
    
    if (response.data) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error during the save operation:', error);
    return false;
  }
}