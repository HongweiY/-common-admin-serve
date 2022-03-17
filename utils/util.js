/**
 * 通用工具函数
 * @type {{}}
 */

const log4j = require('./log4j')

const CODE = {
    SUCCESS: 200,
    PARAM_ERROR: 10001, // 参数错误
    USER_ACCOUNT_ERROR: 20001, // 用户名密码错误
    USER_LOGIN_ERROR: 30001, // 用户未登录
    BUSINESS_ERROR: 40001, // 业务请求失败
    AUTH_ERROR: 50001// 权限验证失败
}

module.exports = {
    /**
     *分页结构分装
     * @param pageNum
     * @param pageSize
     */
    pager ({ pageNum = 1, pageSize = 10 }) {
        pageNum *= 1
        pageSize *= 1
        const skipIndex = (pageNum - 1) * pageSize
        return {
            page: {
                pageNum, pageSize
            },
            skipIndex
        }
    },
    success (data = '', msg = '', code = CODE.SUCCESS) {
        log4j.debug(data)
        return {
            code, msg, data
        }
    },
    fail (msg = '', code = CODE.BUSINESS_ERROR) {
        log4j.error(msg)
        return {
            code, msg
        }
    },
    CODE
}
