<template>
  <v-data-table
          :headers="headers"
          :items="txs"
          :loading="isLoading()"
          :pagination.sync="pagination"
          hide-actions
          class="elevation-1 mytable">
    <template slot="items" slot-scope="props">
      <td>
        <router-link
                :to="`${linkBase}/txs/${props.item.txId}`">
          {{ props.item.txId | shortHash(5) }}...{{ props.item.txId.slice(-5) }}
        </router-link>
      </td>
      <td >
          {{ JSON.parse(props.item.body).contractVersion | shortHash(5) }}...{{ JSON.parse(props.item.body).contractVersion.slice(-5) }}
      </td>
      <td>{{ props.item.timestamp | moment('from') }}</td>
    </template>
  </v-data-table>
</template>
<script>
export default {
  props: [ 'txs', 'linkBase' ],
  data: () => ({
    loading: false,
    headers: [
      { text: 'TX HASH', sortable: false },
      { text: 'CONTRACT VERSION', sortable: false },
      { text: 'DATE', sortable: false }
    ],
    pagination: {
      rowsPerPage: 7
    }
  }),
  methods: {
    isLoading() {
      if (!this.txs) {
        return !this.loading
      }
      return this.loading
    }
  }
}
</script>
<style lang="scss" scoped>
  td {
    font-family: 'Roboto', monospace;
    font-weight: bold;
    > a {
      text-decoration: none;
    }
    > a:hover { color: #9EFFE8; }
  }
  .txHash {
    font-family: 'Roboto', monospace;
    font-weight: bold;
  }
  .contractHash {
    font-family: 'Roboto', monospace;
    font-weight: bold;
  }
</style>

<style>
  @import '../style/mytable.css';
</style>
