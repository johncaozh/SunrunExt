// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/iconfont.css';
import './assets/common.css';
import filter from './utility/filter'
import VueLazyload from 'vue-lazyload'
import helper from "./utility/helper";

Vue.config.productionTip = false;
Vue.use(ElementUI);

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: './assets/img/broken-image.png',
  loading: './assets/img/loading-image.svg',
  attempt: 1
})

router.beforeEach(function (to, from, next) {
  window.scrollTo(0, 0)
  if (to.path != "/login" && to.path != "/logout") {
    var userId = helper.getCookie('userId');
    if (!userId) {
      next("/login");
      return;
    }
  }

  next();
})

Array.prototype.removeByValue = function (val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) {
      this.splice(i, 1);
      break;
    }
  }
}

Array.prototype.move = function (old_index, new_index) {
  if (new_index >= this.length) {
    var k = new_index - this.length;
    while ((k--) + 1) {
      this.push(undefined);
    }
  }
  this.splice(new_index, 0, this.splice(old_index, 1)[0]);
  return this; // for testing purposes
};

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  }
})
