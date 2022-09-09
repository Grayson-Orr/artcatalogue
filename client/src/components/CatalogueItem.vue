<template>
  <div class="catalogue-item">
    <transition name="fade">
      <form class="catalogue-item-form" @change="updateState">
        <label class="little-label"> Title * </label>
        <div class="title-wrapper">
          <input
            type="text"
            required
            v-model="item.title"
            :placeholder="itemPlaceholder"
            @input="1"
          />
        </div>
        <label class="little-label"> Medium * </label>
        <div class="title-wrapper">
          <input
            type="text"
            required
            v-model="item.medium"
            placeholder="Medium"
          />
        </div>
        <label class="little-label"> Dimensions (Optional) </label>
        <div class="dimensions-wrapper">
          <input
            v-model="item.dimensions"
            type="text"
            placeholder="Dimensions"
            value="20x20x20"
          />
          <label class="little-label">
            (Width x Height x Depth) Centimetres
          </label>
        </div>
        <input v-model="item.hasEdition" type="checkbox" />
        <label class="little-label"
          >Does your item have editions? (Optional)</label
        >
        <div class="edition-wrapper">
          <label v-if="item.hasEdition" class="little-label">How many?</label>
          <input v-if="item.hasEdition" v-model="item.editions" type="number" />
        </div>
        <input v-model="item.nfs" type="checkbox" />
        <label class="little-label">Is your item for sale? * </label>
        <div class="dollars-wrapper">
          <label v-if="item.nfs" class="little-label">NZ Dollars (NZD) </label>
          <input v-if="item.nfs" v-model="item.value" type="number" />
        </div>
        <span class="page-info">
          <strong
            >Please note that Otago Polytechnic takes a 25% commission.</strong
          >
        </span>
      </form>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'CatalogueItem',
  data() {
    return {
      item: {
        title: null,
        medium: null,
        value: 0,
        nfs: false,
        dimensions: '20x20x20',
        hasEdition: false,
        editions: 0,
      },
    };
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  methods: {
    updateState() {
      this.$store.commit('update', {
        id: this.id,
        title: this.item.title,
        medium: this.item.medium,
        value: this.item.value,
        nfs: this.item.nfs,
        dimensions: this.item.dimensions,
        hasEdition: this.item.hasEdition,
        editions: this.item.editions,
      });
    },
  },
  computed: {
    itemPlaceholder() {
      return `Item ${this.id}`;
    },
  },
};
</script>

<style lang="scss">
.catalogue-item {
  padding: 5px;

  .save-wrapper {
    margin: 10px 0;
    input {
      margin: 0 5px;
    }
  }

  .desc {
    font-size: 0.8em;
    margin: 5px 10px;
  }

  .title-wrapper {
    margin: 5px 0;
  }

  .dollars-wrapper {
    display: flex;
    align-items: center;
  }
}

@media only screen and (max-width: 1000px) {
  .catalogue-item {
    width: 80%;
  }
}
</style>
