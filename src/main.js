// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'normalize.css/normalize.css'
import './assets/reset.css'

import Vue from 'vue'
import { Dialog, Input, Button, Tooltip, Form, FormItem, Icon, MessageBox, Message, Notification } from 'element-ui'
Vue.use(Dialog)
Vue.use(Input)
Vue.use(Button)
Vue.use(Tooltip)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Icon)
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message
import App from './App'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
