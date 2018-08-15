/**
 * 服务器模块，监听页面链接
 * Created by sirzh on 2017/6/15.
 */
module.exports = function () {
    let p = require("./path")(); // 路径解析
    let jp = require("./jsonp")(); // json解析
    let db = require("./db")(); // 引用db模块
    let moment = require(p("moment"));

    let express = require(p("express"));
    let fs = require("fs");
    let app = express(); // 引用express模块

    // 拦截配置文件，过滤注释
    app.use("/dispatch/config/*.json", function (request, response) {
        response.send(fs.readFileSync(p('/code/web/' + request.baseUrl)).toString().replace(/\/\/.*/g, ""));
    });

    // 拦截模块文件，记录信息
    app.use("/**/*.html", function (request, response, next) {
        if(request.query.id != undefined)
            db.queryCondition(`SELECT * FROM MODULE`, jp.c(request.query), function (data) {
                let ip = request.headers['x-forwarded-for'] ||
                    request.connection.remoteAddress ||
                    request.socket.remoteAddress ||
                    request.connection.socket.remoteAddress;
                let count = data[0].count + 1;
                let time = moment().format('YYYY-MM-DD HH:mm:ss');

                // 更新数据
                db.run(`
                   UPDATE MODULE
                   SET IP='${ip}',COUNT=${count},TIME='${time}'
                   WHERE ID = '${request.query.id}'
                `);
            });

        next();
    });

    console.info("======= 加载框架文件开始 Start =======");
    // 监听所有请求文件
    fs.readdirSync(p('/code/src/controller')).forEach(function (file) {
        require("./controller/" + file)(app);
        console.info(file);
    });

    console.info("======= 加载框架文件结束  End  =======");

    app.use(express.static(p('/code/web'))); // 托管静态资源文件

    app.listen(80);

    console.log("服务器已经启动！监听端口：80");
};