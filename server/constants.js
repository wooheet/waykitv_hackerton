'use strict';

let constants = {
  HOSTING_CONTRACT: '1110971-1',
  VOTE_HOST: 'GAME_STATE:HOST_VOTER',
  VOTE_GUEST: 'GAME_STATE:GUEST_VOTER',
  INITIALIZE_METHOD: '0001',
  VOTE_METHOD: '0002',
  END_METHOD: '0003',
  VOTING_TO_HOST: '01',
  VOTING_TO_GUEST: '02',
  END_TIME: '00000000'

};

module.exports =
  Object.freeze(constants);
