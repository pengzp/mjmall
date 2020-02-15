import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/views/login/Login';
import Home from '@/views/home/Home';
import Admin from '@/views/admin/Admin';
import Role from '@/views/role/Role';
import Menu from '@/views/menus/Menu';
//import HelloWorld from '@/components/HelloWorld';
import Druid from '@/views/druid/Druid';
import ComplaintList from '@/views/complaint/ComplaintList';
Vue.use(Router)

export default new Router({
  //打包要把它注释掉
  mode:'history',
  base:__dirname,
  routes: [
    {path: '/', name: 'Login', component: Login},
    {path: '/home', name: 'Home',component: Home,
      // redirect: '',
    
      children: [
        // {path: '', component: HelloWorld},
        {path: '/admin', component: Admin},
        {path: '/role', component: Role},
        {path: '/menu', component: Menu},
        {path: '/druid', component: Druid},
        {path:'/complaintList',component:ComplaintList},
      ]
    }
  ]
})