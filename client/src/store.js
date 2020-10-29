import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    items: [
      {
        title: null,
        value: 0,
        nfs: false,
        id: 1,
        medium: 'Performance',
        additionalMedium: null,
        dimensions: '20x20x20',
      },
    ],
  },
  mutations: {
    add(state) {
      state.items.push({
        medium: 'Performance',
        additionalMedium: null,
        title: null,
        value: 0,
        nfs: false,
        id: state.items.length + 1,
        dimensions: '20x20x20',
      });
    },
    update(state, payload) {
      state.items.forEach((item, index) => {
        if (item.id == payload.id) {
          // Replace item's ID with new payload data.
          state.items[index] = payload;
        }
      });
    },
  },
  getters: {
    items: (state) => {
      return state.items;
    },
    item: (state) => (id) => {
      return state.items.find((item) => item.id == id);
    },
  },
});
