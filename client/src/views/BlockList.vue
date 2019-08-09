<template>
  <div>
    <h1 class="mb-5 text-lg-center white--text">
      <img class="font-weight-bold block-icon" src="@/assets/block-icon.png" style="margin:-3px"/>&nbsp;BLOCKS</h1>
    <v-card class="member__account flexcard">
      <template>
        <v-data-table
                dark
                :headers="headers"
                :items="listingBlocks"
                :pagination.sync="pagination"
                :total-items="totalBlocks"
                :loading="loading"
                :rows-per-page-items="[10]"
                class="elevation-1 mytable">
          <template slot="items" slot-scope="props">
            <td>
              <router-link :to="'blocks/' + props.item.blockId" class="index">
                {{ props.item.index }}
              </router-link>
            </td>
            <td>
              <router-link :to="'blocks/' + props.item.blockId">
                {{ props.item.blockId | shortHash(5)}}...{{props.item.blockId.slice(-5)}}
              </router-link>
            </td>
            <td>
              <router-link :to="'account/' + props.item.author" class="account">
                {{ props.item.author | shortHash(5)}}...{{ props.item.author.slice(-5)}}
              </router-link>
            </td>
            <td>{{ props.item.timestamp | moment('from')}}</td>
            <td>{{ props.item.txSize }}</td>
          </template>
        </v-data-table>
      </template>
    </v-card>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import {
  LOAD_MORE_BLOCKS,
  LOAD_BLOCKS
} from '../store/action-types'

export default {
  data () {
    return {
      loading: false,
      pagination: {
        rowsPerPage: 10,
        totalItems: 0
      },
      headers: [
        { text: 'BLOCK #', sortable: false, width: 'string' },
        { text: 'BLOCK HASH', sortable: false },
        { text: 'BLOCK PROPOSER', sortable: false },
        { text: 'DATE', sortable: false },
        { text: '# OF TXS', sortable: false }
      ],
    }
  },

  watch: {
    pagination: {
      async handler () {
        if (!this.latestBlock.index) {
          await this.$store.dispatch(LOAD_BLOCKS)
        }
        const { page, rowsPerPage } = this.pagination
        if (this.blocks.length < 2) {
          await this.$store.dispatch(LOAD_BLOCKS)
        } else if ((page + 1) * rowsPerPage > this.blocks.length) {
          let offset = this.blocks[this.blocks.length - 1].index - 1
          await this.$store.dispatch(LOAD_MORE_BLOCKS, offset)
        }
      },
      deep: true
    },
  },

  computed: {
    ...mapState([
      'latestBlock', 'blocks'
    ]),
    listingBlocks () {
      const { page, rowsPerPage } = this.pagination
      return this.blocks.slice(0).slice((page - 1) * rowsPerPage, page * rowsPerPage)
    },
    totalBlocks () {
      return this.latestBlock.index
    }
  }
}
</script>
<style lang="scss" scoped>
  .block-icon {
    width:29px;
  }
  td {
    font-family: 'Roboto', monospace;
    font-weight: bold;
    > a {
      text-decoration: none;
    }
    > a:hover { color: #9EFFE8; }
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
