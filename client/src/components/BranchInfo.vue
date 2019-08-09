<template>
  <div class="branch-detail ml-3 white--text">
    <v-layout wrap class="py-2">
      <v-flex xs12 sm2 fluid class="props">Name</v-flex>
      <v-flex xs12 sm10 xsAndDown class="font-weight-regular value">{{branchInfo.name}}</v-flex>
    </v-layout>
    <v-layout wrap class="py-2">
      <v-flex xs12 sm2 class="props">Symbol</v-flex>
      <v-flex xs12 sm10 class="font-weight-regular value">{{branchInfo.symbol}}</v-flex>
    </v-layout>
    <v-layout wrap class="py-2">
      <v-flex xs12 sm2 class="props">Property</v-flex>
      <v-flex xs12 sm10 class="font-weight-regular value">{{branchInfo.property}}</v-flex>
    </v-layout>
    <v-layout wrap class="py-2">
      <v-flex xs12 sm2 class="props">Description</v-flex>
      <v-flex xs12 sm10 class="font-weight-regular value">{{branchInfo.description}}</v-flex>
    </v-layout>
    <v-layout wrap class="py-2">
      <v-flex xs12 sm2 class="props hidden-xs-only">Contracts</v-flex>
      <v-flex xs12 sm10 class="font-weight-regular value hidden-xs-only">
        <v-list class="remove-background" >
          <div v-for="v in contract(branchInfo.contracts)">
            <v-list-tile-content class="white--text">
              <v-flex>
                {{v.Name}}
                <span class="contractVersion">{{v.Version}}</span>
              </v-flex>
            </v-list-tile-content>
          </div>
        </v-list>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
export default {
  props: [ 'branchInfo', 'linkBase' ],
  data: () => ({
    headers: [
      { text: 'Validator', sortable: false },
      { text: 'Consensus', sortable: false },
      { text: 'Date', sortable: false }
    ],
  }),
  methods: {
    contract (v) {
      let contracts = []
      if (v !== undefined) {
        v.forEach(c => {
          let contract = {
            Version: c.contractVersion,
            Name: c.name
          }
          contracts.push(contract)
        })
        return contracts
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .branch-detail {
    word-break: break-all;
    font-family: 'Roboto';
  }

  .props {
    color: #C5C5C5;
  }
  .contractVersion {
    word-break: break-all;
    font-family: 'Roboto', monospace;
  }
  .remove-background {
    margin-top: -7px;
    background: rgba(255, 255, 255, 0);
  }
</style>
