const router = require('koa-router')()

router.get('/', async (ctx, next) => {
    await ctx.render('index', {
        title: 'Hello Koa 2!'
    })
})

router.get('/string', async (ctx, next) => {
    ctx.body = 'koa2 string'
})

router.get('/install', async (ctx, next) => {
    await ctx.render('install/index.install.pug', {
        title: '配置数据库'
      })
})

router.get('/config', async (ctx, next) => {
    await ctx.render('install/config.install.pug', {
        title: '配置网站信息'
    })
})


module.exports = router
