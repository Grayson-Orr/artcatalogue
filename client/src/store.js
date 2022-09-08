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
        medium: null,
        dimensions: '20x20x20',
        // num_of_editions: 0
      },
    ],
  },
  mutations: {
    add(state) {
      state.items.push({
        medium: null,
        title: null,
        value: 0,
        nfs: false,
        id: state.items.length + 1,
        dimensions: '20x20x20',
        // num_of_editions: 0
      });
    },
    update(state, payload) {
      state.items.forEach((item, index) => {
        if (item.id == payload.id) {
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
