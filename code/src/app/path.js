/**
 * 服务器模块，监听页面链接
 * Created by sirzh on 2017/6/15.
 */
module.exports = function () {
    let fs = require('fs');

    let format = function(path){
        path = ("/" + path).replace(/\/+|\\+/g, "/");

        if(process.platform.startsWith("win"))
            path = path.substr(1, path.length).replace(/\/+/g, "\\");

        return path;
    };

    let findPath = function (path, isRelative, args) {
        let cwd = process.cwd() + "/"; // 程序运行目录

        if(isRelative) {
            cwd = __dirname + "/" + path;
        } else {
            if(~cwd.lastIndexOf('ans')) cwd = cwd.substr(0, cwd.lastIndexOf('ans') + 'ans'.length); // 项目根目录

            if(path.startsWith("/"))
                cwd += path;
            else {
                let pathIndex = format(cwd + `/program/node_modules/${path}/index.js`); // 根目录的目录
                let pathModule = format(cwd + `/program/node_modules/${path}/${path}.js`); // 根目录的目录
                if(fs.existsSync(pathIndex)) return pathIndex;
                if(fs.existsSync(pathModule)) return pathModule;
            }
        }

        return format(cwd);
    };

    findPath.base = function (path) {
        return findPath(path, true);
    };

    findPath.service = findPath.module = function (path) {
        return findPath("/code/src/module/" + path, false, ["/code/src/module/" + path + "/index.js", "/code/src/module/" + path + "/" + path + ".js"]);
    };

    findPath.format = format;

    return findPath;
};