'use strict';

const config = require('../config');


if (config.isDevMode()) {
    process.on('uncaughtException', function (er) {
        console.error(er.stack);
        process.exit(1);
    })
}
else if (config.isProductionMode()) {
    process.on('uncaughtException', function (er) {
        console.error(er.stack);
        logger.error(er.stack);
    })
}


// https://strongloop.com/strongblog/robust-node-applications-error-handling/
/**
 var nodemailer = require('nodemailer')
 var transport = nodemailer.createTransport('SMTP', { // [1]
  service: "Gmail",
  auth: {
    user: "gmail.user@gmail.com",
    pass: "userpass"
  }
})

 if (process.env.NODE_ENV === 'production') { // [2]
  process.on('uncaughtException', function (er) {
    console.error(er.stack) // [3]
    transport.sendMail({
      from: 'alerts@mycompany.com',
      to: 'alert@mycompany.com',
      subject: er.message,
      text: er.stack // [4]
    }, function (er) {
       if (er) console.error(er)
       process.exit(1) // [5]
    })
  })
}
 */

