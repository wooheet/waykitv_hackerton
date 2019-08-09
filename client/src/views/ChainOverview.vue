<template>
  <div v-if="loading">
    <v-container fill-height grid-list-xs mt-5 class="text-xs-center">
      <img src="@/assets/images/loading.svg" style="margin: 0 auto">
    </v-container>
  </div>
  <div v-else>
    <v-slide-y-transition mode="out-in">
      <v-layout column >
        <v-flex>
          <v-layout wrap >
            <v-flex sm12 md6 pa-1>
              <v-flex mb-0 >
                <v-card class="network-info">
                  <span class="title font-weight-medium mb-5 ml-3 white--text">NETWORK INFO </span>
                  <BranchInfo class="mt-4" :branchInfo="branchInfo" :linkBase="linkBase"/>
                </v-card>
              </v-flex>
            </v-flex>
            <v-flex sm12 md6 pa-1>
              <v-card dark class="opacity">
                <v-layout row wrap>
                  <v-flex sm11>
                    <span class="title font-weight-medium mb-2 ml-3 white--text">MOST RECENT BLOCKS</span>
                  </v-flex>
                  <v-flex>
                    <v-btn small icon class="refresh" @click="refreshBlcok()">
                      <v-icon>
                        refresh
                      </v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
                <RecentBlockWidget :blocks="blocks" :linkBase="linkBase"/>
                <div class="text-xs-center">
                  <v-btn round flat :to="`${linkBase}/blocks`">
                    View All</v-btn>
                </div>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-slide-y-transition>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<script>
import { mapState, mapGetters } from 'vuex'
import RecentBlockWidget from '../components/RecentBlockWidget'
import BranchInfo from '../components/BranchInfo'
import {
  LOAD_BLOCKS,
  LOAD_TXS,
  LOAD_CHART
} from '../store/action-types'

export default {
  components: {
    RecentBlockWidget,
    BranchInfo,
  },
  computed: {
    ...mapState([
      'blocks',
      'currentBranch',
      'branches',
      'branchInfo',
      'txs',
      'countOfTxs',
      'loading'
    ]),

    ...mapState({
      chart: 'weeklyTxCounts'
    }),

    ...mapGetters([
      'linkBase'
    ]),
  },

  methods: {

    refreshBlcok () {
      this.$store.dispatch(LOAD_BLOCKS)
    },
    refreshTx () {
      this.$store.dispatch(LOAD_TXS, true)
    }
  },

  watch: {
    '$route' (to) {
      this.$store.dispatch(LOAD_BLOCKS)
      this.$store.dispatch(LOAD_TXS, false)
      this.$store.dispatch(LOAD_CHART)
    },
  },
}
</script>
<style lang="scss" scoped>
  td {
    font-family: 'Roboto', monospace;
  }
  .v-card {
    border-radius: 10px;
    padding-top:20px;
    padding-bottom:10px;
  }
  .v-btn {
    background: rgba(255, 255, 255, 0.1);
  }
  .span {
    font-style: normal;
    font-weight: bold;
    font-size: 13px;
    line-height: 15px;
    text-transform: uppercase
  }
  .opacity {
    background-color: rgba(66, 66, 66, 0.3);
  }
  .transaction-history {
    background-color: rgba(66, 66, 66, 0.3);
    height: 300px;
  }
  .network-info {
    background-color: rgba(66, 66, 66, 0.3);
    height: 300px;
  }
  .refresh {
    margin-top: -2px;
  }
  .refresh:hover {
    color: #83AFA5;
  }
</style>
