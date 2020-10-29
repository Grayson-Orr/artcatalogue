import Vue from 'vue';
import Router from 'vue-router';
import ArtForm from './views/ArtForm.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'ArtForm',
      component: ArtForm,
    },
    {
      path: '/entries',
      name: 'Entries',
      component: function () {
        return import(/* webpackChunkName: "entries" */ './views/Entries.vue');
      },
    },
    {
      path: '/entries/:uid',
      name: 'Entry',
      component: function () {
        return import(/* webpackChunkName: "entry" */ './views/Entry.vue');
      },
    },
  ],
});
