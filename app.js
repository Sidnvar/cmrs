const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const jwt = require('./utils/jwt')
// 导入路由
const index = require('./routes/index')
const users = require('./routes/users')
const api = require('./routes/api')
const admin = require('./routes/admin')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// 验证token
// app.use(async (ctx, next) => {
//   if(ctx.url != '/api/login'){
//     let _token = ctx.cookies.get('token') || null
//     let _jwt = new jwt(_token)
//     let _verify = _jwt.verifyToken();

//     if(!_verify){
//       ctx.body = {
//         success: false,
//         msg: '用户授权过期'
//       }

//       return
//     }
//   }
//   await next()
// })
// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(api.routes(), api.allowedMethods())
app.use(admin.routes(), admin.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
