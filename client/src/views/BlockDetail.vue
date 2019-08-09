<template xmlns:v-clipboard="http://www.w3.org/1999/xhtml">
  <div v-if="blockLoading">
    <v-container fill-height grid-list-xs mt-5 class="text-xs-center">
      <img src="@/assets/images/loading.svg" style="margin: 0 auto">
    </v-container>
  </div>
  <div v-else>
    <span class="font-weight-black display-1 py-2 mb-4 white--text" >BLOCK</span>
    <span class="py-0 ml-4 white--text index" > #{{ block.index }}</span>
    <v-layout row wrap>
      <v-flex sm8 xs12 >
        <div class="block-detail">
          <v-card class="mt-5 block-contents">
            <v-layout row>
              <v-flex pa-1 ml-3 mt-4 mb-4>
                  <span class="title font-weight-medium mb-2 white--text ">OVERVIEW</span>
              </v-flex>
              <v-flex shrink pa-0 mt-3>
                <v-btn flat color="#E1E1E1"
                      :to="`${linkBase}/blocks/${block.index - 1}`"
                      :disabled="isLast">
                <v-icon small>arrow_back_ios</v-icon>
                </v-btn>
                <v-btn flat color="#E1E1E1"
                      :to="`${linkBase}/blocks/${block.index + 1}`"
                      :disabled="isFirst">
                <v-icon small>arrow_forward_ios</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
            <v-layout row
                      dark
                      wrap
                      v-for="(value, props) in block" :key="props"
                      class="py-2"
                      v-show="props !== 'type' & props !== 'version' & props !== 'consensusMessages' & props !== 'index'">
              <v-flex xs12 sm2 style="color: #9A9A9A">{{ textUpper(props) }}</v-flex>
              <v-flex xs12 sm10 class="font-weight-medium value"
                      v-if="props === 'timestamp'">
                {{ lengthCheck(value) | moment('from') }} <span class="timestamp">({{ value }})</span>
              </v-flex>
              <v-flex xs12 sm10 class="font-weight-regular value"
                      v-else>
                {{ lengthCheck(value) }}
                <span v-show="props==='bodyLength'">bytes</span>
                  <button type="button"
                          class="copy alert alert-success"
                          v-clipboard:copy="value"
                          v-clipboard:success="onCopy"
                          v-show="props !== 'bodyLength' & props !== 'txSize'">
                    <img src="@/assets/copy.png">
                  </button>
              </v-flex>
            </v-layout>
          </v-card>
        </div>
      </v-flex>
      <v-flex sm4 xs12 px-2>
        <div class="consensus-detail">
          <v-card class="mt-5 block-contents">
            <v-container >
              <span class="title font-weight-medium white--text">CONSENSUS</span>
            </v-container>
            <div
              id="scroll-target"
              style="height: 398px; min-height: 398px"
              class="scroll-y">
            <v-layout row
                      wrap
                      v-for="(value, props) in block" :key="props"
                      class="font-weight-medium py-2"
                      v-scroll:#scroll-target="onScroll"
                      v-if="props === 'consensusMessages'">
                <v-layout row
                          wrap
                          v-for="(cv, cp) in convertToJsonObject(value)" :key="cp"
                          class="py-2 px-2" >
                  <v-flex xs12 sm12 style="color: #bcbcbc">
                    {{ textUpper(cp) }} ({{ cv.length ? cv.length : 1}})
                  </v-flex>
                  <v-flex xs12 sm12 class="font-weight-regular value"
                          v-if="cp === 'prePrepare'">
                        {{ cv.signature | shortHash(35) }}...{{ cv.signature.slice(-5) }}
                  </v-flex>
                  <v-flex xs12 sm12 class="font-weight-regular value"
                          v-else
                          v-for="(cValue, cProps) in cv" :key="cProps">
                        {{ cValue.signature | shortHash(35) }}...{{ cValue.signature.slice(-5) }}
                  </v-flex>
                </v-layout>
            </v-layout>
            </div>
          </v-card>
        </div>
      </v-flex>
    </v-layout >
    <div class="block-sidebar-wrap py-3">
        <v-card dark class="py-2">
          <h3 class="mt-2 ml-4 py-2 white--text">TRANSACTIONS</h3>
          <v-data-table
                  dark
                  :headers="transactions"
                  :items="txsInBlock"
                  :pagination.sync="pagination"
                  class="elevation-1 mytable">
            <template slot="items" slot-scope="props">
              <td>
                <router-link :to="`${linkBase}/txs/${props.item.txId}`" class="txId">
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
                <router-link :to="`${linkBase}/account/${JSON.parse(props.item.body).params.to}`"
                              v-if="JSON.parse(props.item.body).params.to"
                             class="account-to">
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
  LOAD_BLOCK
} from '../store/action-types'

