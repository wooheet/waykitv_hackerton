<template xmlns:v-clipboard="http://www.w3.org/1999/xhtml" xmlns:scrollTop="http://www.w3.org/1999/xhtml">
  <div v-if="txLoading">
    <v-container fill-height grid-list-xs mt-5 class="text-xs-center">
      <img src="@/assets/images/loading.svg" style="margin: 0 auto">
    </v-container>
  </div>
  <div v-else>
    <v-layout row>
      <v-flex >
        <span class="font-weight-black display-1 py-2 mb-4 white--text" >TRANSACTION</span>
        <v-chip class="ml-5 hidden-md-and-down" color="#484342" text-color="white" small>
          {{ selectedTx.txId }}
        </v-chip>
        <v-chip class="hidden-md-and-up" color="#484342" text-color="white" small>
          {{ selectedTx.txId | shortHash(10) }}...{{ selectedTx.txId.slice(-10) }}
        </v-chip>
        <button type="button"
                v-clipboard:copy="selectedTx.txId"
                v-clipboard:success="onCopy">
          <img src="@/assets/copy.png">
        </button>
      </v-flex>
      <v-flex text-xs-right mt-3 mr-3 v-if="selectedTx.txReceiptStatus === 'SUCCESS'">
          <span class="font-weight-black py-2 mt-3 tx-status">
           <img src="@/assets/tx-status-success.png"> {{ selectedTx.txReceiptStatus }} </span>
      </v-flex>
      <v-flex text-xs-right mt-3 mr-3 v-else>
          <span class="font-weight-black py-2 mt-3 tx-status">
           {{ selectedTx.txReceiptStatus }} </span>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex sm8 xs12>
        <div class="tx-detail">
          <v-card class="mt-5">
            <v-layout row>
              <v-flex
                grow pa-1 ml-3 mt-4 mb-4>
                <span class="title font-weight-medium mb-2 white--text ">OVERVIEW</span>
                <span class="font-weight-medium mb-2 white--text ml-5">TYPE - Coin</span>
              </v-flex>
            </v-layout>
            <v-layout row
                      wrap
                      v-for="(value, props) in selectedTx" :key="props"
                      class="py-2"
                      v-if=" ['body' ,'type' ,'version' ,'rawTx','txReceiptStatus','txReceipt','txId'].indexOf(props) === -1">
              <v-flex xs12 sm2 class="font-weight-medium value" style="color: #9A9A9A"> {{ textUpper(props) }} </v-flex>
              <v-flex xs12 sm10 class="font-weight-regular value"
                      v-if="props === 'timestamp'">
                {{ lengthCheck(value) | moment('from') }} <span class="timestamp">({{ value }})</span>
              </v-flex>
              <v-flex xs12 sm9 class="font-weight-regular value"
                      v-else-if="props === 'author'">
                <router-link class="link"
                             :to="`${linkBase}/account/${value}`">
                  {{ lengthCheck(value) }}
                </router-link>
                <button type="button"
                        v-clipboard:copy="value"
                        v-clipboard:success="onCopy">
                  <img src="@/assets/copy.png">
                </button>
              </v-flex>
              <v-flex xs12 sm9 class="font-weight-regular value"
                      v-else-if="props === 'blockId'">
                <router-link class="link"
                             :to="`${linkBase}/blocks/${value}`">
                  {{ lengthCheck(value) }}
                </router-link>
                <button type="button"
                        v-clipboard:copy="value"
                        v-clipboard:success="onCopy">
                  <img src="@/assets/copy.png">
                </button>
              </v-flex>
              <v-flex xs12 sm9 class="font-weight-regular value"
                      v-else-if="props === 'blockIndex'">
                <router-link class="link"
                             :to="`${linkBase}/blocks/${value}`">
                  {{ lengthCheck(value) }}
                </router-link>
              </v-flex>
              <v-flex xs12 sm9 class="font-weight-regular value"
                      v-else>
                {{ lengthCheck(value) }}
                <button type="button"
                        v-clipboard:copy="value"
                        v-clipboard:success="onCopy"
                        v-show="props !== 'bodyLength' & props !== 'blockIndex'">
                  <img src="@/assets/copy.png">
                </button>
                <span v-show="props==='bodyLength'">bytes</span>
              </v-flex>
            </v-layout>
          </v-card>
        </div>
      </v-flex>
      <v-flex sm4 xs12 px-2>
        <div class="tx-raw">
          <v-card class="mt-5 tx-contents">
            <v-container>
              <span class="title font-weight-medium white--text">RAW TRANSACTION</span>
            </v-container>
            <div
              id="scroll-target"
              style="height: 350px; min-height: 350px"
              class="scroll-y px-3">
              <v-layout row
                        v-for="(value, props) in selectedTx" :key="props"
                        class="py-2"
                        v-scroll:#scroll-target="onScroll"
                        v-if="props === 'rawTx'">
                <v-flex xs12 sm12 class="font-weight-regular value">
                  {{ value }}
                </v-flex>
              </v-layout>
            </div>
          </v-card>
        </div>
      </v-flex>
    </v-layout >
    <div class="tx-receipt-wrap py-3">
      <v-card class="py-2">
        <h3 class="ml-4 py-2 white--text">RECEIPT</h3>
        <v-data-table
          dark
          :headers="receipt"
          hide-actions
          :items="[selectedTx]"
          class="elevation-1 mytable">
          <template slot="items" slot-scope="props">
            <td>
              {{ JSON.parse(props.item.body).contractVersion | shortHash(5)}}...
              {{ JSON.parse(props.item.body).contractVersion.slice(-5)}}
              <!--{{ stringToJson(props.item.body) }}-->
            </td>
            <td>
              {{ JSON.parse(props.item.body).method.toUpperCase() }}
            </td>
            <td>
              <router-link class="account"
                           :to="`${linkBase}/account/${props.item.author}`">
                {{ props.item.author | shortHash(5)}}...{{ props.item.author.slice(-5)}}
              </router-link>
            </td>
            <td>
              <router-link class="account-to"
                           :to="`${linkBase}/account/${JSON.parse(props.item.body).params.to}`"
                           v-if="JSON.parse(props.item.body).params.to">
                {{ JSON.parse(props.item.body).params.to | shortHash(5)}}...
                {{ JSON.parse(props.item.body).params.to.slice(-5) }}
              </router-link>
              <router-link :to="`${linkBase}/account/${JSON.parse(props.item.body).params.to}`"
                           v-else class="account-to">
                {{ JSON.parse(props.item.body).params.to | shortHash(5)}}...
                {{ JSON.parse(props.item.body).params.to.slice(-5)}}
              </router-link>
            </td>
            <td>
              {{ JSON.parse(props.item.body).params.amount }}
            </td>
          </template>
        </v-data-table>
      </v-card>
    </div>
    <div class="tx-receipt-logs-wrap white--text">
      <v-card class="py-2 white--text">
        <h3 class="ml-4 py-2 mb-3 ">Transaction Receipt Logs</h3>
        <ul>
          <li class="dot" v-for="logs in selectedTx.txReceipt.txLog">
            {{logs}}
          </li>
        </ul>
      </v-card>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import {
  LOAD_TX
} from '../store/action-types'

