const app = require("express");
const router = app.Router();
const _ = require('lodash');

const logger = require('../core/logger');

const ygg = require('../core/yggdrash');

const query =require('../core/es/query');

const sha1Regex = '[A-Fa-f0-9]{40}';
const sha3Regex = '[A-Fa-f0-9]{64}';

const parser = require('../core/es/parser');

router.get('/', async function (req, res) {
    try {
        // let response = await ygg.getBalance('4e5cbe1d0db35add81e7f2840eeb250b5b469161');
        // let response = await ygg.getAllBalance();
        // let response = await ygg.getTxReceipt('0158e0ce4e06e32e50d4be35230fffd72461f4aa013a98f3ab1fdf79045d36a8');
        // let response = await ygg.getAllContractList();
        // let response = await ygg.test();
        // console.log(response);
        // res.status(200).send(response);


        // let response = await es.search({
        //     index: INDEX.TX,
        //     body: {
        //         size: 0,
        //         query : {
        //             "range": {
        //                 "timestamp": {
        //                     "gte": "now-8d"
        //                 }
        //             }
        //         },
        //         aggs : {
        //             "day_counter" : {
        //                 "date_histogram" : {
        //                     "field" : "timestamp",
        //                     "interval" : "day",
        //                     "format" : "yyyy-MM-dd"
        //                 }
        //             }
        //         }
        //     }
        // });
        //
        // let data = _.map(response.body.aggregations.day_counter.buckets, data => {
        //     let date = data.key_as_string;
        //     let count = data.doc_count;
        //
        //     return {
        //         date,
        //         count
        //     }
        // });

        // console.log(data);

        // logger.info('%a', response.aggregations.test.buckets);
        // let data = await ygg.getAllBalance();
        let response = await query.block.findAll();
        let blockData = parser.parseElastic(response);

        let authors = _.map(blockData, (item) => {
            return item.author;
        });

        let blockId = _.map(blockData, (item) => {
            return item.blockId;
        })

        let response2 = await query.tx.findAll();
        let txData = parser.parseElastic(response2);
        let txId = _.map(txData, (item) => {
            return item.txId;
        })

        console.log(blockId);
        console.log();
        console.log(txId);

        res.send(authors);
    } catch (e) {
        logger.debug(`${e}`);
        res.send(e);
    }



});

router.get('/:condition', async (req, res) => {
    if (!req.params.condition) {
        return res.status(401).end('not query');
    }

    res.send(req.params.condition);
});


module.exports = router;


let validation = {
    isNumber: (query) => {
        let pattern = new RegExp(/^\d+$/);
        return pattern.test(query);
    },

    isAccount: (query) => {
        let pattern = new RegExp(/^[A-Fa-f0-9]{40}$/);
        return pattern.test(query);

    },

    isHash: (query) => {
        let pattern = new RegExp(/^[A-Fa-f0-9]{64}$/);
        return pattern.test(query);
    }
};

module.exports = router;
