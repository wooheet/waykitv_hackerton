import Vue from 'vue'
import Vuex from 'vuex'

import router from '../router'

import * as requestEs from '../requestToHub'
import * as mTypes from './mutation-types'
import * as aTypes from './action-types'

// import createWsPlugin from './plugin/createWebSocketPlugin'
// const wsPlugin = createWsPlugin("/ws/yggdrash-websocket")

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    networkHealthy: true,
    accountLoading: false,
    txLoading: false,
    blockLoading: false,
    loading: false,
    searchHash: '',
    searchPath: '',
    drawer: null,
    statesOfBranch: [],
    selectedTx: {},
    selectedAccount: {},
    txs: [],
    weeklyTxCounts:[],
    countOfTxs: 0,
    txsInBlock: [],
    txsInAccount: [],
    selectedBlock: {},
    blocks: [],
    latestBlock: {},
    notfoundHash:'',
    notfoundPath:'',
    branchInfo: {},
    branches: [
      {
        name: 'Blocks',
        description: '',
        link: 'yggdrash/blocks'
      },
      {
        name: 'Transactions',
        description: '',
        link: 'yggdrash/txs'
      }
    ],
    currentBranch: {name: '', id: ''},
    isConnected: false
  },

  mutations: {
    [mTypes.TOGGLE_DRAWER] (state) {
      state.drawer = !state.drawer
    },

    [mTypes.SET_STATES] (state, payload) {
      state.statesOfBranch = payload
    },

    [mTypes.SET_BLOCKS] (state, payload) {
      state.blocks = payload
    },

    [mTypes.SET_BRANCHES] (state, payload) {
      state.branchInfo = payload
      // state.branches = payload
    },

    [mTypes.SET_CURRENT_BRANCHE] (state, payload) {
      state.currentBranch = payload
    },

    [mTypes.SET_LATEST_BLOCK] (state, payload) {
      state.latestBlock = payload
    },

    [mTypes.SET_TXS] (state, payload) {
      state.txs = payload
    },

    [mTypes.SET_TXS_COUNT] (state, payload) {
      state.countOfTxs = payload
    },

    [mTypes.SET_TXS_CHART_COUNT] (state, payload) {
      state.weeklyTxCounts = payload
    },

    [mTypes.SET_TXS_IN_BLOCK] (state, payload) {
      state.txsInBlock = payload
    },

    [mTypes.ADD_TXS] (state, payload) {
      state.txs = payload.concat(state.txs)
    },

    [mTypes.ADD_TX] (state, payload) {
      state.txs.unshift(payload)
    },

    [mTypes.ADD_BLOCK] (state, payload) {
      state.blocks.unshift(payload)
      state.latestBlock = payload
    },

    [mTypes.SET_SEARCH_HASH] (state, payload) {
      state.searchHash = payload
    },

    [mTypes.SET_SEARCH_PATH] (state, payload) {
      state.searchPath = payload
    },

    [mTypes.SET_IS_CONNECTED] (state, payload) {
      state.isConnected = payload
    },

    [mTypes.SELECT_BLOCK] (state, payload) {
      state.selectedBlock = payload
    },

    [mTypes.SELECT_TX] (state, payload) {
      state.selectedTx = payload
    },

    [mTypes.SELECT_ACCOUNT] (state, payload) {
      state.selectedAccount = payload
    },

    [mTypes.SET_TXS_IN_ACCOUNT] (state, payload) {
      state.txsInAccount = payload
    },

    [mTypes.SET_NOTFOUND_HASH] (state, payload) {
      state.notfoundHash = payload
    },

    [mTypes.SET_NOTFOUND_PATH] (state, payload) {
      state.notfoundPath = payload
    },

    [mTypes.LOADING] (state, payload) {
      if (payload) {
        state.loading = payload
      } else {
        setInterval(() => {
          state.loading = payload
        }, 1000)
      }
    },

    [mTypes.BLOCK_LOADING] (state, payload) {
      if (payload) {
        state.blockLoading = payload
      } else {
        setInterval(() => {
          state.blockLoading = payload
        }, 1000)
      }
    },

    [mTypes.TX_LOADING] (state, payload) {
      if (payload) {
        state.txLoading = payload
      } else {
        setInterval(() => {
          state.txLoading = payload
        }, 1000)
      }
    },

    [mTypes.ACCOUNT_LOADING] (state, payload) {
      if (payload) {
        state.accountLoading = payload
      } else {
        setInterval(() => {
          state.accountLoading = payload
        }, 1000)
      }
    },

    [mTypes.SET_NETWORK] (state, payload) {
      state.networkHealthy = payload
    }
  },

  actions: {
    async [aTypes.LOAD_ALL_DATA] ({ commit, state }) {
      try {
        const res = await requestEs.getAllData();
        let proxyNodeStatus = res._health.proxyNode;
        let esStatus = res._health.elasticsearch;

        commit(mTypes.SET_NETWORK, proxyNodeStatus || esStatus)
        commit(mTypes.SET_BRANCHES, Object.values(res._branch)[0])
        commit(mTypes.SET_BLOCKS, res._blocks)
        commit(mTypes.SET_LATEST_BLOCK, res._blocks[0])
        commit(mTypes.SET_TXS, res._txs.txs)
        commit(mTypes.SET_TXS_COUNT, res._txs.count);
        commit(mTypes.SET_TXS_CHART_COUNT, res._txs.recent);
        commit(mTypes.LOADING, false)
      } catch (e) {
        console.error(e);
        commit(mTypes.SET_NETWORK, false);

      }

    },

    async [aTypes.NETWORK_HEALTH_CHECK] ({ commit, state }) {
      try {
      const res = await requestEs.getNetworkStatus()
        if (res._proxyNode && res._elasticSearch) {
          commit(mTypes.SET_NETWORK, true)
        }
        else {
          commit(mTypes.SET_NETWORK, false)
          // commit(mTypes.LOADING, true);
        }
      } catch(e) {
        console.log(e)
        commit(mTypes.SET_NETWORK, false)
        // commit(mTypes.LOADING, true);
      }
    },

    async [aTypes.LOAD_TXS] ({ commit, state }, refresh) {
      if (refresh) {
        const txs = await requestEs.getTxs()
        const counts = await requestEs.getTxsCounts()
        commit(mTypes.SET_TXS, txs.data._data)
        commit(mTypes.SET_TXS_COUNT, counts.data.count)
      } else {
        const txs = await requestEs.getTxs()
        const counts = await requestEs.getTxsCounts()
        commit(mTypes.SET_TXS, txs.data._data)
        commit(mTypes.SET_TXS_COUNT, counts.data.count)
        commit(mTypes.LOADING, false)
      }
    },

    async [aTypes.LOAD_BLOCKS] ({ commit, state }) {
      try {
        const res = await requestEs.getBlocks(state.currentBranch.id)
        console.log(res)
        if(res.data._success) {
          let payload = res.data._data;
          if (payload) {
            commit(mTypes.SET_BLOCKS, payload)
            commit(mTypes.SET_LATEST_BLOCK, payload[0])
          } else {
            commit(mTypes.SET_BLOCKS, [])
            commit(mTypes.SET_LATEST_BLOCK, {})
          }
        }
      } catch(e) {
        console.log(e);
      }
    },

    async [aTypes.LOAD_MORE_BLOCKS] ({ commit, state }, offset) {
      if (offset === 0) return
      const res = await requestEs.getBlocks(state.currentBranch.id, offset)
      let payload = res.data._data;
      commit(mTypes.SET_BLOCKS, [...state.blocks, ...payload])
    },

    async [aTypes.LOAD_MORE_TXS] ({ commit, state }, offset) {
      if (offset === 0) return
      const res = await requestEs.getTxs(offset)
      let payload = res.data._data
      let lastIndex = state.txs[state.txs.length -1].blockIndex
      let before = []
      state.txs.forEach(tx => {
        if (tx.blockIndex === lastIndex) {
          before.push(tx)
        }
      })

      let count = 0
      payload.forEach(tx => {
        if (tx.blockIndex === lastIndex) {
          before.forEach(t => {
            if (t.txId === tx.txId) {
              count++
            }
          })
        }
      })
      payload.splice(0, count)

      commit(mTypes.SET_TXS, [...state.txs, ...payload])
    },

    async [aTypes.LOAD_BRANCHES] ({ commit, state }) {
      const branch = await requestEs.getBranch()
      commit(mTypes.SET_BRANCHES, branch)
    },

    async [aTypes.LOAD_CHART] ({ commit, state }) {
      // cache
      if (state.weeklyTxCounts.length > 0) {
        return state.weeklyTxCounts
      }

      let weeklyChartDate2 = await requestEs.getRecentTxCount()
      commit(mTypes.SET_TXS_CHART_COUNT, weeklyChartDate2)
    },

    async [aTypes.LOAD_BLOCK] ({ commit, state }, id) {
      commit(mTypes.BLOCK_LOADING, true)
      try {
        let foundBlock =
          await state.blocks.find(b => {return Number(id) === b.index || id === b.blockId}) ||
          await requestEs.getBlock(state.currentBranch.id, id);

        let foundTxs = await requestEs.getTxsByBlockId(foundBlock.blockId);
        commit(mTypes.SELECT_BLOCK, foundBlock)
        commit(mTypes.SET_TXS_IN_BLOCK, foundTxs)
        commit(mTypes.BLOCK_LOADING, false)
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          // console.log(error.response.data);
          // console.log(error.response.headers);
          router.push(`/error/${id}`)
          commit(mTypes.SET_NOTFOUND_HASH, id)
          commit(mTypes.SET_NOTFOUND_PATH, 'blocks')
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      }
    },

    async [aTypes.LOAD_ACCOUNT] ({ commit, state }, address) {
      try {
        commit(mTypes.ACCOUNT_LOADING, true)
        let account = await requestEs.getAccount(address)
        //TODO: tx not found
        commit(mTypes.SELECT_ACCOUNT, account)
        commit(mTypes.SET_TXS_IN_ACCOUNT, account.TXs)
        commit(mTypes.ACCOUNT_LOADING, false)
      } catch (e) {
        if (e.response) {
          router.push(`/error/${address}`)
          commit(mTypes.SET_NOTFOUND_HASH, address)
          commit(mTypes.SET_NOTFOUND_PATH, 'format')
        } else if (e.request) {
          console.log(e.request);
        } else {
          console.log('Error', e.message);
        }
      }
    },

    async [aTypes.LOAD_TX] ({commit, state}, id) {
      try {
        let foundTx
        if (state.txs.length !== 0) {
          foundTx = await state.txs.find(tx => {
            return id === tx.txId
          })
        }
        commit(mTypes.TX_LOADING, true)
        const tx = await requestEs.getTx(id)
        const txReceipt = await requestEs.getTxReceipt(id)
        foundTx = tx.data
        foundTx.txReceiptStatus = txReceipt.data ? txReceipt.data.status : {}
        foundTx.txReceipt = txReceipt.data ? txReceipt.data : {}

        commit(mTypes.SELECT_TX, foundTx)
        commit(mTypes.TX_LOADING, false)
      } catch (e) {
        if (e.response) {
          router.push(`/error/${id}`)
          commit(mTypes.SET_NOTFOUND_PATH, 'transactions')
          commit(mTypes.SET_NOTFOUND_HASH, id)
        } else if (e.request) {
          console.log(e.request);
        } else {
          console.log('Error', e.message);
        }
      }
    },

    async [aTypes.SEARCH_INPUT_HASH] ({commit, state}, hash) {
      commit(mTypes.SET_SEARCH_HASH, hash)
    },

    async [aTypes.SEARCH] ({commit, state}, hash) {

      if (hash === '') {
        commit(mTypes.SET_SEARCH_PATH, 'nothing_to_do');
      }
      else {
        try {
          let result = await requestEs.search(hash);
          commit(mTypes.SET_SEARCH_PATH, result.data._type);
          commit(mTypes.SET_SEARCH_HASH, result.data._path)

        } catch (e) {
          console.log(e.message);
          commit(mTypes.SET_SEARCH_PATH, 'NOT_FOUND');
        }
      }

    },

    async [aTypes.LOAD_MERGED_BLOCKS] ({ commit, state }) {
      //TODO MUST REFACTORING!
      let activeBrancheIds = state.branches.filter(b => b.active).map(b => b.id)
      let firstRes = []
      let secondRes = []
      let mergedBlocks = []
      if(activeBrancheIds.length > 0) {
        firstRes = await requestEs.getBlocks(activeBrancheIds[0])
        mergedBlocks = [
          ...mergedBlocks,
          ...firstRes.data
        ]
      }

      if (activeBrancheIds.length > 1) {
        secondRes = await requestEs.getBlocks(activeBrancheIds[1])
        mergedBlocks = [
          ...mergedBlocks,
          ...secondRes.data
        ]
      }
      mergedBlocks.sort((a, b) => {
        return a.timestamp < b.timestamp ? 1 : a.timestamp > b.timestamp ? -1 : 0
      })

      commit(mTypes.SET_BLOCKS, mergedBlocks)
    }
  },

  getters: {
    loading(state) {
      return state.loading
    },
    linkBase() {
      return `/waykitv`
    }
  }
})
