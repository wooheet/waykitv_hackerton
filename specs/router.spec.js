const query = require('../server/core/es/query');
const http = require('../server/core/axios/axios');

const branchId = require('../package').config.yggdrash.branch.id;
const contractVersion = require('../package').config.yggdrash.contract.version;

describe('ElasticSearch Query Test', () => {

  it('getAllBlocks', done => {
    query.block.findAll(0, 20, 0, branchId, contractVersion);


  })

});
