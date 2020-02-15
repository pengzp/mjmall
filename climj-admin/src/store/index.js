import Vue from 'vue';
import Vuex from 'vuex';
import API from '@/api';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    menus: [],
    //设置默认cityId
    cityId:-1,
  },
  getters: {
    getMenus: state => {
      state.menus = JSON.parse(sessionStorage.getItem("menus"));
      return state.menus;
    }
  },
  mutations: {
    updateResource(state, params) {
      state.menus = params;
    },
    logout(state){
      Vue.cookie.delete('token');
      Vue.cookie.delete('username');
    },
    //获取值
    getCity(state, status) {
      state.cityId = status;
      localStorage.setItem("CITY_ID", status);
  },
  setCityId(state, status){
    state.cityId = status;
    localStorage.setItem("CITY_ID", status);
  },
  },
  actions: {
    // 获取资源权限列表
    getResource(context, params){
      API.menu.resouce(params).then(({data}) => {
        if (data.code == 0) {
          sessionStorage.setItem("menus",JSON.stringify(data.data.menus));
          context.commit('updateResource', data.data.menus);
        } else {
          this.$Message.error(data.msg);
        }
      })
    }
  },
  modules: {}
});

export default store;
// export default new Vuex.store({
//     store,
//     state,
//     mutations
// });
