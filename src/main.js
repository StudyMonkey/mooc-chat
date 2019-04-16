import Vue from 'vue'
import { Button,List,Avatar,Icon } from 'ant-design-vue';
import App from './App.vue'
import router from './router'

Vue.component(Button.name, Button);
Vue.component(List.name, List);
Vue.component(List.Item.name, List.Item);
Vue.component(List.Item.Meta.name, List.Item.Meta);
Vue.component(Avatar.name, Avatar);
Vue.component(Icon.name, Icon);




Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
