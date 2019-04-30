/**
 * Created by sirzh on 2018/4/16.
 */
module.exports = function (app) {
    let main = require("../../main")(); // 主框架
    let p = main.p; // 路径解析
    let cache = main.cache; // 缓存
    let db = main.db(); // 引用db模块
    let jp = main.jp; // jsonp解析
    let service = require(p.service("index"));

    app.use("/info", function (request, response) {
        response.send(jp.r(request.query, service(request)));
    });

    return app;
};