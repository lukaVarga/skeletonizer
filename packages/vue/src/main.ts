import { createApp } from 'vue';
import skeletonizer from './lib/main';
import App from './App.vue';
import './assets/main.css';

createApp(App)
  .use(skeletonizer)
  .mount('#app');
