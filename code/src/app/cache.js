/**
 * 服务器模块，监听页面链接
 * Created by sirzh on 2017/6/15.
 */
module.exports = function () {
    if(!global.cache) global.cache = {};

    // 框架模块
    let p = require("./path")(); // 路径解析
    let jp = require(p.base("jsonp"))(); // json解析
    let db = require(p.base("db"))("app.db"); // 引用db模块

    let start = function() {
        reCache();

        setInterval(reCache, 60*1000);
    };

    let getCache = function() {
        return global.cache;
    };

    let reCache = function() {
        global.cache.users = {};

        db.queryCondition(`select * from base_user`, null, function (data) {
            for(let i in data) cache.users[data[i].username] = data[i];
        });

        return global.cache;
    };

    return { start, getCache, reCache };
};