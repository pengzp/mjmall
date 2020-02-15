// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';

// i-view 组件
import iView from 'iview';
import 'iview/dist/styles/iview.css';

// Vuex 与 Cookie
import store from './store';
import VueCookie from 'vue-cookie';

import echarts from 'echarts';

import md5 from 'js-md5';
// import jQuery from 'jquery';
// import VueFroala from 'vue-froala-wysiwyg';

// require('froala-editor/js/froala_editor.pkgd.min');
// require('froala-editor/css/font-awesome.css');
// require('font-awesome/css/font-awesome.css');
// require('froala-editor/js/languages/zh_cn');
// require('froala-editor/css/froala_style.min.css');
// window.$=jQuery;
// Vue.use(VueFroala);

Vue.config.productionTip = false;
Vue.prototype.$ajax = axios;
Vue.prototype.$echarts = echarts;
Vue.prototype.$md5 = md5;
Vue.use(VueCookie);
Vue.use(iView);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
