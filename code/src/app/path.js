/**
 * 服务器模块，监听页面链接
 * Created by sirzh on 2017/6/15.
 */
module.exports = function () {
    let fs = require('fs');
    let ph = require('path');

    let format = function(path){
        path = ("/" + path).replace(/\/+|\\+/g, "/");

        if(process.platform.startsWith("win"))
            path = path.substr(1, path.length).replace(/\/+/g, "\\");

        return path;
    };

    let findPath = function (path, isRelative, args) {
        let cwd = process.cwd();
        if(cwd.includes('code')) cwd = cwd.substr(0, cwd.indexOf("code")); // 程序运行目录

        if(isRelative) {
            cwd = getPath(__dirname + ph.sep,  [path].concat(args));
        } else {
            if(path.startsWith("/") || /^[A-Za-z]:/.test(path))
                cwd = getPath(cwd, [path].concat(args));
            else {
                cwd = getPath(cwd, [`/program/node_modules/${path}/index.js`, `/program/node_modules/${path}/${path}.js`, `/program/node_modules/${path}/lib/${path}.js`, `/program/node_modules/${path}/src/index.js`]);
            }
        }

        return format(cwd);
    };

    let getPath = function (dir, paths){
        let p = dir;

        for(let a of paths) {
            if(!a) continue;
            p = !fs.existsSync(a) ? format(dir + a) : a;
            let tmp = p  + (!p.endsWith(".js") ? ".js" : "");
            if(fs.existsSync(tmp) && fs.lstatSync(tmp).isFile()) return tmp;
        }

        return p;
    }

    findPath.base = function (path) {
        return findPath(path, true);
    };

    findPath.service = findPath.module = function (path) {
        return findPath("/code/src/module/" + path, false, ["/code/src/module/" + path + "/index.js", "/code/src/module/" + path + "/" + path + ".js"]);
    };

    findPath.format = format;

    return findPath;
};