<template>
  <div class="entries">
    <h1 class="title">Entries</h1>
    <span v-html="message" class="message"></span>
    <input
      @click.stop.prevent="onChangeSortBySection"
      type="submit"
      class="sort-mode-button"
      :value="sortBySectionText"
    />
    <ul class="entries-list">
      <li class="entry-li" v-for="entry in entries" :key="entry.uid">
        <router-link
          :title="entry.title"
          class="entry"
          :to="'/entries/' + entry.uid"
        >
          <span class="entry-title"
            >{{ entry.firstName }} {{ entry.lastName }}:
            <span class="bold">{{
              cutoff(entry.title) || "Untitled"
            }}</span></span
          >
          <span class="entry-info">
            {{ sortBySection ? entry.section : entry.siteMap }}
          </span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import repo from "../repo";
export default {
  name: "Entries",
  data() {
    return {
      message: "Loading entries...",
      entries: [],
      sortBySection: true,
    };
  },
  computed: {
    sortBySectionText() {
      return `Sort by ${!this.sortBySection ? "section" : "site MAP number"}`;
    },
  },
  async created() {
    await this.load();
  },
  methods: {
    onChangeSortBySection() {
      this.sortBySection = !this.sortBySection;
      if (this.sortBySection) {
        // Sort entries by their section
        this.entries.sort((a, b) => {
          if (a.section < b.section) {
            return -1;
          }
          if (a.section > b.section) {
            return 1;
          }
          return 0;
        });
      } else {
        // Sort entries by their site map number
        this.entries.sort((a, b) => {
          if (a.siteMap < b.siteMap) {
            return -1;
          }
          return 1;
        });
      }
    },
    cutoff(text) {
      if (text && text.length > 20) {
        return `${text.substring(0, 20)}...`;
      } else {
        return text;
      }
    },
    async load() {
      try {
        const res = await repo.getEntries();
        this.entries = res.data;
        if (!this.entries || this.entries.length < 1) {
          this.message = "No entries yet.";
        } else {
          this.message = "Choose an entry to view.";
        }
      } catch (error) {
        this.message = "Failed to load entries, server may be down.";
      }
    },
  },
};
</script>

<style lang="scss">
.entries {
  text-align: center;

  .sort-mode-button {
    display: block;
    margin: 20px auto;
  }

  .entries-list {
    overflow: auto;
    list-style: none;
    padding: 5px;
    width: 60%;
    margin: 0 auto;
    text-align: left;

    .entry {
      display: flex;
      justify-content: space-between;
      padding: 15px;
      background: hsl(0, 0%, 98%);
      color: hsl(0, 0%, 17%);
      text-decoration: none;
      margin: 4px;
      cursor: pointer;
      transition: background 200ms;

      &:hover {
        background: hsl(204, 48%, 69%);
        color: #fff;
      }

      .entry-info {
        font-size: 1.1em;
        font-weight: bold;
        color: #000;
        text-align: center;
        padding: 5px;
      }

      .bold {
        font-weight: bold;
      }
    }
  }

  @media only screen and (max-width: 800px) {
    .entries-list {
      width: 100%;
    }
  }
}
</style>
