/**
 * Created by sirzh on 2018/4/16.
 */
module.exports = function (app) {
    let p = require("../path")(); // 路径解析
    let db = require("../db")(); // 引用db模块
    let jp = require("../jsonp")(); // jsonp解析
    let http = require("http");
    let moment = require(p("moment"));

    app.use("/appinfo", function (request, response) {
        db.queryCondition(`SELECT * FROM APP`, jp.c(request.query), function (data) {
            response.send(jp.r(request.query, data));
            let ip = request.headers['x-forwarded-for'] ||
                request.connection.remoteAddress ||
                request.socket.remoteAddress ||
                request.connection.socket.remoteAddress;
            let times = data[0].times + 1;
            let time = moment().format('YYYY-MM-DD HH:mm:ss');
            let version = data[0].version;

            // 更新数据
            db.run(`
               UPDATE APP
               SET IP='${ip}',TIMES=${times},TIME='${time}'
               WHERE VERSION = '${version}'
            `);
        });
    });

    app.use("/moduleinfo", function (request, response) {
        db.queryCondition(`SELECT * FROM MODULE`, jp.c(request.query), function (data) {
            response.send(jp.r(request.query, data));
        });
    });

    app.use("/ajj", function (request, response) {
        response.redirect("https://github.com/ailbb/ajj");
    });

    app.use("/arn", function (request, response) {
        response.redirect("https://github.com/ailbb/arn");
    });

    app.use("/act", function (request, response) {
        response.redirect("https://github.com/ailbb/act");
    });

    app.use("/alt", function (request, response) {
        response.redirect("https://github.com/ailbb/alt");
    });

    app.use("/anm", function (request, response) {
        response.redirect("https://github.com/ailbb/anm");
    });

    return app;
};