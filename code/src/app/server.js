/**
 * 服务器模块，监听页面链接
 * Created by sirzh on 2017/6/15.
 */
module.exports = function () {
    // 框架模块
    let p = require("./path")(); // 路径解析
    let jp = require(p.base("jsonp"))(); // json解析
    let cache = require(p.base("cache"))(); // json解析
    let db = require(p.base("db"))("app.db"); // 引用db模块

    // 插件模块
    let moment = require(p("moment"));
    let express = require(p("express"));
    var session = require(p('express-session'));
    var cookieParser = require(p('cookie-parser'));

    // 系统模块
    let fs = require("fs");

    let start = function() {
        let app = express(); // 引用express模块

        app.use(cookieParser()); // 启用cookie
        app.use(session({ // 启用session
            resave: true, // don't save session if unmodified
            saveUninitialized: false, // don't create session until something stored
            secret: 'love'
        }));

        // 拦截配置文件，过滤注释
        app.use("/dispatch/**.json", function (request, response) {
            response.send(fs.readFileSync(p('/code/web/' + request.baseUrl)).toString().replace(/\/\/ .*/g, ""));
        });

        // 拦截模块文件，记录信息
        // app.use("/**.html", function (request, response, next) {
            // if(request.query.id != undefined)
            //     db.queryCondition(`select * from base_menu`, jp.c(request.query), function (data) {
            //         let ip = request.headers['x-forwarded-for'] ||
            //             request.connection.remoteAddress ||
            //             request.socket.remoteAddress ||
            //             request.connection.socket.remoteAddress;
            //         let count = data[0].count + 1;
            //         let time = moment().format('YYYY-MM-DD HH:mm:ss');
            //
            //         // 更新数据
            //         db.run(`
            //            UPDATE base_menu
            //            SET IP='${ip}',COUNT=${count},TIME='${time}'
            //            WHERE ID = '${request.query.id}'
            //         `);
            //     });
            //
            // next();
        // });

        // 拦截模块文件，记录信息
        app.use("/login.html", function (request, response, next) {
            response.redirect('/module/login/login.html');
        });

        // 拦截模块文件，记录信息
        app.use("/**", function (request, response, next) {
            var bol = false;
            for(let filter of [
                "/login.html",
                "/login.jpg",
                "/login",
            ]) {
                if(!request.baseUrl || filter == request.baseUrl || request.baseUrl.endsWith(filter)) {
                    bol = true;
                    break;
                }
            }
            if(!bol) {
                var sess = request.session;
                var loginUser = sess.user;
                var isLogined = !!loginUser;

                if(!isLogined) response.redirect('/login.html');
            }

            next();
        });

        console.info("======= 加载框架文件开始 Start =======");

        let load = function(controllerPath){
            // 监听所有请求文件
            fs.readdirSync(p(controllerPath)).forEach(function (file) {
                let filepath = controllerPath+file;
                let stats = fs.statSync(p(filepath));

                if(stats.isDirectory()) return load(filepath+"/");

                require(p(filepath))(app);

                console.info(filepath);
            });
        };

        load('/code/src/controller/');

        console.info("======= 加载框架文件结束  End  =======");

        app.use(express.static(p('/code/web'))); // 托管静态资源文件

        cache.start(); // 开始缓存

        app.listen(80);

        console.log("服务器已经启动！监听端口：80");

        return true;
    };

    return { start };
};