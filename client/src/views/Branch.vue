<template>
  <v-container>
    <v-slide-y-transition mode="out-in">
      <v-layout column>
        <v-flex mb-4/>
        <router-view></router-view>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>
<script>
  export default {
    data: () => ({
      currentBranch: {
        name: 'YGGDRASH',
        active: true,
        id: '98790b39c9010759bf3a588eb2d5ea5467764b8e'
      }
    }),
    computed: {
    },
  }
</script>
<style lang="scss" scoped>
  .branch-name {
    flex-grow: 0;
  }

  .branch-id {
    word-break: break-all;
  }

  .v-chip--small {
    height: 18px;
  }
</style>
