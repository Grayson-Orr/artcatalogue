<template>
  <div class="catalogue-item">
    <transition name="fade">
      <form class="catalogue-item-form" @change="updateState">
        <label class="desc"> Title </label>
        <div class="title-wrapper">
          <input
            type="text"
            required
            v-model="item.title"
            :placeholder="itemPlaceholder"
            @input="1"
          />
        </div>
        <label class="desc"> Medium </label>
        <div class="title-wrapper">
          <input
            type="text"
            required
            v-model="item.medium"
            placeholder="Medium"
          />
        </div>
        <label class="desc"> Dimensions (Optional) </label>
        <div class="dimensions-wrapper">
          <input
            v-model="item.dimensions"
            type="text"
            placeholder="Dimensions"
            value="20x20x20"
          />
          <label class="little-label"> (WxHxL) Centimetres </label>
        </div>
        <input v-model="item.nfs" type="checkbox" />
        <label class="little-label"> Not For Sale * </label>
        <div class="dollars-wrapper">
          <input
            :disabled="item.nfs"
            v-model="item.value"
            type="number"
            placeholder="Dollars"
          />
          <label class="little-label"
            >$ Dollars -
            <strong
              >Please note that Otago Polytechnic takes a 25%
              commission.</strong
            ></label
          >
        </div>
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
      },
    };
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
    // mediums: {
    //   type: Array,
    //   required: true,
    // },
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
