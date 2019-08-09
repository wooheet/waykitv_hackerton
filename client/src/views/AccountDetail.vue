<template xmlns:v-clipboard="http://www.w3.org/1999/xhtml">
  <div v-if="accountLoading">
    <v-container fill-height grid-list-xs mt-5 class="text-xs-center">
      <img src="@/assets/images/loading.svg" style="margin: 0 auto">
    </v-container>
  </div>
  <div v-else>
    <h2 class="font-weight-black display-1 py-2 mb-4 white--text hidden-md-and-down" >ACCOUNT</h2>
    <h2 class="font-weight-black display-1 py-2 white--text hidden-md-and-up" >ACCOUNT</h2>
      <v-chip class="ml-5 mr-2 hidden-md-and-down" color="#484342" text-color="white" small>
        {{ account.Address }}
      </v-chip>
      <v-chip class="hidden-md-and-up" color="#484342" text-color="white" small>
        {{ account.Address }}
      </v-chip>
      <button type="button"
              v-clipboard:copy="account.Address"
              v-clipboard:success="onCopy">
        <img src="@/assets/copy.png">
      </button>
    <v-layout row wrap>
      <v-flex sm12 xs12 order-xs2 order-sm-1>
        <v-card class="account-info white--text">
          <h2 class="title font-weight-medium mb-3 ml-3 white--text">OVERVIEW</h2>
          <v-layout row
                    wrap
                    v-for="(value, props) in account" :key="props"
                    class="py-2">
            <v-flex xs12 sm2 v-if="props==='TXs'"> Recent {{ props }}</v-flex>
            <v-flex xs12 sm2 v-else>{{ props }}</v-flex>
            <v-flex xs12 sm9 class="font-weight-bold value"
            v-if="props==='TXs'">
              {{ value.length }}
            </v-flex>
            <v-flex xs12 sm9 class="font-weight-bold value" v-else>
              {{ value }}
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout >
    <div class="block-sidebar-wrap py-5 white--text">
        <v-card>
          <span class="title font-weight-medium mb-2 ml-3 white--text" >TRANSACTIONS</span>
          <v-data-table
                  dark
                  :headers="transactions"
                  :items="txsInAccount"
                  class="elevation-1 mytable">
            <template slot="items" slot-scope="props">
              <td>
                <router-link :to="`${linkBase}/blocks/${props.item.blockIndex}`">
                  {{ props.item.blockIndex }}
                </router-link>
              </td>
              <td>
                <router-link :to="`${linkBase}/txs/${props.item.txId}`">
                  {{ props.item.txId | shortHash(5)}}...{{ props.item.txId.slice(-5) }}
                </router-link>
              </td>
              <td>
                {{ JSON.parse(props.item.body).contractVersion | shortHash(5) }}...
                {{ JSON.parse(props.item.body).contractVersion.slice(-5) }}
              </td>
              <td>
                <router-link :to="`${linkBase}/account/${props.item.author}`" class="account">
                  {{ props.item.author | shortHash(5)}}...{{ props.item.author.slice(-5) }}
                </router-link>
              </td>
              <td>
                <router-link
                      class="account-to"
                      :to="`${linkBase}/account/${JSON.parse(props.item.body).params.to}`"
                      v-if="JSON.parse(props.item.body).params.to">
                  {{ JSON.parse(props.item.body).params.to | shortHash(5)}}...
                  {{ JSON.parse(props.item.body).params.to.slice(-5) }}
                </router-link>
                <router-link :to="`${linkBase}/account/${props.item.author}`"
                             v-else class="account-to">
                  {{ props.item.author | shortHash(5)}}...
                  {{ props.item.author.slice(-5)}}
                </router-link>
              </td>
              <td v-if="JSON.parse(props.item.body).params.amount">
                {{ JSON.parse(props.item.body).params.amount }}
              </td>
            </template>
          </v-data-table>
        </v-card>
    </div>
  </div>
</template>
<script>
  import { mapGetters, mapState } from 'vuex'
  import {
    LOAD_ACCOUNT
  } from '../store/action-types'

  export default {
    data () {
        return {
            transactions: [
                { text: 'BLOCK #', sortable: false },
                { text: 'TX ID', sortable: false },
                { text: 'CONTRACT VERSION', sortable: false },
                { text: 'FROM', sortable: false },
                { text: 'TO', sortable: false },
                { text: 'VALUE', sortable: false },
            ]
        }
    },
    computed: {
      ...mapState([
        'selectedAccount', 'txsInAccount', 'accountLoading'
      ]),
      ...mapState({
        account: 'selectedAccount'
      }),

      ...mapGetters([
        'linkBase'
      ])
    },

    methods: {
      onCopy: function (e) {
        alert('Copied: ' + e.text)
      }
    },

    mounted() {
      let address = this.$route.params.account
      this.$store.dispatch(LOAD_ACCOUNT, address)
    },

    watch: {
      '$route' (to) {
        this.$store.dispatch(LOAD_ACCOUNT, to.params.account)
      }
    }
  }
</script>
<style lang="scss" scoped>
  h2 {
    display: inline-block;
  }
  button {
    outline: 0;
  }

  .v-card {
    background-color: rgba(66, 66, 66, 0.3);
    border-radius: 10px;
    padding-top:20px;
    padding-bottom:10px;
  }

  td {
    font-family: 'Roboto', monospace;
    > a {
      text-decoration: none;
      color: white;
    }
    > a:hover {
      color: #9EFFE8;
    }
  }

  .account-info {
    background-color: rgba(66, 66, 66, 0.3);
    .row {
      .flex {
        padding: 4px 1.5em;
        &.value {
          word-break: break-all;
          font-family: 'Roboto', monospace;
        }
      }
    }
  }
</style>

<style>
  @import '../style/mytable.css';
</style>
