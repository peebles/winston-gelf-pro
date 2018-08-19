const winston = require( 'winston' );
const package = require( '../package.json' );
require( '../index' );

let transports = [];

transports.push(
  new winston.transports.Console({
    handleExceptions: true,
    humanReadableUnhandledException: true,
    colorize: true,
    timestamp: true,
    prettyPrint: function( meta ) {
      if ( meta && meta.trace && meta.stack && meta.stack.length ) {
        if ( Array.isArray( meta.stack ) )
          return "\n" + meta.stack.slice(1).join( "\n" );
        else
          return "\n" + meta.stack;
      }
      else if ( meta && meta.message && meta.stack ) {
	return meta.stack;
      }
      return JSON.stringify( meta );
    },

  })
);

transports.push(
  new winston.transports.GelfPro({
    level: 'debug',
    handleExceptions: true,
    humanReadableUnhandledException: true,
    gelfPro: {
      fields: {
	env: process.env.NODE_ENV || 'development',
	program: package.name,
      },
      transform: [
	function(m) {
	  if ( m.process && m.os && m.trace && m.stack ) {
	    // This is an uncaught exception.  Format it so it shows up
	    // in logregator nicer.
	    m.short_message = m.stack.join('\n');
	    delete m.date;
	    delete m.process;
	    delete m.os;
	    delete m.trace;
	    delete m.stack;
	  }
	  return m;
	}
      ],
      adapterName: 'udp',
      adapterOptions: {
	protocol: 'udp4',
	host: '192.168.99.100',
	port: 12201
      }
    }
  })
);

log = new (winston.Logger)({
  transports: transports
});

log.info( 'here we go', 'again' );
log.info( 'here we go', {"foo":"bar"} );
log.debug( 'This is a debug message' );
log.warn( 'This is a warning' );
log.error( 'error:', new Error( 'MyError Message' ) );
log.error( new Error( 'GENERATED' ) );

let foo = bar;

setTimeout(() => {
  process.exit();
}, 1000 );
