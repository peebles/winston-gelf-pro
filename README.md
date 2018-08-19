# winston-gelf-pro

I know.  Why yet another winston GELF/Graylog transport?  Because all of the others are pretty old and
seemingly not well supported.  One or two came close, but I needed UDP support and I wanted modern
[gelf-pro](https://github.com/kkamkou/node-gelf-pro) support for `transform` and `broadcast`.  So here we are.

## Usage

This transport should work with both winston 2.x and 3.x.  For 2.x, do something like

```sh
npm install winston@2
npm install winston-gelf-pro
```

Then:

```javascript
const winston = require( 'winston' );
const package = require( './package.json' );
require( 'winston-gelf-pro' );

let transports = [];

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
            // a little nicer.
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
```

See [gelf-pro](https://github.com/kkamkou/node-gelf-pro) for the options you can specify in "gelfPro".

