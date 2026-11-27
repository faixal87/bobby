<template>
  <div id="app">
    <SideNav />
    <div class="app-body">
      <TopBar />
      <main class="app-main">
        <DashboardView />
      </main>
    </div>
  </div>
</template>

<script>
import SideNav       from './components/layout/SideNav.vue'
import TopBar        from './components/layout/TopBar.vue'
import DashboardView from './views/DashboardView.vue'

export default {
  name: 'App',
  components: { SideNav, TopBar, DashboardView }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body, #app {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

body {
  background: #070c1a;
  color: #c9dff0;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

#app {
  display: flex;
}

.app-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.app-main {
  flex: 1;
  overflow-y: auto;
  background: #070c1a;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #070c1a;
}
::-webkit-scrollbar-thumb {
  background: #1a2540;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #3d5a80;
}
</style>
