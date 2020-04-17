import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import { Button, Input } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

Vue.component(Button.name, Button);
Vue.component(Input.name, Input);
Vue.component(Input.Password.name, Input.Password);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
