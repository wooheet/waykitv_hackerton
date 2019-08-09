<template>
  <v-footer absolute fixed height="auto" app>
    <v-container class="py-4" style="max-width: 1440px; margin:auto;">
      <v-flex text-xs-right white--text>
        <span class="ml-1 mr-4 sns" >
          <a href="https://github.com/WaykiChain" target="_blank">
            <img :src="require(`@/assets/github.png`)" alt="github"></a>
        </span>
        <span class="ml-1 mr-4 sns" >
          <a href="https://www.facebook.com/waykichainofficial/" target="_blank">
            <img :src="require(`@/assets/facebook.png`)" alt="facebook"></a>
        </span>
        <span class="ml-1 mr-5 sns" >
          <a href="https://twitter.com/wayki_chain" target="_blank">
            <img :src="require(`@/assets/twitter.png`)" alt="twitter"></a>
        </span>
        <strong class="footer">Copyright © 2019 WAYKITV All Rights Reserved.</strong>
      </v-flex>
    </v-container>
  </v-footer>
</template>

<style lang="scss" scoped>
  .v-footer {
    background: rgba(0, 15, 14, 0);
    color: white;
  }
  strong {
    font-style: normal;
    font-weight: normal;
    font-size: 10px;
    line-height: 12px;
    text-transform: uppercase;
    color: #BFBFBF;
  }
  .sns {
    cursor: pointer;
    color: white;
    filter: brightness(1.4);
  }
</style>
