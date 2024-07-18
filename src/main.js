const {createApp} = Vue;
import router from './router.js';

const app = createApp();

app.use(router).mount('#app');