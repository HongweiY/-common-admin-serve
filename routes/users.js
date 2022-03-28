/**
 * 用户管理模块
 *
 */
const router = require('koa-router')()
const User = require('../models/userSchema')
const util = require('../utils/util')
const jwt = require('jsonwebtoken')
const md5 = require('md5')
const Counter = require('../models/counterSchema')
router.prefix('/users')

router.post('/login', async (ctx) => {
    try {
        const { username, userPwd } = ctx.request.body
        const res = await User.findOne({
            username, userPwd
        }, 'usrId userName userEmail state role deptId roleList')
        if (res) {
            const data = res._doc
            const token = jwt.sign({
                data: data
            }, 'ymfsder', { expiresIn: 60 * 60 })
            data.token = token
            ctx.body = util.success(data)
        } else {
            ctx.body = util.fail('账号密码不正确')
        }
    } catch (e) {
        ctx.body = util.fail(e.msg)
    }
})

// 用户列表
router.get('/list', async (ctx) => {
    const { userName, userEmail, state } = ctx.request.query
    const { page, skipIndex } = util.pager(ctx.request.query)
    const params = {}
    if (state && state !== '0') params.state = state
    if (userName) {
        params.userName = {
            $regex: userName, $options: 'i'
        }
    }
    if (userEmail) {
        params.userEmail = {
            $regex: userEmail, $options: 'i'
        }
    }

    try {
        const list = await User.find(params, { userPwd: 0 }, { skip: skipIndex, limit: page.pageSize }).exec()
        const total = await User.countDocuments(params)
        ctx.body = util.success({
            page: {
                ...page, total
            },
            list
        })
    } catch (e) {
        ctx.body = util.fail(`查询异常${e.stack}`)
    }
})

router.get('/allUsers', async (ctx) => {
    const list = await User.find({}, { userId: 1, userName: 1, userEmail: 1 })
    ctx.body = util.success(list)
})
// 新增用户
router.post('/create', async (ctx) => {
    const { deptId, job, mobile, role, roleList, state, userEmail, userName, _id, action } = ctx.request.body
    let res
    if (action === 'edit') {
        // 编辑
        if (!deptId) {
            ctx.body = util.fail('参数异常', util.CODE.PARAM_ERROR)
        }
        res = await User.findOneAndUpdate({ _id: _id }, { deptId, job, mobile, role, roleList, state })
        if (res) {
            ctx.body = util.success({}, '操作成功')
        }
    } else {
        // 添加
        if (!deptId || !userName || !userEmail) {
            ctx.body = util.fail('参数异常', util.CODE.PARAM_ERROR)
        }
        // 判断系统是否存在用户
        const exitUser = await User.findOne({ $or: [{ userName }, { userEmail }] }, '_id userName userEmail')
        if (exitUser) {
            ctx.body = util.fail(`添加失败。原因：用户名：${exitUser.userName}；用户邮箱：${exitUser.userEmail}的用户已存在`)
            return
        }
        const counterDoc = await Counter.findOneAndUpdate({ _id: 'userId' }, { $inc: { sequenceValue: 1 } }, { new: true })
        const result = await User.create({
            userId: counterDoc.sequenceValue,
            deptId,
            userPwd: md5('123456'),
            job,
            mobile,
            roleList,
            state,
            userEmail,
            userName,
            role: 1
        })
        if (result) {
            ctx.body = util.success({}, '添加成功')
        } else {
            ctx.body = util.fail('数据库异常')
        }
    }
})
// 编辑用户
// todo
// 删除用户
router.post('/delete', async (ctx) => {
    const { ids } = ctx.request.body
    // todo
    const res = await User.updateMany({ _id: { $in: ids } }, { state: 2 })
    if (res) {
        ctx.body = util.success(res, `共删除${res.matchedCount}条`)
        return
    }
    ctx.body = util.fail('删除失败')
})

module.exports = router
