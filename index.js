const winston = require('winston');
const gelf = require( 'gelf-pro' );

// support both 2.x and 3.x
let Transport = winston.Transport || require( 'winston-transport' );

class GelfPro extends Transport {
  get name() {
    return 'gelfpro';
  }

  constructor( options = {} ) {
    super( options );
    gelf.setConfig( options.gelfPro );
  }

  log( _compat_level, _compat_msg, info, cb ) {
    let clone = JSON.parse(JSON.stringify(info));

    // support 2.x and 3.x
    let message = (clone.message === undefined) ? _compat_msg : clone.message;
    delete clone.message;

    // support 2.x and 3.x
    let level = (clone.level === undefined) ? _compat_level : clone.level;
    delete clone.level;

    gelf[level](message, info, cb);
  }

}

winston.transports.GelfPro = GelfPro;
module.exports = GelfPro;
