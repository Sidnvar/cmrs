const router = require('koa-router')()

router.prefix('/admin')

router.get('/', async (ctx, next) => {
  await ctx.render('admin/index.admin.pug', {
    title: '后台管理'
  })
})

router.get('/role', async (ctx, next) => {
  await ctx.render('admin/role.admin.pug', {
    title: '角色管理'
  })
})

router.get('/user', async (ctx, next) => {
  await global.db.getAdminUser().then(async (users) => {
    await global.db.getRole().then(async (roles) => {
      await ctx.render('admin/user.admin.pug', {
        title: '用户管理',
        users: users,
        roles: roles
      })
    });
  })
})

router.get('/login', async (ctx, next) => {
  await ctx.render('admin/login.admin.pug', {
    title: '登录后台'
  })
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
