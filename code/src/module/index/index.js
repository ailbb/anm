/**
 * Created by sirzh on 2018/4/16.
 */
module.exports = function (request) {
    let main = require("../../main")(); // 主框架
    let p = main.p; // 路径解析
    let moment = require(p("moment"));
    let r = {};

    r.ip = request.header('x-forwarded-for') ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress;
    r.cookie = request.headers["cookie"];
    r.headers = JSON.stringify(request.headers);
    r.time = moment().format('YYYY-MM-DD HH:mm:ss');

    return r;
};