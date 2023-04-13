import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import Toasted from 'vue-toasted';
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

Vue.config.productionTip = false;

Vue.use(Toasted,{
  duration:1500,
});

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app');