export default {
  data () {
    return {
      receipt: [
        {text: 'CONTRACT VERSION', sortable: false},
        {text: 'METHOD', sortable: false},
        {text: 'FROM', sortable: false},
        {text: 'TO', sortable: false},
        {text: 'VALUE', sortable: false}
      ],
      position: {scrollTop: 0, scrollLeft: 0},
      offsetTop: 0
    }
  },
  computed: {
    ...mapState([
      'selectedTx', 'txLoading'
    ]),

    ...mapGetters([
      'linkBase'
    ])
  },
  mounted () {
    let hash = this.$route.params.txId
    this.$store.dispatch(LOAD_TX, hash)
      // if (this.selectedTx.txId === undefined){
      //   this.$router.push('/notFoundHash')
      // }
  },
  methods: {
    lengthCheck (v) {
      if (v !== null && v !== undefined && v.length > 64) {
        return v.slice(0, 56) + '...' + v.slice(-5)
      } else {
        return v
      }
    },
    onScroll (e, position) {
      // this.offsetTop = e.target.scrollTop
      this.position = position
    },
    onCopy: function (e) {
      alert('Copied: ' + e.text)
    },
    textUpper (p) {
      let convertIdToHash = p.replace('blockId', 'block Hash')
      let convertTimstamp = convertIdToHash.replace('timestamp', 'time')
      let convertBodyLength = convertTimstamp.replace('bodyLength', 'Tx Size')
      let convertBodyHash = convertBodyLength.replace('bodyHash', 'body Hash')
      let convertBlockIndex = convertBodyHash.replace('blockIndex', 'block #')
      let result = convertBlockIndex.replace('branchId', 'network ID')
      return result.charAt(0).toUpperCase() + result.slice(1)
    },

  },
  watch: {
    '$route' (to) {
      this.$store.dispatch(LOAD_TX, to.params.hash)
    }
  }
}
</script>
<style lang="scss" scoped>
  h2 {
    display: inline-block;
  }
  button {
    color: white;
    text-decoration: underline;
  }
  button:hover {
    transform: scale(1.05);
    color: #9EFFE8;
  }
  .tx-detail {
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

  .tx-raw {
    .row {
      .flex {
        &.value {
          word-break: break-all;
          font-family: 'Roboto', monospace;
        }
      }
    }
  }

  .v-card {
    background-color: rgba(66, 66, 66, 0.3);
    padding-bottom: 10px;
    border-radius: 10px;
  }

  .tx-status {
    color: #10CFA1;
  }

  .link {
    color:#f2f2f2;
    text-decoration: none;
  }
  .link:hover {
    color: #9EFFE8;
  }

  .tx-contents {
    min-height: 449px;
  }
  .value {
    color:#f2f2f2;
  }
  .timestamp {
    color: #9A9A9A;
  }
  td {
    font-family: 'Roboto', monospace;
    > a {
      text-decoration: none;
    }
    > a:hover { color: #9EFFE8; }
  }

  @media only screen and (max-width: 600px) {
    .txId {
      margin-left: 0px;
    }
  }
</style>
<style>
  @import '../style/mytable.css';
</style>
