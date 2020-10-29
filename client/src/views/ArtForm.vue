<template>
  <div class="art-form">
    <h1>Otago Polytechnic Ltd</h1>
    <span class="page-info">
      Fill out this form to add your art to the catalogue.
    </span>
    <p class="page-message" v-html="message"></p>
    <form autocomplete="off" class="art-form-form">
      <div class="details-wrapper">
        <label> Entry Information </label>
        <input
          v-model="formData.firstName"
          type="text"
          placeholder="First Name"
        />
        <input
          v-model="formData.lastName"
          type="text"
          placeholder="Last Name"
        />
      </div>
      <div class="ex-wrapper">
        <input
          v-model="formData.title"
          type="text"
          placeholder="Exhibition Title"
        />
        <input
          v-model="formData.siteMap"
          type="number"
          max="100"
          placeholder="Site MAP number"
        />
        <label class="little-label"> Site MAP number </label>
      </div>
      <div class="section-wrapper">
        <select class="section-select" v-model="formData.section">
          <option v-for="section in sections" :key="section" :value="section">{{
            section
          }}</option>
        </select>
        <label class="little-label"> Section </label>
      </div>
      <hr />
      <label> Add Catalogue Items </label>
      <div class="catalogue-items-wrapper">
        <ul class="catalogue-item-list">
          <li
            v-for="item in items"
            :key="item.id"
            @click.stop="selectedItem = item.id"
            :class="{ selected: item.id == selectedItem }"
          >
            Item {{ item.id }}
          </li>
        </ul>
        <CatalogueItem
          v-for="item in items"
          :key="item.id"
          :id="item.id"
          :hidden="selectedItem !== item.id"
          :mediums="mediums"
        >
        </CatalogueItem>
      </div>
      <input
        type="submit"
        @click.stop.prevent="addItem"
        class="add-item-btn"
        value="Create Another Item"
      />
      <hr />
      <span class="page-info">
        Please ensure the information above is correct before submitting.
      </span>
      <div class="submit-wrapper">
        <input
          type="submit"
          value="Submit"
          @click.stop.prevent="onSubmit"
        />
      </div>
    </form>
  </div>
</template>

<script>
import repo from "../repo";
import CatalogueItem from "../components/CatalogueItem";
export default {
  name: "ArtForm",
  components: {
    CatalogueItem,
  },
  data() {
    return {
      message: null,
      sections: [],
      mediums: [],
      formData: {
        firstName: null,
        lastName: null,
        title: null,
        section: null,
        siteMap: 1,
      },
      selectedItem: 1,
    };
  },
  async created() {
    await this.load();
  },
  computed: {
    // Caches site MAP number to watch changes on it
    siteMapNumber() {
      return this.formData.siteMap;
    },
    items() {
      return this.$store.getters.items;
    },
  },
  watch: {
    siteMapNumber(newValue) {
      if (newValue > 100) {
        this.formData.siteMap = this.formData.siteMap.replace(/^./, "");
      }
      if (newValue < 1) {
        this.formData.siteMap = 1;
      }
    },
  },
  methods: {
    addItem() {
      this.$store.commit("add");
    },
    onError(error) {
      console.log({ error });

      // Display any errors that were received
      if (error.response && error.response.data) {
        this.message = error.response.data;
        return;
      }

      this.message = "Unknown error (server may be down)";
    },
    async load() {
      try {
        const res = await repo.getInfo();
        this.sections = res.data.sections;
        this.mediums = res.data.mediums;
        this.formData.section = this.sections[0];
      } catch (error) {
        this.onError(error);
      }
    },
    async onSubmit() {
      this.message = "Submitting...";
      try {
        const items = this.$store.getters.items;
        // Mix in items with rest of form data and submit
        const res = await repo.submitForm({
          ...this.formData,
          items: items,
        });

        this.message = `Success, your form is: <a href="entries/${res.data.uid}/">${res.data.uid}</a>`;
      } catch (error) {
        this.onError(error);
      }
    },
  },
};
</script>

<style lang="scss">
.art-form {
  margin-left: 9px;

  .page-info {
    font-size: 0.8em;
  }

  .page-message {
    font-size: 0.7em;
    margin: 0;
    text-align: center;
  }

  input,
  select {
    margin-left: 10px;
    margin-right: 10px;
  }

  .ex-wrapper {
    margin: 10px 0;
    input {
      &[type="number"] {
        width: 50px;
      }
    }
  }

  .catalogue-items-wrapper {
    display: flex;
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: 400px;

    .catalogue-item-list {
      min-height: 220px;
      max-height: 220px;
      overflow-y: auto;
      font-size: 0.8em;
      list-style: none;
      li {
        padding: 10px 20px;
        background: hsl(0, 0%, 96%);
        cursor: pointer;
        &.selected {
          background: hsl(204, 48%, 69%);
          color: #fff;
        }
        &:hover:not(.selected) {
          background: hsl(0, 0%, 75%);
        }
      }
    }

    .catalogue-item {
      margin: 0 20px;
    }
  }

  .submit-wrapper input {
    margin: 20px;
  }
}
</style>
