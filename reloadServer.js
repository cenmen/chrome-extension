const SSEStream = require('ssestream').default;

function reloadServer(app, compiler) {
  app.get('/reload', (req, res, next) => {
    console.log('🚀 ~ app.get ~ reload');
    const sseStream = new SSEStream(req);
    sseStream.pipe(res);

    let closed = false;

    const reloadPlugin = () => {
      console.log('🚀 ~ reloadPlugin ~ reloadPlugin');

      if (!closed) {
        const body = {
          event: 'reload',
          data: {
            action: 'reload extension and refresh current page',
          },
        };
        sseStream.write(body, 'utf-8', err => console.error(err));
        setTimeout(() => {
          sseStream.unpipe(res);
        }, 100);
      }
    };

    compiler.hooks.done.tap('afterEmit', reloadPlugin);

    res.on('close', () => {
      console.log('🚀 ~ res.on ~ close');
      closed = true;
      sseStream.unpipe(res);
    });

    next();
  });
}

module.exports = reloadServer;
