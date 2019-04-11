const dbService = require('../services/db.services')
const commonService = require('../services/common.services')
let db = {}

const api = [
    // 默认
    {
        url: '/',
        method: 'get',
        cb: (ctx, next) =>{
            ctx.body = 'This is default Api!';
        }
    },
    // 安装数据库
    {
        url: '/install',
        method: 'post',
        cb: async (ctx, next) => {
            // ctx.body = 'This is Install Api!';
            let formData = ctx.request.body
            db = new dbService(formData)

            console.log('数据盘配置成功，正在创建管理员账户'.green)
            await db.addDbUser().then(() => {
                ctx.body = 'success'
            },(err) => {
                console.log(`${err}`.red)
                ctx.status = 501
                ctx.body = err
            })
            
            // await db.connectDb().then(async () => {
            //     console.log('数据盘配置成功，正在创建管理员账户'.green)
            //     await db.addDbUser().then(() => {
            //         ctx.body = 'success'
            //     },(err) => {
            //         console.log(`${err}`.red)
            //         ctx.status = 501
            //         ctx.body = err
            //     })
            // },(err) => {
            //     console.log(`${err}`.red)
            //     ctx.status = 501
            //     ctx.body = err
            // })
        }
    },
    // 配置网站信息
    {
        url: '/config',
        method: 'post',
        cb: async (ctx, next) => {
            let formData = ctx.request.body

            await db.webOptions(formData).then(() => {
                console.log('网站信息配置成功')
                ctx.body = '网站信息配置成功'
            },(err) => {
                console.log(`${err}`.red)
                ctx.status = 501
                ctx.body = err
            });
            
        }
    },
    // 登录
    {
        url: '/login',
        method: "post",
        cb: async (ctx, next) => {
            let formData = ctx.request.body
            // commonService.db
            await global.db.login(formData).then((user) => {
                // console.log(user)
                if(!user){
                    ctx.status = 401
                    ctx.body = '账号不存在'
                }else if(user.pwd != formData.pwd){
                    ctx.status = 401
                    ctx.body = '密码不正确'
                }else{
                    // 缺少token
                    ctx.body = {
                        role: user.role,
                        msg: '登录成功'
                    }
                }
            },(err) => {
                console.log(`${err}`.red)
                ctx.status = 501
                ctx.body = err
            });
        }
    }
]

module.exports = api
