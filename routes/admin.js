const router = require('koa-router')()

router.prefix('/admin')

router.get('/login', async (ctx, next) => {
    await ctx.render('admin/login.admin.pug', {
        title: '登录后台'
    })
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
