/**
 * 服务器模块，监听页面链接
 * Created by sirzh on 2017/6/15.
 */
module.exports = function () {
    // 自定义模块
    let p = require("./app/path")(); // 路径解析
    let cache = require(p.base("cache"))(); // 引用db模块
    let server = require(p.base("server"))(); // 引用系统服务模块
    let jp = require(p.base("jsonp"))(); // json解析
    let db = require(p.base("db")); // 引用db模块

    return {
      p,
      jp,
      db,
      server,
      cache,
      start: server.start,
    };
};