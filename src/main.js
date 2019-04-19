import Vue from 'vue'
import Vuex from 'vuex'
import { Button,List,Avatar,Icon,Input,Badge,Tabs,Pagination,Popover,Tooltip } from 'ant-design-vue';
import App from './App.vue'
import router from './router'
import '@/static/scrollbars-firefox.css'
import store from './store/store'
import '@/assets/font/iconfont.css'

Vue.component(Button.name, Button);
Vue.component(List.name, List);
Vue.component(List.Item.name, List.Item);
Vue.component(List.Item.Meta.name, List.Item.Meta);
Vue.component(Avatar.name, Avatar);
Vue.component(Icon.name, Icon);
Vue.component(Input.name, Input);
Vue.component(Badge.name, Badge);
Vue.component(Tabs.name, Tabs);
Vue.component(Tabs.TabPane.name, Tabs.TabPane);
Vue.component(Input.TextArea.name, Input.TextArea);
Vue.component(Pagination.name, Pagination); // 分页
Vue.component(Popover.name, Popover); // 气泡卡片
Vue.component(Tooltip.name, Tooltip); // 文字提示






Vue.config.productionTip = false
Vue.use(Vuex);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
