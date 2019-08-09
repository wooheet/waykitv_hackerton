<template>
  <div>
    <h1 class="mb-5 text-lg-center white--text">
      <img class="font-weight-bold tx-icon" src="@/assets/transaction-icon.png" style="margin:-3px">&nbsp;TRANSACTIONS</h1>
    <v-card>
      <v-data-table
              dark
              :headers="headers"
              :items="listingTxs"
              :pagination.sync="pagination"
              :total-items="totalTxs"
              :rows-per-page-items="[10]"
              class="elevation-1 mytable">
        <template slot="items" slot-scope="props">
          <td>
            <router-link :to="'blocks/' + props.item.blockId" class="index">
              {{ props.item.blockIndex }}
            </router-link>
          </td>
          <td>
            <router-link :to="'txs/' + props.item.txId">
              {{ props.item.txId | shortHash(5) }}...{{ props.item.txId.slice(-5) }}
            </router-link>
          </td>
          <td>
              {{ JSON.parse(props.item.body).contractVersion | shortHash(5) }}...
              {{ JSON.parse(props.item.body).contractVersion.slice(-5) }}
          </td>
          <td>
            <router-link :to="'account/' + props.item.author" class="account">
              {{ props.item.author | shortHash(5)}}...
              {{ props.item.author.slice(-5)}}
            </router-link>
          </td>
          <td>
            <router-link :to="'account/' + JSON.parse(props.item.body).params.to"
            v-if="JSON.parse(props.item.body).params.to"
            class="account-to">
              {{ JSON.parse(props.item.body).params.to | shortHash(5)}}...
              {{ JSON.parse(props.item.body).params.to.slice(-5)}}
            </router-link>
            <router-link :to="'account/' + props.item.author"
                         v-else class="account-to">
              {{ props.item.author | shortHash(5)}}...
              {{ props.item.author.slice(-5)}}
            </router-link>
          </td>
          <td>{{ props.item.timestamp | moment('from') }}</td>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  import {
    LOAD_TXS,
    LOAD_MORE_TXS
  } from '../store/action-types'

  export default {
    data () {
      return {
        headers: [
          { text: 'BLOCK #', sortable: false },
          { text: 'TX ID', sortable: false },
          { text: 'CONTRACT VERSION', sortable: false },
          { text: 'FROM', sortable: false },
          { text: 'TO', sortable: false },
          { text: 'DATE', sortable: false },
        ],
        pagination: {
          rowsPerPage: 10,
        },
      }
    },

    watch: {
      pagination: {
        async handler () {
          const { page, rowsPerPage } = this.pagination
          if(this.txs.length < 2) {
            this.$store.dispatch(LOAD_TXS)
          } else if((page + 1) * rowsPerPage > this.txs.length) {
            let offset = this.txs[this.txs.length - 1].blockIndex
            this.$store.dispatch(LOAD_MORE_TXS, page)
          }
        },
        deep: true
      },
    },

    computed: {
      ...mapState([
        'txs', 'countOfTxs'
      ]),

      listingTxs() {
        const { page, rowsPerPage } = this.pagination
        return this.txs.slice(0).slice((page - 1) * rowsPerPage, page * rowsPerPage)
      },

      totalTxs() {
          return this.countOfTxs
      },
    },

    // mounted() {
    //   this.$store.dispatch(LOAD_TXS)
    // },
  }
</script>
<style lang="scss" scoped>
  td {
    font-family: 'Roboto', monospace;
    > a {
      text-decoration: none;
    }
    > a:hover {
      color: #9EFFE8;
    }
  }
  .tx-icon {
    width:29px;
  }
  .v-card {
    background-color: rgba(66, 66, 66, 0.3);
    border-radius: 10px;
    padding-top:10px;
    padding-bottom:10px;
  }
</style>

<style>
  @import '../style/mytable.css';
</style>
