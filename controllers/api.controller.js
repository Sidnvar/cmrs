const dbService = require('../services/db.services')
const commonService = require('../services/common.services')
const nav = require('../utils/nav')
const jwt = require('jsonwebtoken')
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
            await global.db.login(formData).then(async (user) => {
                // console.log(user)
                if(!user){
                    ctx.body = {
                        success: false,
                        msg: '账号不存在'
                    }
                }else if(user.pwd != formData.pwd){
                    ctx.body = {
                        success: false,
                        msg: '密码不正确'
                    }
                }else{
                    // console.log(user.roles['_id'])
                    await global.db.getRole(user.roles['_id']).then((data) => {
                        let menu = user.roles != -1 ? new nav(data[0].roles) : new nav(-1)

                        const token = jwt.sign(
                            {
                                name: ctx.request.body //需要放到token的参数
                            },
                            'root', //随便一点内容，加密的密文，私钥对应着公钥
                            {
                                expiresIn: 60 * 60 //60分钟到期时间
                            }
                        )

                        // commonService.user.push({
                        //     token: token,
                        //     menu: menu.menu
                        // })

                        commonService.user[token] = menu.menu

                        ctx.cookies.set(
                            'token', token
                        )

                        ctx.body = {
                            success: true,
                            msg: '登录成功',
                            menu: menu.menu
                        }
                    });
                }
            },(err) => {
                console.log(`${err}`.red)
                ctx.status = 501
                ctx.body = err
            });
        }
    },
    // 获取菜单
    {
        url: '/getMenu',
        method: 'get',
        cb: (ctx, next) => {
        //    ctx.body = ctx.cookies.get('token')
            let _token = ctx.cookies.get('token')
            let _menu = commonService.user[_token]
            if(_menu){
                ctx.body = {
                    success: true,
                    msg: '菜单获取成功',
                    menu: _menu
                }

                return
            }

            ctx.body = {
                success: false,
                msg: '用户授权过期',
                menu: _menu
            }

        }
    },
    // 获取角色列表
    {
        url: '/getRoleList',
        method: 'get',
        cb: async (ctx, next) => {
            await global.db.getRole().then(async (data) => {
                ctx.body = {
                    success: true,
                    msg: '请求成功',
                    data: data
                }
            });
        }
    },
    // 添加角色
    {
        url: '/addRole',
        method: 'post',
        cb: async (ctx, next) => {
            let formData = ctx.request.body

            await  global.db.addRole(formData).then((msg) => {
                ctx.body = {
                    msg: '添加成功'
                }
            });
        }
    },
    // 删除角色
    {
        url: '/dropRole',
        method: 'post',
        cb: async (ctx, next) => {
            let _id = ctx.request.body['_id']

            await global.db.dropRole(_id).then((msg) => {
                ctx.body = {
                    success: true,
                    msg: '删除成功'
                }
            });
        } 
    },
    // 获取用户列表
    {
        url: '/getUserList',
        method: 'get',
        cb: async (ctx, next) => {
            await global.db.getAdminUser().then(data => {
                ctx.body = {
                    success: true,
                    msg: '请求成功',
                    data: data
                }
            });
        }
    },
    // 添加用户
    {
        url: '/addUser',
        method: 'post',
        cb: async (ctx, next) => {
            let formData = ctx.request.body

            await global.db.addAdminUser(formData).then((msg) => {
                ctx.body = {
                    msg: '添加成功'
                }
            });
        }
    },
    // 删除用户
    {
        url: '/dropUser',
        method: 'post',
        cb: async (ctx, next) => {
            let _id = ctx.request.body['_id']

            await global.db.dropAdminUser(_id).then((msg) => {
                ctx.body = {
                    success: true,
                    msg: '删除成功'
                }
            });
        }
    },
    // 获取权限
    {
        url: '/getAuth',
        method: 'get',
        cb: async (ctx, next) => {
            let menu = new nav(-1)
            ctx.body = menu
        }
    }
]

module.exports = api
