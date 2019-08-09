<template>
  <v-data-table
          :headers="headers"
          :items="blocks"
          :loading="loading"
          :pagination.sync="pagination"
          hide-actions
          class="elevation-1 mytable">
    <template slot="items" slot-scope="props">
      <td>
        <router-link class="index"
                :to="`${linkBase}/blocks/${props.item.blockId}`">
          {{ props.item.index }}
        </router-link>
      </td>
      <td>
        <router-link
                :to="`${linkBase}/blocks/${props.item.blockId}`">
          {{ props.item.blockId | shortHash(5) }}...{{ props.item.blockId.slice(-5) }}
        </router-link>
      </td>
      <td>{{ props.item.txSize }}</td>
      <td>{{ props.item.timestamp | moment('from') }}</td>
    </template>
  </v-data-table>
</template>
<script>
  export default {
    props: [ 'blocks', 'linkBase' ],
    data: () => ({
        loading: false,
        headers: [
        { text: 'BLOCK #', sortable: false },
        { text: 'BLOCK HASH', sortable: false },
        { text: '# OF TXS', sortable: false },
        { text: 'DATE', sortable: false },
      ],
      pagination: {
        rowsPerPage: 7
      }
    }),
    methods: {

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
  .blockHash {
    font-family: 'Roboto', monospace;
    font-weight: bold;
  }
</style>

<style>
  @import '../style/mytable.css';
</style>
