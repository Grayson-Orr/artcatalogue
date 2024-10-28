/* eslint-disable */
import Vue from 'vue';
import Router from 'vue-router';

import ArtForm from './views/ArtForm.vue';
import Entries from './views/Entries.vue';
import Entry from './views/Entry.vue';

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
      component: Entries,
    },
    {
      path: '/entries/:uid',
      name: 'Entry',
      component: Entry,
    },
  ],
});
