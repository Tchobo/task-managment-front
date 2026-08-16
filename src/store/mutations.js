export function setLoggedUserToken(state, token) {
  state.userToken = token || "";
}

export function setDashboardList(state, dashboardList) {
  state.dashboardList = dashboardList || [];
}

export function addDashboardToList(state, newDashboard) {
  state.dashboardList.push(newDashboard);
}

export function setDashboardDetail(state, dashboardDetail) {
  
  // S'assurer que dashboardDetail n'est pas un tableau vide
  if (dashboardDetail && typeof dashboardDetail === 'object' && !Array.isArray(dashboardDetail)) {
    state.dashboardDetail = dashboardDetail;
  } else {
    console.warn('⚠️ Mutation: dashboardDetail invalide, initialisation à un objet vide');
    state.dashboardDetail = {};
  }
}

export function setTaskDetail(state, taskDetail) {
  
  // S'assurer que taskDetail n'est pas un tableau vide
  if (taskDetail && typeof taskDetail === 'object' && !Array.isArray(taskDetail)) {
    state.taskDetail = taskDetail;
  } else {
    console.warn('⚠️ Mutation: taskDetail invalide, initialisation à un objet vide');
    state.taskDetail = {};
  }
}

export function updateDashboardInList(state, updatedDashboard) {
  
  const index = state.dashboardList.findIndex(d => d.id === updatedDashboard.id);
  if (index !== -1) {
    // Remplace l'ancien objet par le nouveau
    state.dashboardList.splice(index, 1, updatedDashboard);
  } else {
    console.warn('⚠️ Dashboard non trouvé dans la liste');
  }
}

export function setCurrentDashboard(state, dashboard) {
  state.currentDashboard = dashboard;
}

export function clearDashboardDetail(state) {
  state.dashboardDetail = {};
}

export function clearTaskDetail(state) {
  state.taskDetail = {};
}