export default {
  data () {
    return {
      transactions: [
        { text: 'TX ID', sortable: false },
        { text: 'CONTRACT VERSION', sortable: false },
        { text: 'FROM', sortable: false },
        { text: 'TO', sortable: false },
        { text: 'VALUE', sortable: false }
      ],
      position: { scrollTop: 0, scrollLeft: 0 },
      pagination: {
        rowsPerPage: 5
      },
    }
  },
  computed: {
    ...mapState([
      'latestBlock', 'selectedBlock', 'txsInBlock', 'blockLoading'
    ]),
    ...mapState({
      block: 'selectedBlock'
    }),

    ...mapGetters([
      'linkBase'
    ]),

    isFirst () {
      return this.latestBlock.index === this.block.index
    },

    isLast () {
      return this.block.index === 0
    }
  },

  methods: {
    lengthCheck (v) {
      if (v !== null && v !== undefined && v.length > 64) {
        return v.slice(0, 56) + '...' + v.slice(-5)
      } else {
        return v
      }
    },
    convertToJsonObject (v) {
      return JSON.parse(v)
    },
    onScroll: function (e, position) {
      this.position = position
    },
    onCopy: function (e) {
      alert('Copied: ' + e.text)
    },

    textUpper (p) {
      /* block */
      let convertBlockToHash = p.replace('blockId', ' Hash')
      let convertPrevblockToParent = convertBlockToHash.replace('prevBlockId', 'parent Hash')
      let convertTx = convertPrevblockToParent.replace('txSize', 'total TXs')
      let convertTimstamp = convertTx.replace('timestamp', 'time')
      let convertMerkleRoot = convertTimstamp.replace('merkleRoot', 'merkle Root')
      let convertBodyLength = convertMerkleRoot.replace('bodyLength', 'Block Size')
      let convertBranchToNetwork = convertBodyLength.replace('branchId', 'network ID')
      /* consensus */
      let prePrepare = convertBranchToNetwork.replace('prePrepare', 'prePrepare Message')
      let prepareList = prePrepare.replace('prepareList', 'prepare Messages')
      let result = prepareList.replace('commitList', 'commit Messages')
      return result.charAt(0).toUpperCase() + result.slice(1)
    }
  },
  mounted () {
    let blockId = this.$route.params.blockId
    this.$store.dispatch(LOAD_BLOCK, blockId)
  },

  watch: {
    '$route' (to) {
      this.$store.dispatch(LOAD_BLOCK, to.params.blockId)
    }
  }
}
</script>
<style lang="scss" scoped>
  .index {
    display: inline-block;
    background-color: rgba(128,128,128, 0.6);
    padding:5px;
    border-radius: 5px;
    font-size: 25px;
  }
  .copy {
    color: white;
  }
  .copy:hover {
    transform: scale(1.05);
    color: #9EFFE8;
  }
  .consensus-detail {
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

  .block-detail {
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

  .v-card {
    background-color: rgba(66, 66, 66, 0.3);
    padding-bottom: 10px;
    border-radius: 10px;
  }

  td {
    font-family: 'Roboto', monospace;
    > a {
      text-decoration: none;
    }
    > a:hover {
      color: #9EFFE8;
    }
  }
  .txId {
    color:white;
  }
  .hash {
    font-family: 'Roboto', monospace;
    word-break: break-all;
  }
  .block-contents {
    min-height: 500px;
  }
  .value {
    color: #f2f2f2;
  }
  .timestamp {
    color: #9A9A9A;
  }
</style>
<style>
  @import '../style/mytable.css';
</style>
