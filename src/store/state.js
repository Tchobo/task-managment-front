// state.js

export default {
  dashboardList: [],
  userToken: "",
  userIsLoging: false,
  currentDashboard: null,
  dashboardDetail: {}, // Objet au lieu de tableau
  taskDetail: {}, // Objet au lieu de tableau
  // List of all active users (fetched once from /api/user/list/). Shared here
  // so any component (assignee picker, task card, comment avatar...) can look
  // up user details by id without prop-drilling.
  usersList: [],
}