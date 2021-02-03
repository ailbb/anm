/**
 * Created by sirzh on 2018/4/16.
 */
module.exports = function (app) {
    let main = require("../../main")(); // 主框架
    let p = main.p; // 路径解析
    let db = main.db(); // 引用db模块
    let jp = main.jp; // jsonp解析
    let cache = main.cache; // 缓存
    let md5 = require(p("md5-node"));
    let bodyParser = require(p('body-parser')) // 引入中间件

    let urlencodedParser = bodyParser.urlencoded({extended:false}) // 解析urlencoded类型

    function login(request, response) {
        let username =  request.body.username, password = md5(request.body.password);

        db.queryCondition(`select * from base_user`, { username: username }, function (data) {

            if(data.length) { // 如果有记录
                if(data[0].password != password) {
                    response.send(jp.r(request.query, {
                        success: false,
                        msg: "账号或密码不正确！"
                    }));
                } else { // 登录成功
                    cache.reCache(); // 重新缓存

                    // 框架登录操作
                    request.session.regenerate(function(err) {
                        if(err){
                            return response.send(jp.r(request.query, {
                                success: false,
                                msg: "登录失败，系统错误！"+err
                            }));
                        }

                        request.session.user = data[0]; // 保存session
                        response.redirect('/module/instruction/instruction.html');
                    });
                }
            } else { // 否则进行注册
                // 更新数据
                // db.run(`
                //    INSERT into base_user (username, password) values ('${username}', '${password}')
                // `);

                response.send(jp.r(request.query, {
                    success: false,
                    msg: "登录失败，无用户！"
                }));
            }
        });
    }

    function logout(req, res, next){
        req.session.destroy(function(err) {
            if(err){
                return response.send(jp.r(request.query, {
                    success: false,
                    msg: "退出登录失败，系统错误！"+err
                }));
            }

            // res.clearCookie(identityKey);
            res.redirect('/login.html');
        });
    }

    // 退出登录
    app.get('/logout', urlencodedParser, logout);

    app.use("/login", urlencodedParser, login);

    return app;
};