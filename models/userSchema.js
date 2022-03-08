/**
 *
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    "userId": Number,
    "userName": String,
    "userPwd": String,
    "userEmail": String, // 用宏邮箱
    "mobile": String,//手机号
    "sex": Number,// 性别0 男 1 女
    "deptId": [],//部门
    "job": String, //岗位
    "state": {
        type: Number,
        default: 1
    },//1 在职 2:离职 3:试用期
    "role": {
        type: Number,
        default: 1
    },// 0.系統管理员 1.昔通用户
    "roleList": [],// 用户角色
    "createTime": {
        type: Date,
        default: Date.now()
    },
    "lastLoginTime": {
        type: Date,
        default: Date.now()
    }, // 更新时间
    remark: String
})

module.exports = mongoose.model('users', userSchema, 'users')