<template>
  <div class="entry">
    <span v-if="message" class="message" v-html="message"></span>
    <div v-if="entry" class="entry-display">
      <div class="entry-header">
        <h1 class="entry-section">
          Dunedin School of Art - SITE 2022 <br />{{ entry.section }}
        </h1>
        <!-- <img class="entry-logo" src="../assets/DSA_BLACK_H.jpg" /> -->
      </div>
      <div class="entry-info">
        <div class="name-title-wrapper">
          <h3 class="entry-name">{{ name }}</h3>
          <h3 class="entry-title">{{ entry.title || 'Untitled' }}</h3>
        </div>
        <div class="site-wrapper">
          <p class="site-title">site</p>
          <p class="site-number">{{ entry.siteMap }}</p>
        </div>
      </div>
      <hr />
      <div class="items-table-wrapper">
        <table class="items-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Medium</th>
              <th>Price</th>
              <th>Dimensions</th>
              <th>Number of Editions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, key) in entry.items" :key="key">
              <td>{{ item.itemId }}</td>
              <td>{{ item.itemTitle || 'Untitled item' }}</td>
              <td>{{ item.medium || 'N/A' }}</td>
              <td>{{ item.nfs ? 'Not for sale' : `$${item.value}` }}</td>
              <td v-if="item.dimensions">{{ item.dimensions }}</td>
              <td>
                <div class="circle" v-for="i in item.editions">
                  <div class="content">{{ i }}</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.entry {
  width: 900px;
  margin: 0 auto;
  hr {
    width: 100%;
  }
  .entry-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .entry-logo {
      width: 40%;
      height: 40%;
    }
  }
  .entry-section {
    font-weight: bold;
    color: hsl(0, 0%, 65%);
  }
  .entry-info {
    display: flex;
    justify-content: space-between;

    .entry-name {
      font-weight: bold;
    }

    .site-wrapper {
      .site-title {
        font-style: italic;
        margin: 20px 0;
      }
      .site-number {
        font-size: 1.4em;
        font-weight: bold;
        margin: 0px 0;
      }
    }
  }
  .items-table-wrapper {
    .items-table {
      width: 100%;
      border-collapse: collapse;
      thead {
        background: hsl(0, 0%, 85%);
        color: hsl(0, 0%, 15%);
        th {
          font-weight: normal;
          font-size: 0.9em;
        }
      }
      td,
      th {
        padding: 10px;
        text-align: center;
      }
      td {
        border-bottom: 1px solid #000;
      }
    }
  }
  .circle {
    height: 50px;
    width: 50px;
    background-color: hsl(0, 0%, 85%);
    border-radius: 50%;
    margin: 1.5% auto;
    position: relative;
  }
  .content {
    position: absolute;
    width: inherit;
    height: auto;
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
  }
}
</style>

<script>
import repo from '../repo';
export default {
  name: 'Entry',
  data() {
    return {
      message: 'Loading entry...',
      entry: null,
    };
  },
  computed: {
    name() {
      return `${this.entry.firstName} ${this.entry.lastName}`.toUpperCase();
    },
  },
  async created() {
    await this.load();
  },
  methods: {
    async load() {
      try {
        const res = await repo.getEntry(this.$route.params.uid);
        this.entry = res.data;
        this.message = null;
      } catch (error) {
        if (error && error.response && error.response.status == 404) {
          this.message = 'No such entry';
        } else {
          this.message = 'Failed to load entry, server may be down.';
        }
      }
    },
  },
};
</script>
