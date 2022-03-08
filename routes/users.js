/**
 * 用户管理模块
 *
 */
const router = require('koa-router')()
const User = require('../models/userSchema')
const util = require('../utils/util')
const jwt = require('jsonwebtoken')
router.prefix('/users')


router.post('/login', async (ctx) => {
    try {
        const {username, userPwd} = ctx.request.body
        const res = await User.findOne({
            username,
            userPwd
        },'usrId userName userEmail state role deptId roleList')
        if (res) {
            const data = res._doc
            const token = jwt.sign({
                data: data
            }, 'ymfsder', {expiresIn: 60*60})
            data.token = token
            ctx.body = util.success(data)
        } else {
            ctx.body = util.fail('账号密码不正确')
        }
    } catch (e) {
        ctx.body = util.fail(e.msg)
    }

})


module.exports = router
