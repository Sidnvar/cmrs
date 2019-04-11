const router = require('koa-router')()
const controller = require('../controllers/api.controller')

router.prefix('/api')

controller.forEach(element => {
    router[element.method](element.url, element.cb)
});

module.exports = router
