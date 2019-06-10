import Vue from 'vue'
import Vuex from 'vuex'
import { Button,List,Avatar,Icon,Input,Badge,Tabs,Pagination,Popover,Tooltip,message,Modal,Select,Upload, Checkbox,Radio } from 'ant-design-vue';
import App from './App.vue'
import router from './router'
import store from './store/store'
import '@/assets/font/iconfont.css'
import { getData, postData, timeFormat } from './utils/utils'
import { emoji } from './utils/emoji.js'
// import "../http-interceptor"
// import ws from '@/utils/ws.js'

Vue.component(Button.name, Button);
Vue.component(List.name, List);
Vue.component(List.Item.name, List.Item);
Vue.component(List.Item.Meta.name, List.Item.Meta);
Vue.component(Avatar.name, Avatar);
Vue.component(Icon.name, Icon);
Vue.component(Input.name, Input);
Vue.component(Checkbox.name, Checkbox);
Vue.component(Badge.name, Badge);
Vue.component(Tabs.name, Tabs);
Vue.component(Tabs.TabPane.name, Tabs.TabPane);
Vue.component(Input.TextArea.name, Input.TextArea);
Vue.component(Pagination.name, Pagination); // 分页
Vue.component(Popover.name, Popover); // 气泡卡片
Vue.component(Tooltip.name, Tooltip); // 文字提示
Vue.component(Select.name, Select); // select选择框
Vue.component(Select.Option.name, Select.Option); // select选择框子菜单
Vue.component(Upload.name, Upload); // 上传文件
Vue.component(Modal.name, Modal); // 上传文件
Vue.component(Radio.Group.name, Radio.Group); // 单选按钮组
Vue.component(Radio.name, Radio);


Vue.prototype.$getData = getData;
Vue.prototype.$postData = postData;
Vue.prototype.$timeFormat = timeFormat;
Vue.prototype.$message = message;
// Vue.prototype.ws = ws;
Vue.prototype.$confirm = Modal.confirm;
Vue.prototype.emoji = emoji
Vue.config.productionTip = false
Vue.prototype.$myEid = 'klinchao';  //  1xy01
Vue.use(Vuex);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
