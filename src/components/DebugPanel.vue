<template>
  <div class="debug-panel" v-if="showDebug">
    <button @click="togglePanel" class="debug-toggle">
      {{ isOpen ? '✕' : '🐛' }} Debug
    </button>
    
    <div v-if="isOpen" class="debug-content">
      <h3>État du Store</h3>
      
      <div class="debug-section">
        <h4>Dashboard Detail</h4>
        <div class="debug-info">
          <p><strong>Existe:</strong> {{ !!dashboardDetail }}</p>
          <p><strong>ID:</strong> {{ dashboardDetail?.id || 'N/A' }}</p>
          <p><strong>Nom:</strong> {{ dashboardDetail?.bordName || 'N/A' }}</p>
          <p><strong>Catégories:</strong> {{ dashboardDetail?.categories?.length || 0 }}</p>
        </div>
        
        <div v-if="dashboardDetail?.categories" class="categories-debug">
          <div v-for="cat in dashboardDetail.categories" :key="cat.id" class="category-item">
            <p>📁 <strong>{{ cat.name }}</strong></p>
            <p class="ml-4">Tâches: {{ cat.tasks?.length || 0 }}</p>
            <p class="ml-4">Couleur: <span :style="`background:${cat.indexColor}`" class="color-box"></span> {{ cat.indexColor }}</p>
          </div>
        </div>
        
        <details class="json-details">
          <summary>Voir JSON complet</summary>
          <pre>{{ JSON.stringify(dashboardDetail, null, 2) }}</pre>
        </details>
      </div>
      
      <div class="debug-section">
        <h4>Dashboard List ({{ dashboardList.length }})</h4>
        <div class="debug-info">
          <div v-for="dash in dashboardList" :key="dash.id" class="dashboard-item">
            <p>📊 {{ dash.bordName }} (ID: {{ dash.id }})</p>
          </div>
        </div>
      </div>
      
      <div class="debug-section">
        <h4>Route</h4>
        <div class="debug-info">
          <p><strong>Name:</strong> {{ route.name }}</p>
          <p><strong>Params:</strong> {{ JSON.stringify(route.params) }}</p>
          <p><strong>Path:</strong> {{ route.path }}</p>
        </div>
      </div>
      
      <div class="debug-actions">
        <button @click="reloadDashboard" class="debug-btn">
          🔄 Recharger Dashboard
        </button>
        <button @click="logState" class="debug-btn">
          📝 Log State
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

const store = useStore();
const route = useRoute();

// Gate the panel behind Vite's DEV flag so it is stripped from prod builds.
const showDebug = ref(import.meta.env.DEV);
const isOpen = ref(true);

const dashboardDetail = computed(() => store.state.dashboardDetail);
const dashboardList = computed(() => store.state.dashboardList);

const togglePanel = () => {
  isOpen.value = !isOpen.value;
};

const reloadDashboard = async () => {
  const dashId = route.params.id;
  if (dashId) {
    console.log('🔄 Rechargement du dashboard:', dashId);
    await store.dispatch('detailDashboard', dashId);
    console.log('✅ Dashboard rechargé');
  } else {
    console.error('❌ Pas d\'ID dans la route');
  }
};

const logState = () => {
  console.log('=== STATE COMPLET ===');
  console.log('Dashboard Detail:', store.state.dashboardDetail);
  console.log('Dashboard List:', store.state.dashboardList);
  console.log('Task Detail:', store.state.taskDetail);
  console.log('Route:', route);
  console.log('====================');
};
</script>

<style scoped>
.debug-panel {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 9999;
  max-width: 400px;
}

.debug-toggle {
  background: #007AFF;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.debug-toggle:hover {
  background: #0056b3;
}

.debug-content {
  background: white;
  border: 2px solid #007AFF;
  border-radius: 8px;
  padding: 15px;
  margin-top: 10px;
  max-height: 600px;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.debug-content h3 {
  margin: 0 0 15px 0;
  color: #007AFF;
  font-size: 18px;
  border-bottom: 2px solid #007AFF;
  padding-bottom: 5px;
}

.debug-section {
  margin-bottom: 20px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
}

.debug-section h4 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 14px;
  font-weight: bold;
}

.debug-info {
  font-size: 12px;
  line-height: 1.6;
}

.debug-info p {
  margin: 5px 0;
  padding: 3px 0;
}

.debug-info strong {
  color: #007AFF;
}

.categories-debug {
  margin-top: 10px;
}

.category-item {
  background: white;
  padding: 8px;
  margin: 5px 0;
  border-radius: 4px;
  border-left: 3px solid #007AFF;
}

.category-item p {
  margin: 2px 0;
  font-size: 11px;
}

.ml-4 {
  margin-left: 16px;
}

.color-box {
  display: inline-block;
  width: 20px;
  height: 12px;
  border-radius: 2px;
  border: 1px solid #ccc;
  vertical-align: middle;
}

.dashboard-item {
  padding: 5px;
  margin: 3px 0;
  background: white;
  border-radius: 4px;
  font-size: 11px;
}

.json-details {
  margin-top: 10px;
  font-size: 11px;
}

.json-details summary {
  cursor: pointer;
  color: #007AFF;
  font-weight: bold;
  padding: 5px;
  background: white;
  border-radius: 4px;
}

.json-details pre {
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  margin-top: 5px;
  font-size: 10px;
  max-height: 300px;
}

.debug-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.debug-btn {
  flex: 1;
  background: #28a745;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
}

.debug-btn:hover {
  background: #218838;
}

.debug-content::-webkit-scrollbar {
  width: 6px;
}

.debug-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.debug-content::-webkit-scrollbar-thumb {
  background: #007AFF;
  border-radius: 10px;
}
</style>