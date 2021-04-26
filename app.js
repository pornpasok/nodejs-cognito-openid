const { Issuer } = require('openid-client');
const Koa = require('koa');
const Router = require('koa-router');

(async () => {
  const app = new Koa();
  const router = new Router();

  const issuer = await Issuer.discover('https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_FLs4o2xxx');

  const client = new issuer.Client({
    client_id: 'client_id',
    client_secret: 'client_secret',
    redirect_uris: ['http://localhost:3030/cb'],
    //response_types: ['code'],
  });

  router.get('/init', async (ctx, next) => {
    ctx.body = `<a href="${client.authorizationUrl({
      redirect_uri: client.redirect_uris[0],
      scope: 'openid email',
    })}">login</a>`
  });

  router.get('/cb', async (ctx, next) => {
    try {
      const tokenset = await client.callback(client.redirect_uris[0], ctx.query);
      ctx.body = tokenset;
    } catch (err) {
      ctx.body = err;
    }
    console.log(ctx);
  });

  app.use(router.routes());
  app.listen(3030);
})();
